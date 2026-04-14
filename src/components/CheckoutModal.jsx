import React, { useState } from 'react';
import { calcPricing } from '../pricing';

const EMPTY_FORM = { name: '', email: '', address: '', card: '', expiry: '', cvv: '' };

const DISCOUNT_CODES = {
  'OAKLAND10':  { type: 'percent', value: 10,  label: '10% off' },
  'OAKLAND20':  { type: 'percent', value: 20,  label: '20% off' },
  'BALLERZ26': { type: 'percent', value: 67,  label: '67% off' },
};

function CheckoutModal({ cart, onConfirm, onClose }) {
  const [fields, setFields] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  const [codeInput, setCodeInput] = useState('');
  const [discount, setDiscount] = useState(null);
  const [codeError, setCodeError] = useState('');

  const { subtotal, savings, tax, total } = calcPricing(cart, discount);

  function applyCode() {
    const code = codeInput.trim().toUpperCase();
    if (DISCOUNT_CODES[code]) {
      setDiscount({ ...DISCOUNT_CODES[code], code });
      setCodeError('');
    } else {
      setDiscount(null);
      setCodeError('Invalid discount code.');
    }
  }

  function removeCode() {
    setDiscount(null);
    setCodeInput('');
    setCodeError('');
  }

  function validate() {
    const e = {};
    if (!fields.name.trim())                                   e.name   = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))     e.email  = 'Enter a valid email.';
    if (!fields.address.trim())                                e.address = 'Address is required.';
    if (!/^\d{16}$/.test(fields.card.replace(/\s/g, '')))     e.card   = 'Enter a 16-digit card number.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fields.expiry))     e.expiry = 'Enter expiry as MM/YY.';
    if (!/^\d{3,4}$/.test(fields.cvv))                        e.cvv    = 'Enter a 3 or 4 digit security code.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setConfirmed(true);
    onConfirm();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {confirmed ? (
          <div className="checkout-confirm">
            <div className="checkout-confirm-icon">✓</div>
            <h2>Order placed!</h2>
            <p>Thanks, {fields.name.split(' ')[0]}! Your order is being processed.</p>
            <button className="checkout-done-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h2>Checkout</h2>

            {/* Order summary */}
            <div className="checkout-summary">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="checkout-summary-row">
                  <span>{product.name} <em>x{quantity}</em></span>
                  <span>${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="checkout-summary-row checkout-summary-subtotal">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount && (
                <div className="checkout-summary-row checkout-summary-discount">
                  <span>Discount ({discount.code} — {discount.label})</span>
                  <span>−${savings.toFixed(2)}</span>
                </div>
              )}

              <div className="checkout-summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Discount code */}
            <div className="checkout-discount">
              <label className="checkout-discount-label">Discount code</label>
              {discount ? (
                <div className="checkout-discount-applied">
                  <span className="discount-badge">{discount.code} — {discount.label}</span>
                  <button type="button" className="discount-remove-btn" onClick={removeCode}>Remove</button>
                </div>
              ) : (
                <div className="checkout-discount-row">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={e => { setCodeInput(e.target.value); setCodeError(''); }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCode())}
                    placeholder="Enter code"
                    className={codeError ? 'input-error' : ''}
                  />
                  <button type="button" className="discount-apply-btn" onClick={applyCode}>
                    Apply
                  </button>
                </div>
              )}
              {codeError && <span className="field-error">{codeError}</span>}
            </div>

            {/* Checkout form */}
            <form className="checkout-form" onSubmit={handleSubmit} noValidate>
              <div className="checkout-field">
                <label htmlFor="co-name">Full name</label>
                <input
                  id="co-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={fields.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="checkout-field">
                <label htmlFor="co-email">Email</label>
                <input
                  id="co-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={fields.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="checkout-field">
                <label htmlFor="co-address">Shipping address</label>
                <input
                  id="co-address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  value={fields.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State"
                  className={errors.address ? 'input-error' : ''}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>

              <div className="checkout-field">
                <label htmlFor="co-card">Card number</label>
                <input
                  id="co-card"
                  name="card"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={fields.card}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={errors.card ? 'input-error' : ''}
                />
                {errors.card && <span className="field-error">{errors.card}</span>}
              </div>

              <div className="checkout-card-row">
                <div className="checkout-field">
                  <label htmlFor="co-expiry">Expiration date</label>
                  <input
                    id="co-expiry"
                    name="expiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={fields.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={errors.expiry ? 'input-error' : ''}
                  />
                  {errors.expiry && <span className="field-error">{errors.expiry}</span>}
                </div>

                <div className="checkout-field">
                  <label htmlFor="co-cvv">Security code</label>
                  <input
                    id="co-cvv"
                    name="cvv"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={fields.cvv}
                    onChange={handleChange}
                    placeholder="CVV"
                    maxLength={4}
                    className={errors.cvv ? 'input-error' : ''}
                  />
                  {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                </div>
              </div>

              <button type="submit" className="checkout-submit-btn">
                Place order · ${total.toFixed(2)}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
