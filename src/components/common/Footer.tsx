import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowRight, Mail, Globe, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#0A0A0C', color: '#F4F4F5', marginTop: 'auto' }}>
      {/* Upper Metrics & Newsletter Banner (Matches Reference Image) */}
      <div style={{
        borderBottom: '1px solid #1F1F24',
        padding: '48px 0',
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '36px',
          alignItems: 'center',
        }}>
          {/* Key Metrics */}
          <div style={{ display: 'flex', gap: '36px' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1,
              }}>
                80+
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '6px' }}>
                Verified Stores
              </div>
            </div>

            <div style={{ width: '1px', height: '48px', backgroundColor: '#27272A' }} />

            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1,
              }}>
                120K+
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '6px' }}>
                Orders Delivered
              </div>
            </div>

            <div style={{ width: '1px', height: '48px', backgroundColor: '#27272A' }} />

            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#10B981',
                lineHeight: 1,
              }}>
                100%
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '6px' }}>
                Escrow Protected
              </div>
            </div>
          </div>

          {/* Newsletter Box (Directly inspired by reference footer) */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A1A1AA', display: 'block', marginBottom: '8px' }}>
              Stay Updated with Merchant Drops
            </span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to Dubovra merchant drops!');
              }}
              style={{
                display: 'flex',
                gap: '8px',
                maxWidth: '440px',
              }}
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                required
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#18181B',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="btn btn-white btn-sm"
                style={{ padding: '0 20px', borderRadius: '8px' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '48px 1.5rem 36px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#FFFFFF',
              marginBottom: '12px',
            }}>
              DUBOVRA
            </div>
            <p style={{ fontSize: '0.86rem', color: '#A1A1AA', lineHeight: 1.6, maxWidth: '280px' }}>
              The modern multi-vendor commerce infrastructure empowering independent businesses with dedicated shareable storefronts and seamless buyer checkout.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FFFFFF', marginBottom: '16px' }}>
              Marketplace
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#A1A1AA' }}>
              <li><Link to="/search?q=Sneakers">Footwear & Sneakers</Link></li>
              <li><Link to="/search?category=Audio">Electronics & Gadgets</Link></li>
              <li><Link to="/search?category=Skincare">Beauty & Cosmetics</Link></li>
              <li><a href="/#featured-sellers">Featured Merchants</a></li>
            </ul>
          </div>

          {/* Independent Sellers */}
          <div>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FFFFFF', marginBottom: '16px' }}>
              Sellers
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#A1A1AA' }}>
              <li><Link to="/seller/register">Create Your Store</Link></li>
              <li><Link to="/seller/dashboard">Seller Dashboard</Link></li>
              <li><Link to="/store/mikes-sneakers">Demo: Mike's Sneakers</Link></li>
              <li><Link to="/store/urban-sole">Demo: Urban Sole</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FFFFFF', marginBottom: '16px' }}>
              Customer Support
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#A1A1AA' }}>
              <li><Link to="/orders">Track My Order</Link></li>
              <li><span>Escrow Buyer Protection</span></li>
              <li><span>Standard & Express Transit</span></li>
              <li><span>support@dubovra.com</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1F1F24',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.78rem',
          color: '#71717A',
        }}>
          <div>
            © 2026 DUBOVRA Inc. All rights reserved. Built as a high-fidelity e-commerce prototype.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Merchant Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
