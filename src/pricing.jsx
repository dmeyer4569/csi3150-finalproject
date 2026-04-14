export const TAX_RATE = 0.06; // 6% michigan sale tax, not dynamic
 
export function calcPricing(cart, discount = null) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discounted = subtotal;
  if (discount) {
    if (discount.type === 'percent') discounted = subtotal * (1 - discount.value / 100);
    else discounted = Math.max(0, subtotal - discount.value);
  }

  const savings = subtotal - discounted;
  const tax     = discounted * TAX_RATE;
  const total   = discounted + tax;

  return { subtotal, savings, tax, total };
}
