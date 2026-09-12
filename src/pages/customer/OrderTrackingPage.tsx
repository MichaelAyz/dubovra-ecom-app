import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Clock,
  Truck,
  Package,
  Store,
  MapPin,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Storage, marketplaceEvents } from '../../data/storage';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus } from '../../types';

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [justUpdated, setJustUpdated] = useState(false);
  const { setRole, setActiveSeller } = useAuth();

  const loadOrder = () => {
    if (!orderId) return;
    const found = Storage.getOrderById(orderId);
    if (found) {
      setOrder(found);
    }
  };

  useEffect(() => {
    loadOrder();

    if (!orderId) return;
    const unsubscribe = orderService.subscribeToOrderUpdates(orderId, (updated) => {
      setOrder(updated);
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2500);
    });

    const handleStorage = () => loadOrder();
    marketplaceEvents.addEventListener('orders_updated', handleStorage);

    return () => {
      unsubscribe();
      marketplaceEvents.removeEventListener('orders_updated', handleStorage);
    };
  }, [orderId]);

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 1.5rem', textAlign: 'center' }}>
        <h2 className="headline-card" style={{ marginBottom: '12px' }}>Order Not Found</h2>
        <p style={{ color: '#52525B', marginBottom: '24px' }}>
          Could not find tracking records for order "#{orderId}".
        </p>
        <Link to="/" className="btn btn-primary btn-sm">Return Home</Link>
      </div>
    );
  }

  // Quick helper to jump into Seller Dashboard to test status change
  const handleJumpToSellerDashboard = () => {
    const seller = Storage.getSellerById(order.sellerId);
    if (seller) {
      setRole('seller');
      setActiveSeller(seller);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container-narrow">
        {/* Live sync banner alert */}
        <div style={{
          backgroundColor: '#0A0A0C',
          color: '#FFFFFF',
          borderRadius: '14px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          fontSize: '0.84rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 8px #10B981',
              display: 'inline-block',
            }} />
            <span>
              <strong>Real-Time Tracking Active:</strong> Linked live to <strong>{order.sellerName}</strong> dispatch console.
            </span>
          </div>

          <Link
            to="/seller/orders"
            onClick={handleJumpToSellerDashboard}
            style={{
              color: '#10B981',
              fontWeight: 700,
              textDecoration: 'underline',
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Open Seller Dashboard to update status →</span>
          </Link>
        </div>

        {/* Tracking Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E4E4E7',
          padding: '36px',
          boxShadow: 'var(--shadow-card)',
          transition: 'all 0.3s ease',
          outline: justUpdated ? '3px solid #10B981' : 'none',
        }}>
          {/* Header Row */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingBottom: '24px',
            borderBottom: '1px solid #F1F1F4',
            marginBottom: '28px',
          }}>
            <div>
              <span className="section-pretitle">Tracking Order Status</span>
              <h1 className="headline-section" style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
                ORDER #{order.id}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#52525B' }}>
                <span>Fulfillment by:</span>
                <Link
                  to={`/store/${order.sellerSlug}`}
                  style={{ fontWeight: 700, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Store size={14} />
                  <span>{order.sellerName}</span>
                </Link>
              </div>
            </div>

            {/* Current Status Pill */}
            <div style={{ textAlign: 'right' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: order.orderStatus === 'delivered'
                  ? '#ECFDF5'
                  : order.orderStatus === 'out_for_delivery'
                  ? '#FEF3C7'
                  : '#F4F4F6',
                color: order.orderStatus === 'delivered'
                  ? '#047857'
                  : order.orderStatus === 'out_for_delivery'
                  ? '#B45309'
                  : '#0A0A0C',
                fontWeight: 800,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: order.orderStatus === 'delivered' ? '#059669' : '#F59E0B',
                }} />
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
              <div style={{ fontSize: '0.75rem', color: '#71717A', marginTop: '4px' }}>
                Method: {order.deliveryMethod.name}
              </div>
            </div>
          </div>

          {/* Purchased Item Summary Strip */}
          <div style={{
            backgroundColor: '#F8F9FA',
            borderRadius: '14px',
            border: '1px solid #E4E4E7',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '36px',
            flexWrap: 'wrap',
          }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={item.product.images[0]}
                  alt=""
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '10px',
                    objectFit: 'contain',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4E4E7',
                  }}
                />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>
                    {item.product.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#52525B' }}>
                    Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0A0A0C' }}>
                ₦{order.total.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                Escrow Paid ✓
              </div>
            </div>
          </div>

          {/* Timeline Stages (The Spec Requirement!) */}
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              Delivery Progress Timeline
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
              {order.timeline.map((step, idx) => {
                const isLast = idx === order.timeline.length - 1;

                return (
                  <div key={step.status} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                    {/* Left Icon & Connecting Vertical Line */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: step.completed ? '#059669' : '#F4F4F6',
                        color: step.completed ? '#FFFFFF' : '#9CA3AF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        boxShadow: step.current ? '0 0 0 4px #A7F3D0' : 'none',
                        transition: 'all 0.3s ease',
                      }}>
                        {step.completed ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Circle size={14} />
                        )}
                      </div>

                      {!isLast && (
                        <div style={{
                          width: '2px',
                          flex: 1,
                          minHeight: '44px',
                          backgroundColor: step.completed ? '#059669' : '#E4E4E7',
                          margin: '4px 0',
                        }} />
                      )}
                    </div>

                    {/* Step Description */}
                    <div style={{ paddingBottom: isLast ? 0 : '28px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: '1rem',
                          textTransform: 'uppercase',
                          color: step.completed ? '#0A0A0C' : '#9CA3AF',
                        }}>
                          {step.label}
                        </div>

                        {step.timestamp && (
                          <span style={{ fontSize: '0.78rem', color: '#71717A', fontWeight: 600 }}>
                            {step.timestamp}
                          </span>
                        )}
                      </div>

                      <p style={{
                        fontSize: '0.84rem',
                        color: step.completed ? '#52525B' : '#A1A1AA',
                        marginTop: '2px',
                      }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address & Contact Details */}
          <div style={{
            borderTop: '1px solid #F1F1F4',
            paddingTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            fontSize: '0.85rem',
            color: '#52525B',
          }}>
            <div>
              <div style={{ fontWeight: 700, color: '#0A0A0C', marginBottom: '4px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Delivery Destination
              </div>
              <div>{order.shippingAddress.address}</div>
              <div>{order.shippingAddress.city}, {order.shippingAddress.state} State</div>
              {order.shippingAddress.instructions && (
                <div style={{ fontStyle: 'italic', marginTop: '4px', color: '#71717A' }}>
                  "{order.shippingAddress.instructions}"
                </div>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#0A0A0C', marginBottom: '4px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Recipient Contact
              </div>
              <div>{order.customerName}</div>
              <div>{order.customerPhone}</div>
              <div>{order.customerEmail}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
