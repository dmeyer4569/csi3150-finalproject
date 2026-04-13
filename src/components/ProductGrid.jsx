import React from 'react';

function ProductGrid({ products, filters, addToCart, setQuickView, toggleWishlist, wishlist }) {
  let filtered = filters.category === 'all'
    ? products
    : products.filter(p => p.category === filters.category);

  if (filters.sort === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="product-grid">
      {filtered.map(product => (
        <div key={product.id} className="product-card">
          <div className="product-image" onClick={() => setQuickView(product)}>
            {product.image ? <img src={product.image} alt={product.name} /> : <div className="image-placeholder" />}
          </div>
          <h3>{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          <div className="product-actions">
            <button onClick={() => addToCart(product)} disabled={product.stock === 0}>
              Add to Cart
            </button>
            <button onClick={() => toggleWishlist(product.id)}>
              {wishlist.includes(product.id) ? '♥' : '♡'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;