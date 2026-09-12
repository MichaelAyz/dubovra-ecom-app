import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Store, User, ChevronDown, Share2, Package, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShareModal } from './ShareModal';

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { role, setRole, activeSeller, setActiveSeller, availableSellers } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isSellerDashboard = location.pathname.startsWith('/seller');

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF' }}>
        {/* Top Announcement Bar (Reference Design) */}
        <div style={{
          backgroundColor: '#0A0A0C',
          color: '#F4F4F5',
          padding: '8px 16px',
          fontSize: '0.78rem',
          fontWeight: 600,
          textAlign: 'center',
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          <span>ENJOY EXCLUSIVE ESCROW-PROTECTED COMMERCE ACROSS NIGERIA</span>
          <span style={{ color: '#F59E0B' }}>•</span>
          <span style={{ color: '#D1D5DB' }}>SAME-DAY DISPATCH ACROSS LAGOS & ABUJA</span>
        </div>

        {/* Main Navbar */}
        <div style={{
          borderBottom: '1px solid #E4E4E7',
          backgroundColor: '#FFFFFF',
        }}>
          <div className="container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '74px',
            gap: '24px',
          }}>
            {/* Left: Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <Link
                to="/"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: '#0A0A0C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>DUBOVRA</span>
                <span style={{
                  display: 'inline-block',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                }} />
              </Link>

              {/* Navigation Links */}
              <nav style={{ display: 'none', alignItems: 'center', gap: '22px' }} className="desktop-nav">
                <Link
                  to="/"
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: location.pathname === '/' ? '#0A0A0C' : '#52525B',
                    borderBottom: location.pathname === '/' ? '2px solid #0A0A0C' : '2px solid transparent',
                    paddingBottom: '4px',
                  }}
                >
                  Marketplace
                </Link>
                <Link
                  to="/search?q=Air+Force"
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#52525B',
                  }}
                >
                  Sneakers
                </Link>
                <Link
                  to="/search?category=Audio"
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#52525B',
                  }}
                >
                  Electronics
                </Link>
                <Link
                  to="/search?category=Skincare"
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#52525B',
                  }}
                >
                  Beauty
                </Link>
                <a
                  href="/#featured-sellers"
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#52525B',
                  }}
                >
                  Stores
                </a>
              </nav>
            </div>

            {/* Middle: Global Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                flex: '1',
                maxWidth: '380px',
                position: 'relative',
                display: 'none',
              }}
              className="desktop-search"
            >
              <Search
                size={16}
                color="#71717A"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Search products, brands or stores (e.g. Air Force 1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 16px 9px 40px',
                  backgroundColor: '#F4F4F6',
                  border: '1px solid transparent',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0A0A0C';
                  e.target.style.backgroundColor = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'transparent';
                  e.target.style.backgroundColor = '#F4F4F6';
                }}
              />
            </form>

            {/* Right: Actions, Switcher & Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* My Orders link */}
              <Link
                to="/orders"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#52525B',
                  padding: '6px 10px',
                  borderRadius: '8px',
                }}
                title="View My Orders"
              >
                <Package size={17} />
                <span className="hidden-mobile">Orders</span>
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#F4F4F6',
                  color: '#0A0A0C',
                  transition: 'background-color 0.15s ease',
                }}
                title="View Cart"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    backgroundColor: '#0A0A0C',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    width: '19px',
                    height: '19px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}>
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Demo Mode / Role Switcher Pill */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    backgroundColor: role === 'seller' ? '#0A0A0C' : '#F4F4F6',
                    color: role === 'seller' ? '#FFFFFF' : '#0A0A0C',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid #E4E4E7',
                  }}
                >
                  {role === 'seller' ? (
                    <>
                      <Store size={14} color="#10B981" />
                      <span>Store: {activeSeller?.businessName || 'Seller'}</span>
                    </>
                  ) : (
                    <>
                      <User size={14} />
                      <span>Customer Mode</span>
                    </>
                  )}
                  <ChevronDown size={14} />
                </button>

                {/* Dropdown Menu */}
                {showRoleDropdown && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '260px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    boxShadow: '0 20px 35px -5px rgba(0,0,0,0.2)',
                    border: '1px solid #E4E4E7',
                    padding: '8px',
                    zIndex: 1000,
                  }}>
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F1F4' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#71717A', textTransform: 'uppercase' }}>
                        Prototype Role Switcher
                      </span>
                    </div>

                    {/* Customer Option */}
                    <button
                      onClick={() => {
                        setRole('customer');
                        setShowRoleDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        backgroundColor: role === 'customer' ? '#F4F4F6' : 'transparent',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} />
                        <div>
                          <div>Customer (John Doe)</div>
                          <div style={{ fontSize: '0.72rem', color: '#71717A', fontWeight: 400 }}>Browse & Purchase</div>
                        </div>
                      </div>
                      {role === 'customer' && <Check size={16} color="#059669" />}
                    </button>

                    <div style={{ margin: '6px 0', borderTop: '1px solid #F1F1F4' }} />

                    <div style={{ padding: '4px 10px 6px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#71717A', textTransform: 'uppercase' }}>
                        Switch Seller Store
                      </span>
                    </div>

                    {/* Sellers List */}
                    {availableSellers.map((seller) => (
                      <button
                        key={seller.id}
                        onClick={() => {
                          setRole('seller');
                          setActiveSeller(seller);
                          setShowRoleDropdown(false);
                          navigate('/seller/dashboard');
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.84rem',
                          fontWeight: 500,
                          backgroundColor: role === 'seller' && activeSeller?.id === seller.id ? '#F4F4F6' : 'transparent',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Store size={15} color="#059669" />
                          <span>{seller.businessName}</span>
                        </div>
                        {role === 'seller' && activeSeller?.id === seller.id && (
                          <Check size={15} color="#059669" />
                        )}
                      </button>
                    ))}

                    <div style={{ margin: '6px 0', borderTop: '1px solid #F1F1F4' }} />

                    {/* Onboard New Store Link */}
                    <Link
                      to="/seller/register"
                      onClick={() => setShowRoleDropdown(false)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: '#059669',
                        backgroundColor: '#ECFDF5',
                      }}
                    >
                      <span>+ Create New Store</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Seller Quick Action: Share Store Link Button */}
              {role === 'seller' && activeSeller && (
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="btn btn-emerald btn-sm"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '6px' }}
                  title="Share Store Link"
                >
                  <Share2 size={13} />
                  <span>Share Store</span>
                </button>
              )}

              {/* Become a Seller CTA if in Customer mode */}
              {role === 'customer' && (
                <Link
                  to="/seller/register"
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.8rem', padding: '7px 14px' }}
                >
                  Become a Seller
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {activeSeller && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          storeName={activeSeller.businessName}
          storeSlug={activeSeller.slug}
        />
      )}
    </>
  );
};
