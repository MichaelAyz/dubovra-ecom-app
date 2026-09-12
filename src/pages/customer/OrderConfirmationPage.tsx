import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Store, Truck, Package, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Storage } from '../../data/storage';
import { Order } from '../../types';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const found = Storage.getOrderById(orderId);
    if (found) {
      setOrder(found);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {
        // Ignored
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#71717A' }}>Finding order details...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '85vh', padding: '48px 0 80px' }}>
      <div className="container-narrow">
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E4E4E7',
          padding: '48px 36px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
        }}>
          {/* Confirmed Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#ECFDF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <CheckCircle2 size={48} color="#059669" />
          </div>

          <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>
            Payment Approved ✓
          </span>

          <h1 className="headline-hero" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '8px' }}>
            ORDER CONFIRMED!
          </h1>

          <p style={{ fontSize: '1rem', color: '#52525B', maxWidth: '440px', margin: '0 auto 28px' }}>
            Thank you for your purchase. We have notified <strong>{order.sellerName}</strong> to prepare and dispatch your order.
          </p>

          {/* Order Details Card */}
          <div style={{
            backgroundColor: '#F8F9FA',
            borderRadius: '16px',
            border: '1px solid #E4E4E7',
            padding: '24px',
            textAlign: 'left',
            maxWidth: '520px',
            margin: '0 auto 32px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid #E4E4E7',
              marginBottom: '16px',
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A' }}>
                  Order Reference
                </span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#0A0A0C' }}>
                  #{order.id}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A' }}>
                  Merchant
                </span>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#059669' }}>
                  {order.sellerName}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={item.product.images[0]}
                      alt=""
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', backgroundColor: '#FFFFFF' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#0A0A0C' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#71717A' }}>
                        Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800 }}>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Fees */}
            <div style={{
              borderTop: '1px solid #E4E4E7',
              paddingTop: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.84rem',
              color: '#52525B',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 700, color: '#0A0A0C' }}>₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery ({order.deliveryMethod.name})</span>
                <span style={{ fontWeight: 700, color: '#0A0A0C' }}>₦{order.deliveryFee.toLocaleString()}</span>
              </div>
              <div style={{
                borderTop: '1px solid #E4E4E7',
                paddingTop: '10px',
                marginTop: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#0A0A0C',
              }}>
                <span>Total Paid</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery address & schedule */}
            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid #E4E4E7',
              fontSize: '0.8rem',
              color: '#52525B',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div><strong>Deliver to:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}</div>
              <div><strong>Recipient:</strong> {order.customerName} ({order.customerPhone})</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to={`/order/${order.id}/tracking`}
              className="btn btn-primary btn-lg"
              style={{ borderRadius: '12px', padding: '14px 28px', gap: '8px' }}
            >
              <Truck size={18} />
              <span>Track Order Live</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/"
              className="btn btn-secondary btn-lg"
              style={{ borderRadius: '12px', padding: '14px 24px' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
