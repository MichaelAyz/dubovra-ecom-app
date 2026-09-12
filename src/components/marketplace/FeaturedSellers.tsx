import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, MapPin, ArrowRight, Share2, CheckCircle2 } from 'lucide-react';
import { Seller } from '../../types';

interface FeaturedSellersProps {
  sellers: Seller[];
  onShareStore: (seller: Seller) => void;
}

export const FeaturedSellers: React.FC<FeaturedSellersProps> = ({ sellers, onShareStore }) => {
  return (
    <section id="featured-sellers" style={{ padding: '64px 0', backgroundColor: '#F8F9FA' }}>
      <div className="container">
        {/* Section Title */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '36px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <span className="section-pretitle">Verified Independent Businesses</span>
            <h2 className="headline-section">
              CURATED MERCHANT STORES
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#71717A', maxWidth: '380px' }}>
            Each seller runs an independent digital storefront with direct dispatch, custom delivery rates, and verified authenticity.
          </p>
        </div>

        {/* Sellers Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {sellers.map((seller) => (
            <div
              key={seller.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                overflow: 'hidden',
                border: '1px solid #E4E4E7',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-card)',
              }}
              className="store-card-hover"
            >
              {/* Store Cover Image */}
              <div style={{ position: 'relative', height: '140px' }}>
                <img
                  src={seller.coverImage}
                  alt={seller.businessName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                }} />

                {/* Share Button on Cover */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onShareStore(seller);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  title="Share Store Link"
                >
                  <Share2 size={13} />
                  <span>Share</span>
                </button>

                {/* Seller Avatar */}
                <div style={{
                  position: 'absolute',
                  bottom: '-22px',
                  left: '20px',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '3px solid #FFFFFF',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'var(--shadow-card)',
                }}>
                  <img
                    src={seller.logo}
                    alt={seller.businessName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Store Body */}
              <div style={{ padding: '32px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {seller.businessName}
                    </h3>
                    <CheckCircle2 size={16} color="#059669" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', fontWeight: 700 }}>
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    <span>{seller.rating}</span>
                    <span style={{ color: '#A1A1AA', fontWeight: 400 }}>({seller.reviewCount})</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#71717A', marginBottom: '10px' }}>
                  <MapPin size={13} />
                  <span>{seller.location}</span>
                </div>

                <p style={{
                  fontSize: '0.82rem',
                  color: '#52525B',
                  lineHeight: 1.45,
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {seller.tagline}
                </p>

                {/* Categories Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {seller.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        backgroundColor: '#F4F4F6',
                        borderRadius: '6px',
                        color: '#52525B',
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Visit Store Button */}
                <Link
                  to={`/store/${seller.slug}`}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    marginTop: 'auto',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    padding: '10px',
                  }}
                >
                  <span>Visit Storefront</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
