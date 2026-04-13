import React from 'react';

function FilterBar({ filters, setFilters, products }) {
  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <div className="filter-bar">
      <select
        value={filters.category}
        onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
      >
        <option value="none">Sort: Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}

export default FilterBar;