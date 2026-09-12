import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Store, Star, ArrowRight, Check, X } from 'lucide-react';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { Storage, marketplaceEvents } from '../../data/storage';
import { Product, Seller } from '../../types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSeller, setSelectedSeller] = useState('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating'>('relevance');
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [minRating, setMinRating] = useState<number>(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    setProducts(Storage.getProducts());
    setSellers(Storage.getSellers());

    const handleUpdate = () => {
      setProducts(Storage.getProducts());
      setSellers(Storage.getSellers());
    };

    marketplaceEvents.addEventListener('products_updated', handleUpdate);
    marketplaceEvents.addEventListener('sellers_updated', handleUpdate);
    return () => {
      marketplaceEvents.removeEventListener('products_updated', handleUpdate);
      marketplaceEvents.removeEventListener('sellers_updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);
    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (searchQuery.trim()) {
        next.set('q', searchQuery.trim());
      } else {
        next.delete('q');
      }
      return next;
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedSeller !== 'All') {
      list = list.filter(p => p.sellerId === selectedSeller);
    }

    if (maxPrice < 2000000) {
      list = list.filter(p => p.price <= maxPrice);
    }

    if (minRating > 0) {
      list = list.filter(p => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return list;
  }, [products, searchQuery, selectedCategory, selectedSeller, maxPrice, minRating, sortBy]);

  // Check if search results contain multiple sellers offering the same product line (e.g. Air Force 1)
  const isMultiVendorMatch = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (q.includes('air force') || q.includes('af1') || q.includes('nike')) {
      const af1s = filteredProducts.filter(p => p.name.toLowerCase().includes('air force 1'));
      return af1s.length >= 2;
    }
    return false;
  }, [searchQuery, filteredProducts]);

  const categories = ['All', 'Sneakers', 'Slides', 'Classics', 'Audio', 'Phones', 'Skincare', 'Fragrance'];

  return (
    <div style={{ padding: '32px 0 64px', backgroundColor: '#F8F9FA', minHeight: '80vh' }}>
      <div className="container">
        {/* Search Bar & Header */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E4E4E7',
          marginBottom: '24px',
        }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={18}
                color="#71717A"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search products across all stores (e.g. Air Force 1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 46px',
                  backgroundColor: '#F4F4F6',
                  border: '1.5px solid #E4E4E7',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '10px', padding: '0 24px' }}>
              Search
            </button>
          </form>

          {/* Controls row: Category, Seller, Sort */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', fontSize: '0.84rem' }}>
            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, color: '#71717A' }}>Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E7',
                  backgroundColor: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Seller Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, color: '#71717A' }}>Seller:</span>
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E7',
                  backgroundColor: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                <option value="All">All Sellers</option>
                {sellers.map(s => <option key={s.id} value={s.id}>{s.businessName}</option>)}
              </select>
            </div>

            {/* Sort Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
              <span style={{ fontWeight: 600, color: '#71717A' }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E4E4E7',
                  backgroundColor: '#FFFFFF',
                  fontWeight: 600,
                }}
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Multi-Vendor Highlight Banner for Demo Scenario 2 ("Air Force 1") */}
        {isMultiVendorMatch && (
          <div style={{
            backgroundColor: '#0A0A0C',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '28px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald" style={{ backgroundColor: '#059669', color: '#FFF' }}>
                Multi-Vendor Comparison
              </span>
              <span style={{ fontSize: '0.82rem', color: '#A1A1AA' }}>
                Comparing verified sellers for: <strong>"{searchQuery}"</strong>
              </span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
              Multiple Merchants Offer This Product
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {filteredProducts.filter(p => p.name.toLowerCase().includes('air force 1')).map(item => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#18181B',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid #27272A',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#A1A1AA', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Store size={12} color="#10B981" />
                      <span>{item.sellerName}</span>
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '4px 0' }}>
                      ₦{item.price.toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
                      <Star size={12} fill="#F59E0B" color="#F59E0B" />
                      <span style={{ fontWeight: 700 }}>{item.rating}</span>
                      <span style={{ color: '#71717A' }}>• In stock: {item.stock}</span>
                    </div>
                  </div>

                  <Link
                    to={`/product/${item.id}`}
                    className="btn btn-white btn-sm"
                    style={{ borderRadius: '8px', padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    View Product
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.9rem', color: '#52525B', fontWeight: 600 }}>
            Showing <strong>{filteredProducts.length}</strong> products
            {searchQuery && <span> for "<strong>{searchQuery}</strong>"</span>}
          </span>
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid-products">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '64px 24px',
            textAlign: 'center',
            border: '1px solid #E4E4E7',
          }}>
            <Search size={40} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              No products found
            </h3>
            <p style={{ color: '#52525B', fontSize: '0.9rem', marginBottom: '20px' }}>
              We couldn't find any products matching your search criteria. Try searching for "Air Force 1", "Samba", or "iPhone".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedSeller('All');
                setSearchParams({});
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
