import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Store, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartPage: React.FC = () => {
  const { items, sellerName, sellerSlug, updateQuantity, removeFromCart, clearCart, subtotal, itemCount } = useCart();
  const navigate = useNavigate();

  // Estimated delivery baseline for cart preview
  const estimatedDelivery = items.length > 0 ? 2500 : 0;
  const total = subtotal + estimatedDelivery;

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: '#F8F9FA', minHeight: '75vh', padding: '80px 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '48px 32px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid #E4E4E7',
        }}>
          <ShoppingBag size={56} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
          <h2 className="headline-card" style={{ marginBottom: '8px' }}>Your Cart is Empty</h2>
          <p style={{ color: '#71717A', fontSize: '0.9rem', marginBottom: '24px' }}>
            Discover authentic products from independent sellers and enjoy direct doorstep delivery.
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ marginBottom: '28px' }}>
          <span className="section-pretitle">Order Review</span>
          <h1 className="headline-section">YOUR SHOPPING CART</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#52525B', marginTop: '4px' }}>
            <span>Fulfilling from merchant:</span>
            <Link
              to={`/store/${sellerSlug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700,
                color: '#059669',
              }}
            >
              <Store size={14} />
              <span>{sellerName}</span>
            </Link>
          </div>
        </div>

        {/* Cart Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Left Column: Items List */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E4E4E7',
            padding: '24px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid #F1F1F4',
              marginBottom: '16px',
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#71717A', textTransform: 'uppercase' }}>
                Items ({itemCount})
              </span>
              <button
                onClick={clearCart}
                style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 600 }}
              >
                Clear Cart
              </button>
            </div>

            {/* Item Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.selectedSize || ''}-${idx}`}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    paddingBottom: idx === items.length - 1 ? 0 : '20px',
                    borderBottom: idx === items.length - 1 ? 'none' : '1px solid #F1F1F4',
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#F4F4F6',
                    flexShrink: 0,
                  }}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item.productId}`}>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#0A0A0C',
                        marginBottom: '4px',
                      }}>
                        {item.product.name}
                      </h3>
                    </Link>

                    <div style={{ fontSize: '0.78rem', color: '#71717A', marginBottom: '8px' }}>
                      {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong> </span>}
                      {item.selectedColor && <span>• Color: <strong>{item.selectedColor}</strong></span>}
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0A0A0C' }}>
                      ₦{item.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F4F4F6',
                    borderRadius: '8px',
                    border: '1px solid #E4E4E7',
                    padding: '2px',
                  }}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedSize)}
                      style={{ padding: '6px', display: 'flex', color: '#0A0A0C' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ width: '28px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedSize)}
                      style={{ padding: '6px', display: 'flex', color: '#0A0A0C' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.productId, item.selectedSize)}
                    style={{ padding: '8px', color: '#9CA3AF', borderRadius: '6px' }}
                    title="Remove Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E4E4E7',
            padding: '28px',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#52525B' }}>
                <span>Subtotal ({itemCount} items)</span>
                <span style={{ fontWeight: 700, color: '#0A0A0C' }}>₦{subtotal.toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#52525B' }}>
                <span>Estimated Delivery</span>
                <span style={{ fontWeight: 700, color: '#0A0A0C' }}>₦{estimatedDelivery.toLocaleString()}</span>
              </div>

              <div style={{
                borderTop: '1px solid #F1F1F4',
                paddingTop: '16px',
                marginTop: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#0A0A0C',
              }}>
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '0.92rem',
                gap: '8px',
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            {/* Trust badge */}
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #F1F1F4',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.78rem',
              color: '#71717A',
            }}>
              <ShieldCheck size={16} color="#059669" />
              <span>Escrow protection active on all purchases</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
