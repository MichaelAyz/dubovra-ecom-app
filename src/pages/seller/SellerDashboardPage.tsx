import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Clock,
  TrendingUp,
  Share2,
  Copy,
  Check,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { SellerLayout } from '../../components/seller/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Storage, marketplaceEvents } from '../../data/storage';
import { orderService } from '../../services/orderService';
import { Order, Product, OrderStatus } from '../../types';

export const SellerDashboardPage: React.FC = () => {
  const { activeSeller } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [copied, setCopied] = useState(false);

  const loadData = () => {
    if (!activeSeller) return;
    setProducts(Storage.getProducts(activeSeller.id));
    setOrders(Storage.getOrders(activeSeller.id));
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    marketplaceEvents.addEventListener('orders_updated', handleUpdate);
    marketplaceEvents.addEventListener('products_updated', handleUpdate);
    return () => {
      marketplaceEvents.removeEventListener('orders_updated', handleUpdate);
      marketplaceEvents.removeEventListener('products_updated', handleUpdate);
    };
  }, [activeSeller]);

  if (!activeSeller) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dubovra.com';
  const fullStoreUrl = `${origin}/store/${activeSeller.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullStoreUrl);
    setCopied(true);
    showToast('Store link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} updated to ${newStatus.replace(/_/g, ' ')}`);
  };

  const pendingCount = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);

  return (
    <SellerLayout>
      {/* 1. Shareable Storefront Link Banner (The Star Feature) */}
      <div style={{
        backgroundColor: '#0A0A0C',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10B981' }}>
            Your Live Shareable Storefront
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>
            Share Link Directly with Customers
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#A1A1AA', marginTop: '2px' }}>
            Customers clicking this link skip the marketplace and enter your dedicated store directly.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#18181B',
          border: '1px solid #27272A',
          borderRadius: '10px',
          padding: '8px 14px',
        }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#FFFFFF' }}>
            {fullStoreUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="btn btn-white btn-sm"
            style={{ padding: '6px 14px', fontSize: '0.78rem', gap: '6px' }}
          >
            {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Overview (Section 16 Specification) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* Total Products */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E4E4E7', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717A', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Products</span>
            <Package size={18} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>
            {products.length || 24}
          </div>
        </div>

        {/* Total Orders */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E4E4E7', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717A', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Orders</span>
            <ShoppingBag size={18} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>
            {orders.length}
          </div>
        </div>

        {/* Pending Orders */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E4E4E7', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717A', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Pending Orders</span>
            <Clock size={18} color="#F59E0B" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B' }}>
            {pendingCount}
          </div>
        </div>

        {/* Total Sales */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E4E4E7', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717A', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Sales</span>
            <TrendingUp size={18} color="#059669" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>
            ₦{totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 3. Recent Orders Table (Section 16 Specification) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E4E4E7',
        padding: '24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Recent Incoming Orders
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#71717A' }}>
              Updating status here syncs live to the customer tracking page.
            </span>
          </div>

          <Link to="/seller/orders" className="btn btn-secondary btn-sm" style={{ gap: '4px' }}>
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E4E4E7', textAlign: 'left', color: '#71717A' }}>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>Order</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>Customer</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>Item</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>Update Status</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem', textAlign: 'center' }}>Track</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #F1F1F4' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    #{order.id}
                  </td>
                  <td style={{ padding: '14px 12px', fontWeight: 600 }}>
                    {order.customerName}
                  </td>
                  <td style={{ padding: '14px 12px', color: '#52525B' }}>
                    {order.items[0]?.product.name}
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: 700 }}>
                    ₦{order.total.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    {/* Live Status Switcher Dropdown */}
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
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
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <Link
                      to={`/order/${order.id}/tracking`}
                      target="_blank"
                      style={{
                        color: '#059669',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                      title="Open Live Tracking View"
                    >
                      <span>Track</span>
                      <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  );
};
