import React, { useState, useEffect } from 'react';
import initialProducts from './data';

import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import Wishlist from './components/Wishlist';

function App() {
  // ── Shared state ──────────────────────────────────────────────────────────

  const [products, setProducts] = useState(initialProducts);

  const [cart, setCart] = useState([]);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('nexus_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = useState({ category: 'all', sort: 'none' });

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Local UI state — not shared, lives only here
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // ── Wishlist localStorage sync ─────────────────────────────────────────────

  useEffect(() => {
    localStorage.setItem('nexus_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function addToCart(product) {
    setProducts(prev =>
      prev.map(p =>
        p.id === product.id && p.stock > 0
          ? { ...p, stock: p.stock - 1 }
          : p
      )
    );

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCart(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (!item) return prev;

      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId
            ? { ...p, stock: p.stock + item.quantity }
            : p
        )
      );

      return prev.filter(i => i.product.id !== productId);
    });
  }

  function toggleWishlist(productId) {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }

  function setQuickView(product) {
    setQuickViewProduct(product);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      <Navbar
        cart={cart}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
      />

      <main className="main-content">
        <FilterBar filters={filters} setFilters={setFilters} products={products} />

        <ProductGrid
          products={products}
          filters={filters}
          addToCart={addToCart}
          setQuickView={setQuickView}
          toggleWishlist={toggleWishlist}
          wishlist={wishlist}
        />
      </main>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          addToCart={addToCart}
          setQuickView={setQuickView}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      )}

      {cartOpen && (
        <CartDrawer
          cart={cart}
          removeFromCart={removeFromCart}
          onClose={() => setCartOpen(false)}
        />
      )}

      {wishlistOpen && (
        <Wishlist
          wishlist={wishlist}
          products={products}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          onClose={() => setWishlistOpen(false)}
        />
      )}
    </div>
  );
}

export default App;