import React from 'react';
import { calcPricing } from '../pricing';

function CartDrawer({ cart, removeFromCart, onCheckout, onClose }) {
  const { subtotal, tax, total } = calcPricing(cart);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Cart</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <p className="drawer-empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map(({ product, quantity }) => (
                <li key={product.id} className="cart-item">
                  <span>{product.name}</span>
                  <span>x{quantity}</span>
                  <span>${(product.price * quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(product.id)}>Remove</button>
                </li>
              ))}
            </ul>

            <div className="cart-pricing">
              <div className="cart-pricing-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-pricing-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="cart-pricing-row cart-pricing-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="cart-checkout-btn" onClick={onCheckout}>
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
