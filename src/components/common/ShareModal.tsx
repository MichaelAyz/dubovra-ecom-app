import React, { useState } from 'react';
import { Copy, Check, X, Share2, MessageCircle, ExternalLink, QrCode } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  storeSlug: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  storeName,
  storeSlug,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dubovra.com';
  const fullUrl = `${origin}/store/${storeSlug}`;
  const relativeUrl = `/store/${storeSlug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      showToast('Store link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      showToast('Link copied!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Shop directly from ${storeName} on Dubovra! Check out our collection here: ${fullUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storeName,
          text: `Shop directly from ${storeName} on Dubovra`,
          url: fullUrl,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '480px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: '#F4F4F5',
            color: '#71717A',
            display: 'flex',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '24px' }}>
          <span className="section-pretitle">Shareable Storefront</span>
          <h3 className="headline-card" style={{ fontSize: '1.4rem' }}>
            Share {storeName}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#52525B', marginTop: '4px' }}>
            Customers opening this unique link land directly in your store without marketplace distraction.
          </p>
        </div>

        {/* Link Box */}
        <div style={{
          backgroundColor: '#F8F9FA',
          border: '1px solid #E4E4E7',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <div style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
            color: '#0A0A0C',
            fontWeight: 600,
          }}>
            {fullUrl}
          </div>
          <button
            onClick={handleCopy}
            className="btn btn-primary btn-sm"
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              gap: '6px',
            }}
          >
            {copied ? (
              <>
                <Check size={14} color="#10B981" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          <button
            onClick={handleWhatsAppShare}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 10px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              fontWeight: 600,
              fontSize: '0.8rem',
              transition: 'all 0.15s ease',
            }}
          >
            <MessageCircle size={20} color="#059669" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleNativeShare}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 10px',
              borderRadius: '12px',
              backgroundColor: '#F4F4F5',
              border: '1px solid #E4E4E7',
              color: '#18181B',
              fontWeight: 600,
              fontSize: '0.8rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Share2 size={20} color="#18181B" />
            <span>Share Sheet</span>
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 10px',
              borderRadius: '12px',
              backgroundColor: showQr ? '#0A0A0C' : '#F4F4F5',
              border: '1px solid #E4E4E7',
              color: showQr ? '#FFFFFF' : '#18181B',
              fontWeight: 600,
              fontSize: '0.8rem',
              transition: 'all 0.15s ease',
            }}
          >
            <QrCode size={20} />
            <span>{showQr ? 'Hide QR' : 'QR Code'}</span>
          </button>
        </div>

        {/* QR Code Preview */}
        {showQr && (
          <div style={{
            padding: '16px',
            backgroundColor: '#F4F4F5',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '140px',
              height: '140px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-subtle)',
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fullUrl)}`}
                alt="Store QR code"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#71717A', marginTop: '8px' }}>
              Scan to open storefront on mobile
            </span>
          </div>
        )}

        {/* Direct Open Link */}
        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
          <a
            href={relativeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#0A0A0C',
              textDecoration: 'underline',
            }}
          >
            <span>Preview live storefront in new tab</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
