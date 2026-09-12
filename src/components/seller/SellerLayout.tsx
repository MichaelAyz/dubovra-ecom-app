import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Store,
  Share2,
  ExternalLink,
  ChevronDown,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ShareModal } from '../common/ShareModal';

export const SellerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeSeller, setActiveSeller, availableSellers } = useAuth();
  const location = useLocation();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [storeSwitchOpen, setStoreSwitchOpen] = useState(false);

  if (!activeSeller) {
    return (
      <div className="container" style={{ padding: '80px 1.5rem', textAlign: 'center' }}>
        <p>No active seller found.</p>
        <Link to="/seller/register" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
          Create a Store
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/seller/products', icon: Package },
    { label: 'Orders', path: '/seller/orders', icon: ShoppingBag },
    { label: 'Delivery Settings', path: '/seller/delivery', icon: Truck },
  ];

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '90vh' }}>
      <div className="container" style={{ padding: '32px 1.5rem 64px' }}>
        {/* Top Merchant Switcher & Header Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E4E4E7',
          padding: '16px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          {/* Active Store Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setStoreSwitchOpen(!storeSwitchOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 14px',
                borderRadius: '12px',
                backgroundColor: '#F8F9FA',
                border: '1px solid #E4E4E7',
              }}
            >
              <img
                src={activeSeller.logo}
                alt=""
                style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase' }}>
                  {activeSeller.businessName}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#71717A' }}>
                  dubovra.com/store/{activeSeller.slug}
                </div>
              </div>
              <ChevronDown size={16} color="#71717A" />
            </button>

            {/* Dropdown to switch merchant */}
            {storeSwitchOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '260px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                boxShadow: 'var(--shadow-elevated)',
                border: '1px solid #E4E4E7',
                padding: '8px',
                zIndex: 100,
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#71717A', padding: '6px 10px', textTransform: 'uppercase' }}>
                  Switch Managed Store
                </div>
                {availableSellers.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveSeller(s);
                      setStoreSwitchOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      backgroundColor: activeSeller.id === s.id ? '#F4F4F6' : 'transparent',
                    }}
                  >
                    <span>{s.businessName}</span>
                    {activeSeller.id === s.id && <Check size={14} color="#059669" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions: Share Store & View Storefront */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShareModalOpen(true)}
              className="btn btn-emerald btn-sm"
              style={{ borderRadius: '9999px', padding: '8px 16px', gap: '6px' }}
            >
              <Share2 size={14} />
              <span>Share Store Link</span>
            </button>

            <Link
              to={`/store/${activeSeller.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '9999px', padding: '8px 16px', gap: '6px' }}
            >
              <span>View Storefront</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* Layout with Sidebar & Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '24px',
          alignItems: 'start',
        }} className="seller-dashboard-grid">
          {/* Sidebar */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E4E4E7',
            padding: '12px',
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      backgroundColor: isActive ? '#0A0A0C' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#52525B',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Dashboard Panel Content */}
          <div>
            {children}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        storeName={activeSeller.businessName}
        storeSlug={activeSeller.slug}
      />
    </div>
  );
};
