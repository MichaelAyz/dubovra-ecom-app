import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Store } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  showSeller?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showSeller = true,
}) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAEAEA',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
      className="product-card-hover"
    >
      {/* Image Container */}
      <Link
        to={`/product/${product.id}`}
        style={{
          position: 'relative',
          backgroundColor: '#F4F4F6',
          paddingTop: '90%', // aspect ratio
          overflow: 'hidden',
          display: 'block',
        }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          className="product-card-img"
        />

        {/* Badge if available */}
        {product.badge && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: '#0A0A0C',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '4px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Quick Add Overlay Button */}
        <button
          onClick={handleQuickAdd}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: '#0A0A0C',
            color: '#FFFFFF',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.15s ease',
          }}
          title="Quick Add to Cart"
        >
          <ShoppingBag size={16} />
        </button>
      </Link>

      {/* Product Information */}
      <div style={{ padding: '16px 14px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Seller link & rating */}
        {showSeller && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: '#71717A',
            marginBottom: '6px',
          }}>
            <Link
              to={`/store/${product.sellerSlug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
                color: '#52525B',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Store size={12} color="#059669" />
              <span>{product.sellerName}</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={12} fill="#F59E0B" color="#F59E0B" />
              <span style={{ fontWeight: 700, color: '#18181B' }}>{product.rating}</span>
            </div>
          </div>
        )}

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: '#0A0A0C',
              lineHeight: 1.25,
              marginBottom: '8px',
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price and Color Swatches (Directly matches Reference Design) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '6px',
        }}>
          <div>
            <span style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: '#0A0A0C',
            }}>
              ₦{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span style={{
                fontSize: '0.78rem',
                color: '#A1A1AA',
                textDecoration: 'line-through',
                marginLeft: '6px',
              }}>
                ₦{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color Dots Swatch */}
          {product.colorDots && product.colorDots.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {product.colorDots.map((hex, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: hex,
                    border: hex === '#FFFFFF' ? '1px solid #D4D4D8' : 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
