import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';
import { HeroSection } from '../../components/marketplace/HeroSection';
import { SpotlightProduct } from '../../components/marketplace/SpotlightProduct';
import { FeaturedSellers } from '../../components/marketplace/FeaturedSellers';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { ShareModal } from '../../components/common/ShareModal';
import { Storage, marketplaceEvents } from '../../data/storage';
import { Product, Seller } from '../../types';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [shareSeller, setShareSeller] = useState<Seller | null>(null);

  const loadData = () => {
    setProducts(Storage.getProducts());
    setSellers(Storage.getSellers());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    marketplaceEvents.addEventListener('products_updated', handleUpdate);
    marketplaceEvents.addEventListener('sellers_updated', handleUpdate);
    return () => {
      marketplaceEvents.removeEventListener('products_updated', handleUpdate);
      marketplaceEvents.removeEventListener('sellers_updated', handleUpdate);
    };
  }, []);

  const categories = ['All', 'Sneakers', 'Slides', 'Classics', 'Audio', 'Phones', 'Skincare', 'Fragrance'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div>
      {/* 1. Asymmetric Hero */}
      <HeroSection />

      {/* 2. Spotlight Product (4-Quadrant Feature Display from Reference) */}
      <SpotlightProduct />

      {/* 3. Featured Verified Stores */}
      <FeaturedSellers
        sellers={sellers}
        onShareStore={(seller) => setShareSeller(seller)}
      />

      {/* 4. Popular Products Grid (Matches "BROWSE BACKPACK COLLECTION" in Reference) */}
      <section style={{ padding: '64px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          {/* Header & Category Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <div>
              <span className="section-pretitle">Direct From Verified Sellers</span>
              <h2 className="headline-section">
                POPULAR MARKETPLACE DROPS
              </h2>
            </div>

            <Link
              to="/search"
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '9999px', padding: '8px 18px', gap: '6px' }}
            >
              <span>Explore All Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '24px',
            scrollbarWidth: 'none',
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  backgroundColor: selectedCategory === cat ? '#0A0A0C' : '#F4F4F6',
                  color: selectedCategory === cat ? '#FFFFFF' : '#52525B',
                  border: '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid-products">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Share Modal Triggered from Seller Card */}
      {shareSeller && (
        <ShareModal
          isOpen={!!shareSeller}
          onClose={() => setShareSeller(null)}
          storeName={shareSeller.businessName}
          storeSlug={shareSeller.slug}
        />
      )}
    </div>
  );
};
