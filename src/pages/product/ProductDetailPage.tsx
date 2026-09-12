import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Store,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ArrowRight,
  Share2,
  Minus,
  Plus,
  ShoppingBag
} from 'lucide-react';
import { Storage, marketplaceEvents } from '../../data/storage';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Product, Seller } from '../../types';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    const p = Storage.getProductById(productId);
    if (p) {
      setProduct(p);
      setSelectedImage(p.images[0]);
      if (p.variants.sizes && p.variants.sizes.length > 0) {
        setSelectedSize(p.variants.sizes[0]);
      }
      if (p.variants.colors && p.variants.colors.length > 0) {
        setSelectedColor(p.variants.colors[0]);
      }
      const s = Storage.getSellerById(p.sellerId);
      if (s) setSeller(s);
    }
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#71717A' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 1.5rem', textAlign: 'center' }}>
        <h2 className="headline-card" style={{ marginBottom: '12px' }}>Product Not Found</h2>
        <p style={{ color: '#52525B', marginBottom: '24px' }}>The product you requested does not exist or has been removed.</p>
        <Link to="/" className="btn btn-primary btn-sm">Return to Marketplace</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    const success = addToCart(product, quantity, selectedSize, selectedColor);
    if (success) {
      navigate('/checkout');
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', padding: '32px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#71717A', marginBottom: '28px' }}>
          <Link to="/" style={{ color: '#52525B' }}>Home</Link>
          <span>/</span>
          <Link to={`/store/${product.sellerSlug}`} style={{ color: '#52525B' }}>{product.sellerName}</Link>
          <span>/</span>
          <span style={{ color: '#0A0A0C', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}>
          {/* Left Column: Image Gallery */}
          <div>
            {/* Main Featured Photo */}
            <div style={{
              backgroundColor: '#F4F4F6',
              borderRadius: '20px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '16px',
              boxShadow: 'var(--shadow-card)',
            }}>
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                style={{
                  width: '100%',
                  maxHeight: '440px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                }}
              />

              {product.badge && (
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: '#0A0A0C',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                }}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#F4F4F6',
                      border: selectedImage === img ? '2px solid #0A0A0C' : '1px solid #E4E4E7',
                      padding: '4px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Variants, Pricing & Actions */}
          <div>
            {/* Seller Pill & Rating */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}>
              <Link
                to={`/store/${product.sellerSlug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#059669',
                  backgroundColor: '#ECFDF5',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                }}
              >
                <Store size={14} />
                <span>Sold by {product.sellerName}</span>
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem' }}>
                <Star size={15} fill="#F59E0B" color="#F59E0B" />
                <span style={{ fontWeight: 800, color: '#0A0A0C' }}>{product.rating}</span>
                <span style={{ color: '#71717A' }}>({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#0A0A0C',
              lineHeight: 1.15,
              marginBottom: '14px',
            }}>
              {product.name}
            </h1>

            {/* Price Tag */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
              <span style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#0A0A0C',
              }}>
                ₦{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span style={{
                  fontSize: '1.1rem',
                  color: '#A1A1AA',
                  textDecoration: 'line-through',
                }}>
                  ₦{product.compareAtPrice.toLocaleString()}
                </span>
              )}
              <span style={{
                fontSize: '0.78rem',
                color: product.stock > 0 ? '#059669' : '#DC2626',
                fontWeight: 700,
                backgroundColor: product.stock > 0 ? '#ECFDF5' : '#FEE2E2',
                padding: '3px 8px',
                borderRadius: '6px',
              }}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.92rem', color: '#52525B', lineHeight: 1.6, marginBottom: '24px' }}>
              {product.description}
            </p>

            {/* Size Variants (if any) */}
            {product.variants.sizes && product.variants.sizes.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#0A0A0C' }}>
                    Select Size: <strong>{selectedSize}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.variants.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        minWidth: '46px',
                        height: '42px',
                        padding: '0 12px',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        backgroundColor: selectedSize === sz ? '#0A0A0C' : '#F4F4F6',
                        color: selectedSize === sz ? '#FFFFFF' : '#18181B',
                        border: selectedSize === sz ? '1.5px solid #0A0A0C' : '1px solid #E4E4E7',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div style={{ marginBottom: '28px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#0A0A0C', display: 'block', marginBottom: '8px' }}>
                Quantity:
              </span>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#F4F4F6',
                borderRadius: '10px',
                border: '1px solid #E4E4E7',
                padding: '4px',
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    color: '#0A0A0C',
                  }}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span style={{ width: '44px', textAlign: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    color: '#0A0A0C',
                  }}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions: Add to Cart and Buy Now */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '32px' }}>
              <button
                onClick={handleAddToCart}
                className="btn btn-secondary btn-lg"
                style={{ borderRadius: '12px', gap: '8px' }}
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="btn btn-primary btn-lg"
                style={{ borderRadius: '12px', gap: '8px' }}
              >
                <span>Buy Now</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Seller Delivery & Dispatch Promises Box */}
            {seller && (
              <div style={{
                backgroundColor: '#F8F9FA',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #E4E4E7',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Truck size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A0A0C' }}>
                      Fulfilled directly by {seller.businessName}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#52525B', marginTop: '2px' }}>
                      {seller.policies.dispatch}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <ShieldCheck size={20} color="#0A0A0C" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A0A0C' }}>
                      Dubovra Escrow Protection
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#52525B', marginTop: '2px' }}>
                      Your payment is safely held until package delivery is confirmed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
