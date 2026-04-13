import React from 'react';

function Navbar({ cart, onCartOpen, onWishlistOpen }) {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-brand">Nexus Shop</div>
      <div className="navbar-actions">
        <button onClick={onWishlistOpen}>Wishlist</button>
        <button onClick={onCartOpen}>Cart ({cartCount})</button>
      </div>
    </nav>
  );
}

export default Navbar;