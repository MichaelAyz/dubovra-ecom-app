import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, CloudRain, Zap, ArrowRight } from 'lucide-react';

export const SpotlightProduct: React.FC = () => {
  return (
    <section style={{ padding: '64px 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid #F1F1F4' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span className="section-pretitle" style={{ color: '#0A0A0C' }}>
            BEST PRODUCT SPOTLIGHT
          </span>
          <h2 className="headline-section" style={{ marginBottom: '12px' }}>
            NIKE AIR FORCE 1 '07
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#52525B', lineHeight: 1.5 }}>
            Directly sourced from Mike's Sneakers. Pristine triple white leather, verified deadstock authenticity, and iconic all-day comfort.
          </p>
        </div>

        {/* 4-Quadrant Feature Display Flanking Central Product Image */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr 1fr',
          gap: '24px',
          alignItems: 'center',
        }} className="spotlight-grid">
          {/* Left Column Callouts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Callout 1 */}
            <div style={{
              backgroundColor: '#F8F9FA',
              border: '1px solid #E4E4E7',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <Shield size={24} color="#0A0A0C" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                AUTHENTIC LEATHER
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#71717A', lineHeight: 1.4 }}>
                Full-grain premium leather upper that breaks in flawlessly with time.
              </p>
            </div>

            {/* Callout 2 */}
            <div style={{
              backgroundColor: '#F8F9FA',
              border: '1px solid #E4E4E7',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <CloudRain size={24} color="#0A0A0C" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                WEATHER RESISTANT
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#71717A', lineHeight: 1.4 }}>
                Stitched cupsole perimeter and durable rubber traction built to last.
              </p>
            </div>
          </div>

          {/* Central Product Showcase Image */}
          <div style={{
            position: 'relative',
            backgroundColor: '#F4F4F6',
            borderRadius: '24px',
            padding: '36px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=85"
              alt="Nike Air Force 1 '07"
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))',
                transform: 'rotate(-8deg)',
              }}
            />

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0A0A0C' }}>
                ₦180,000
              </div>
              <div style={{ fontSize: '0.8rem', color: '#71717A', marginBottom: '14px' }}>
                Sold by Mike's Sneakers • Ikeja, Lagos
              </div>
              <Link
                to="/product/prod-ms-af1"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '9999px', padding: '8px 24px' }}
              >
                <span>View Product Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column Callouts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Callout 3 */}
            <div style={{
              backgroundColor: '#F8F9FA',
              border: '1px solid #E4E4E7',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <Sparkles size={24} color="#0A0A0C" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                COMFORT AIR CUSHION
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#71717A', lineHeight: 1.4 }}>
                Encapsulated Nike Air unit delivers lightweight, springy daily cushioning.
              </p>
            </div>

            {/* Callout 4 */}
            <div style={{
              backgroundColor: '#F8F9FA',
              border: '1px solid #E4E4E7',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <Zap size={24} color="#059669" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                SAME-DAY DISPATCH
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#71717A', lineHeight: 1.4 }}>
                Express courier delivery across Lagos on orders confirmed before 1 PM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
