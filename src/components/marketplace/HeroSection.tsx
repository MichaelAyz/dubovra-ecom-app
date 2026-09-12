import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Truck, ShieldCheck, ArrowRight, Store } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '32px 0 48px', borderBottom: '1px solid #F1F1F4' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'stretch',
        }}>
          {/* Left Column: Headline, Search & Value Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="section-pretitle" style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} />
              Multi-Vendor Commerce Infrastructure
            </span>

            <h1 className="headline-hero" style={{ marginBottom: '16px' }}>
              EVERYTHING YOU NEED. FROM BUSINESSES YOU TRUST.
            </h1>

            <p style={{
              fontSize: '1rem',
              color: '#52525B',
              lineHeight: 1.6,
              maxWidth: '520px',
              marginBottom: '28px',
            }}>
              Discover premium independent merchants across Nigeria. Shop directly from unique seller storefronts with seamless express delivery, escrow protection, and zero marketplace friction.
            </p>

            {/* In-Hero Search Form */}
            <form
              onSubmit={handleSearch}
              style={{
                display: 'flex',
                gap: '8px',
                maxWidth: '520px',
                marginBottom: '28px',
              }}
            >
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={18}
                  color="#71717A"
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search for 'Air Force 1', 'Apple', or 'Skincare'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 46px',
                    backgroundColor: '#F4F4F6',
                    border: '1.5px solid #E4E4E7',
                    borderRadius: '12px',
                    fontSize: '0.92rem',
                    outline: 'none',
                    fontWeight: 500,
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0 24px', borderRadius: '12px' }}
              >
                Search
              </button>
            </form>

            {/* Two Value Proposition Cards (Matches Reference Design) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              maxWidth: '520px',
            }}>
              <div style={{
                backgroundColor: '#F8F9FA',
                border: '1px solid #E4E4E7',
                borderRadius: '14px',
                padding: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Truck size={18} color="#0A0A0C" />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase' }}>
                    FAST DISPATCH
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#71717A', lineHeight: 1.4 }}>
                  Prompt same-day delivery across Lagos & Abuja with live tracking updates.
                </p>
              </div>

              <div style={{
                backgroundColor: '#F8F9FA',
                border: '1px solid #E4E4E7',
                borderRadius: '14px',
                padding: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <ShieldCheck size={18} color="#059669" />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase' }}>
                    SECURE CHECKOUT
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#71717A', lineHeight: 1.4 }}>
                  Escrow protection and simulated card/transfer payment channels.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image with Floating Merchant Tag */}
          <div style={{ position: 'relative', minHeight: '380px' }}>
            <div style={{
              width: '100%',
              height: '100%',
              minHeight: '420px',
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'var(--shadow-elevated)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85"
                alt="Urban Streetwear and Footwear"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Gradient Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.2) 60%, transparent 100%)',
              }} />

              {/* Floating Banner Card */}
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
              }}>
                <div>
                  <span className="badge badge-dark" style={{ marginBottom: '6px' }}>
                    Featured Merchant
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    Mike's Sneakers
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#52525B' }}>
                    Ikeja, Lagos • ⭐ 4.8 (142 reviews)
                  </p>
                </div>

                <Link
                  to="/store/mikes-sneakers"
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '9999px', gap: '6px' }}
                >
                  <span>Visit Store</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
