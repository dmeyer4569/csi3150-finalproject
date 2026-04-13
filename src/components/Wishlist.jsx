import React from 'react';

function Wishlist({ wishlist, products, toggleWishlist, addToCart, onClose }) {
  const wishlisted = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Wishlist</h2>
          <button onClick={onClose}>✕</button>
        </div>
        {wishlisted.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <ul className="wishlist-list">
            {wishlisted.map(product => (
              <li key={product.id} className="wishlist-item">
                <span>{product.name}</span>
                <span>${product.price.toFixed(2)}</span>
                <button onClick={() => addToCart(product)} disabled={product.stock === 0}>
                  Add to Cart
                </button>
                <button onClick={() => toggleWishlist(product.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
