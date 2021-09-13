import classes from './Cart.module.css'
import Modal from '../UI/Modal'
import { useContext, useState, Fragment } from 'react'
import CartContext from '../../store/cart-context'
import CartItem from './CartItem'
import Checkout from './Checkout'

const Cart = props => {
    const [isInCheckout, setIsInCheckout] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [didSubmit, setDidSubmit] = useState(false)
    const cartCtx = useContext(CartContext)

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`
    const hasItems = cartCtx.items.length > 0
    const cartItemRemoveHandler = (id) => { cartCtx.removeItem(id) }
    const cartItemAddHandler = (item) => { cartCtx.addItem({ ...item, amount: 1 }) }

    const cartItems = <ul className={classes['cart-items']}>{cartCtx.items.map(item => <CartItem
        key={item.id}
        name={item.name}
        amount={item.amount}
        price={item.price}
        onRemove={cartItemRemoveHandler.bind(null, item.id)}
        onAdd={cartItemAddHandler.bind(null, item)}
    />)}</ul>

    const orderHandler = () => { setIsInCheckout(true) }

    const submitOrderHandler = async (userData) => {
        setIsSubmiting(true)
        const response = await fetch('https://reactmeals-169b6-default-rtdb.firebaseio.com/orders.json', {
            method: 'POST',
            body: JSON.stringify({
                user: userData,
                orderedItems: cartCtx.items
            })
        })
        setIsSubmiting(false)
        setDidSubmit(true)
        cartCtx.clearCart()
    }

    const actionsDiv =
        <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={props.onHideCart}>Close</button>
            {hasItems && <button className={classes['button']} onClick={orderHandler}>Order</button>}
        </div>

    const cartModalContent = <Fragment> {cartItems}
        <div className={classes.total}>
            <span>Total Amount</span>
            <span>{totalAmount}</span>
        </div>
        {isInCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onHideCart} />}
        {!isInCheckout && actionsDiv}
    </Fragment>

    const isSubmitingModalContent = <Fragment><p>Sending order data...</p>
        <div className={classes.actions}>
            <button className={classes['button']} onClick={props.onHideCart}>Close</button>
        </div>
    </Fragment>

    const didSubmitModalContent = <Fragment><p>Successfully sent the order!</p>
        <div className={classes.actions}>
            <button className={classes['button']} onClick={props.onHideCart}>Close</button>
        </div>
    </Fragment>

    return <Modal onClick={props.onHideCart}>
        {!isSubmiting && !didSubmit && cartModalContent}
        {isSubmiting && isSubmitingModalContent}
        {!isSubmiting && didSubmit && didSubmitModalContent}
    </Modal>
}

export default Cart