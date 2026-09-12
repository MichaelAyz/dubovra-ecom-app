import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ExternalLink, Filter, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { SellerLayout } from '../../components/seller/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Storage, marketplaceEvents } from '../../data/storage';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';

export const SellerOrdersPage: React.FC = () => {
  const { activeSeller } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const loadOrders = () => {
    if (!activeSeller) return;
    setOrders(Storage.getOrders(activeSeller.id));
  };

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    marketplaceEvents.addEventListener('orders_updated', handleUpdate);
    return () => {
      marketplaceEvents.removeEventListener('orders_updated', handleUpdate);
    };
  }, [activeSeller]);

  if (!activeSeller) return null;

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} set to "${newStatus.replace(/_/g, ' ')}"`);
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === filterStatus);

  return (
    <SellerLayout>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E4E4E7',
        padding: '24px',
      }}>
        {/* Header & Filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Order Fulfillment Console
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#71717A' }}>
              Select any order status dropdown below to dispatch updates to the customer's live tracking view.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A' }}>
              Filter:
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #E4E4E7',
                fontSize: '0.84rem',
                fontWeight: 600,
                backgroundColor: '#F8F9FA',
              }}
            >
              <option value="all">All Orders ({orders.length})</option>
              <option value="processing">Processing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Card List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#71717A' }}>
              No orders found matching this filter.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #E4E4E7',
                  borderRadius: '14px',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  transition: 'all 0.15s ease',
                  boxShadow: 'var(--shadow-subtle)',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '14px',
                  borderBottom: '1px solid #F1F1F4',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#0A0A0C',
                    }}>
                      #{order.id}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#71717A' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Status Dropdown Controller (The Hero Feature!) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A' }}>
                      Status:
                    </span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        backgroundColor: order.orderStatus === 'delivered'
                          ? '#ECFDF5'
                          : order.orderStatus === 'out_for_delivery'
                          ? '#FEF3C7'
                          : '#0A0A0C',
                        color: order.orderStatus === 'delivered'
                          ? '#047857'
                          : order.orderStatus === 'out_for_delivery'
                          ? '#B45309'
                          : '#FFFFFF',
                        border: '1px solid #E4E4E7',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="payment_confirmed">Payment Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="ready_for_delivery">Ready for Delivery</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <Link
                      to={`/order/${order.id}/tracking`}
                      target="_blank"
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', gap: '4px' }}
                      title="Open Live Customer Tracking View"
                    >
                      <span>Track Live</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>

                {/* Body: Items and Customer Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px',
                  alignItems: 'center',
                }}>
                  {/* Items */}
                  <div>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.product.images[0]}
                          alt=""
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'contain', backgroundColor: '#F4F4F6' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.product.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#71717A' }}>
                            Quantity: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Details */}
                  <div style={{ fontSize: '0.82rem', color: '#52525B' }}>
                    <div style={{ fontWeight: 700, color: '#0A0A0C', marginBottom: '2px' }}>
                      {order.customerName} ({order.customerPhone})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="#71717A" />
                      <span>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    </div>
                    <div style={{ color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                      {order.deliveryMethod.name} (₦{order.deliveryFee.toLocaleString()})
                    </div>
                  </div>

                  {/* Total & Payment Method */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0A0A0C' }}>
                      ₦{order.total.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                      Paid via {order.paymentMethod.replace('_', ' ')} ✓
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SellerLayout>
  );
};
