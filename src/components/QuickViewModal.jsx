import React from 'react';

function QuickViewModal({ product, addToCart, setQuickView, wishlist, toggleWishlist }) {
  return (
    <div className="modal-overlay" onClick={() => setQuickView(null)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setQuickView(null)}>✕</button>
        <h2>{product.name}</h2>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <div className="modal-actions">
          <button onClick={() => addToCart(product)} disabled={product.stock === 0}>
            Add to Cart
          </button>
          <button onClick={() => toggleWishlist(product.id)}>
            {wishlist.includes(product.id) ? '♥ Wishlisted' : '♡ Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;