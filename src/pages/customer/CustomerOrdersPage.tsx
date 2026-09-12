import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, Store, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Storage, marketplaceEvents } from '../../data/storage';
import { Order } from '../../types';

export const CustomerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = () => {
    // Return all customer orders
    setOrders(Storage.getOrders());
  };

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    marketplaceEvents.addEventListener('orders_updated', handleUpdate);
    return () => {
      marketplaceEvents.removeEventListener('orders_updated', handleUpdate);
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '28px' }}>
          <span className="section-pretitle">Account Management</span>
          <h1 className="headline-section">MY ORDERS</h1>
          <p style={{ fontSize: '0.9rem', color: '#52525B', marginTop: '4px' }}>
            Review status, past receipts, and live courier tracking for all merchant purchases.
          </p>
        </div>

        {orders.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E4E4E7',
            padding: '48px',
            textAlign: 'center',
          }}>
            <Package size={48} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
            <h3 className="headline-card" style={{ marginBottom: '8px' }}>No orders placed yet</h3>
            <p style={{ color: '#52525B', fontSize: '0.9rem', marginBottom: '24px' }}>
              Explore the marketplace or visit individual seller storefronts to start shopping.
            </p>
            <Link to="/" className="btn btn-primary btn-sm">Explore Marketplace</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E4E4E7',
                  padding: '24px',
                  boxShadow: 'var(--shadow-subtle)',
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #F1F1F4',
                  marginBottom: '16px',
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#71717A', textTransform: 'uppercase' }}>
                      Order Ref
                    </span>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800 }}>
                      #{order.id}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link
                      to={`/store/${order.sellerSlug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#52525B',
                      }}
                    >
                      <Store size={14} color="#059669" />
                      <span>{order.sellerName}</span>
                    </Link>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
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
                      textTransform: 'uppercase',
                    }}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={order.items[0]?.product.images[0]}
                      alt=""
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '10px',
                        objectFit: 'contain',
                        backgroundColor: '#F4F4F6',
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0A0A0C' }}>
                        {order.items[0]?.product.name}
                        {order.items.length > 1 && ` + ${order.items.length - 1} more items`}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#71717A' }}>
                        Total Paid: <strong>₦{order.total.toLocaleString()}</strong> • {order.deliveryMethod.name}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      to={`/order/${order.id}/tracking`}
                      className="btn btn-primary btn-sm"
                      style={{ borderRadius: '8px', padding: '8px 16px', gap: '6px' }}
                    >
                      <Truck size={14} />
                      <span>Track Order</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
