import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Store,
  MapPin,
  Star,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Package,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Storage, marketplaceEvents } from '../../data/storage';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { ShareModal } from '../../components/common/ShareModal';
import { Seller, Product } from '../../types';

export const StorefrontPage: React.FC = () => {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStoreData = () => {
    if (!storeSlug) return;
    const foundSeller = Storage.getSellerBySlug(storeSlug);
    if (foundSeller) {
      setSeller(foundSeller);
      const sellerProds = Storage.getProducts(foundSeller.id);
      setProducts(sellerProds);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStoreData();
    const handleUpdate = () => loadStoreData();
    marketplaceEvents.addEventListener('sellers_updated', handleUpdate);
    marketplaceEvents.addEventListener('products_updated', handleUpdate);
    return () => {
      marketplaceEvents.removeEventListener('sellers_updated', handleUpdate);
      marketplaceEvents.removeEventListener('products_updated', handleUpdate);
    };
  }, [storeSlug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', color: '#71717A' }}>Loading storefront...</div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="container" style={{ padding: '80px 1.5rem', textAlign: 'center' }}>
        <Store size={48} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
        <h2 className="headline-card" style={{ marginBottom: '8px' }}>Storefront Not Found</h2>
        <p style={{ color: '#52525B', marginBottom: '24px' }}>
          We could not locate a storefront with the address "/store/{storeSlug}".
        </p>
        <Link to="/" className="btn btn-primary btn-sm">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const storeCategories = ['All', ...seller.categories];
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* 1. Store Header & Hero Banner */}
      <div style={{ position: 'relative', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4E4E7' }}>
        {/* Cover Photo */}
        <div style={{
          position: 'relative',
          height: '240px',
          width: '100%',
          backgroundColor: '#0A0A0C',
        }}>
          <img
            src={seller.coverImage}
            alt={seller.businessName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          }} />

          {/* Back to marketplace pill */}
          <div className="container" style={{ position: 'relative', height: '100%' }}>
            <Link
              to="/"
              style={{
                position: 'absolute',
                top: '20px',
                left: '1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(6px)',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Store Profile Info Bar */}
        <div className="container">
          <div style={{
            position: 'relative',
            marginTop: '-44px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            paddingBottom: '24px',
          }}>
            {/* Left: Avatar & Title */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
              {/* Store Avatar */}
              <div style={{
                width: '88px',
                height: '88px',
                borderRadius: '20px',
                border: '4px solid #FFFFFF',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                boxShadow: 'var(--shadow-card)',
                flexShrink: 0,
              }}>
                <img
                  src={seller.logo}
                  alt={seller.businessName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Names & Badges */}
              <div style={{ paddingBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#0A0A0C',
                    lineHeight: 1.1,
                  }}>
                    {seller.businessName}
                  </h1>
                  <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} />
                    Verified Merchant
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.85rem',
                  color: '#52525B',
                  marginTop: '6px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#71717A" />
                    {seller.location}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700, color: '#18181B' }}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    {seller.rating}
                    <span style={{ color: '#71717A', fontWeight: 400 }}>({seller.reviewCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Package size={14} color="#71717A" />
                    {products.length} Products
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Flagship Share Store CTA Button (The Core Feature!) */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShareModalOpen(true)}
                className="btn btn-primary"
                style={{
                  borderRadius: '9999px',
                  padding: '10px 22px',
                  fontSize: '0.88rem',
                  gap: '8px',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <Share2 size={16} />
                <span>Share Store</span>
              </button>
            </div>
          </div>

          {/* Store Description & Policy Bar */}
          <div style={{
            borderTop: '1px solid #F1F1F4',
            paddingTop: '16px',
            paddingBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            fontSize: '0.85rem',
          }}>
            <div>
              <p style={{ color: '#52525B', lineHeight: 1.5 }}>
                {seller.description}
              </p>
            </div>

            {/* Delivery Promises */}
            <div style={{
              backgroundColor: '#F8F9FA',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid #E4E4E7',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#0A0A0C', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <Truck size={14} color="#059669" />
                <span>Direct Store Delivery Policy</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#52525B' }}>
                {seller.deliveryOptions.map(opt => (
                  <span key={opt.id} style={{ display: 'block' }}>
                    <strong>{opt.name} ({opt.zone}):</strong> ₦{opt.fee.toLocaleString()} ({opt.duration})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Store Catalog Section */}
      <div className="container" style={{ paddingTop: '36px' }}>
        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', marginRight: '6px' }}>
              Categories:
            </span>
            {storeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  backgroundColor: selectedCategory === cat ? '#0A0A0C' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : '#52525B',
                  border: '1px solid #E4E4E7',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '0.84rem', color: '#71717A' }}>
            Showing <strong>{filteredProducts.length}</strong> items
          </span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid-products">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showSeller={false} // Don't need seller badge when we're inside the seller's own storefront!
              />
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px solid #E4E4E7',
          }}>
            <p style={{ color: '#71717A' }}>No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Share Store Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        storeName={seller.businessName}
        storeSlug={seller.slug}
      />
    </div>
  );
};
