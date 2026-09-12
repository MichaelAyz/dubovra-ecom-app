import React, { useState } from 'react';
import { CreditCard, Landmark, Wallet, CheckCircle2, Loader2, ShieldCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { paymentService } from '../../services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: (method: 'card' | 'bank_transfer' | 'wallet') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank_transfer' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('5399 4120 8920 4012');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('841');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);

    try {
      await paymentService.processPayment({
        method: selectedMethod,
        amount,
      });

      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Ignored
      }

      // Short delay then trigger callback
      setTimeout(() => {
        onPaymentSuccess(selectedMethod);
      }, 1400);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '460px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
      }}>
        {!isProcessing && !isSuccess && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: '#F4F4F6',
              color: '#71717A',
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Success View */}
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle2 size={44} color="#059669" />
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              Payment Successful!
            </h3>
            <p style={{ color: '#52525B', fontSize: '0.9rem', marginBottom: '8px' }}>
              Simulated payment of <strong>₦{amount.toLocaleString()}</strong> approved.
            </p>
            <span style={{ fontSize: '0.8rem', color: '#71717A' }}>
              Redirecting to order confirmation & tracking...
            </span>
          </div>
        ) : isProcessing ? (
          /* Processing View */
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <Loader2
              size={48}
              color="#0A0A0C"
              style={{
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite',
              }}
            />
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              Processing Payment...
            </h3>
            <p style={{ color: '#52525B', fontSize: '0.88rem' }}>
              Securely contacting payment simulator. Please do not close window.
            </p>
          </div>
        ) : (
          /* Payment Form */
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span className="section-pretitle">Simulated Payment Gateway</span>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}>
                Complete Your Order
              </h3>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A0A0C', marginTop: '6px' }}>
                ₦{amount.toLocaleString()}
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: selectedMethod === 'card' ? '2px solid #0A0A0C' : '1px solid #E4E4E7',
                  backgroundColor: selectedMethod === 'card' ? '#F4F4F6' : '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                <CreditCard size={18} />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('bank_transfer')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: selectedMethod === 'bank_transfer' ? '2px solid #0A0A0C' : '1px solid #E4E4E7',
                  backgroundColor: selectedMethod === 'bank_transfer' ? '#F4F4F6' : '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                <Landmark size={18} />
                <span>Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('wallet')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: selectedMethod === 'wallet' ? '2px solid #0A0A0C' : '1px solid #E4E4E7',
                  backgroundColor: selectedMethod === 'wallet' ? '#F4F4F6' : '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                <Wallet size={18} />
                <span>Wallet</span>
              </button>
            </div>

            {/* Method Specific Fields */}
            {selectedMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                    Card Number (Demo Preset)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#F8F9FA',
                      border: '1px solid #E4E4E7',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                      Expiry
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#F8F9FA',
                        border: '1px solid #E4E4E7',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#F8F9FA',
                        border: '1px solid #E4E4E7',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'bank_transfer' && (
              <div style={{
                backgroundColor: '#F8F9FA',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #E4E4E7',
                marginBottom: '24px',
                fontSize: '0.85rem',
              }}>
                <div style={{ fontWeight: 700, color: '#0A0A0C', marginBottom: '6px' }}>
                  Simulated Virtual Account Details:
                </div>
                <div style={{ color: '#52525B', lineHeight: 1.6 }}>
                  <div>Bank: <strong>Wema Bank / Dubovra Checkout</strong></div>
                  <div>Account No: <strong>0123984521</strong></div>
                  <div>Account Name: <strong>Dubovra Escrow Services</strong></div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#71717A', marginTop: '10px' }}>
                  In this prototype, clicking "Complete Payment" will instantly verify this transfer.
                </p>
              </div>
            )}

            {selectedMethod === 'wallet' && (
              <div style={{
                backgroundColor: '#ECFDF5',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #A7F3D0',
                marginBottom: '24px',
                fontSize: '0.85rem',
              }}>
                <div style={{ fontWeight: 700, color: '#065F46', marginBottom: '4px' }}>
                  Dubovra Wallet Balance:
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                  ₦450,000.00
                </div>
                <p style={{ fontSize: '0.75rem', color: '#047857', marginTop: '6px' }}>
                  Sufficient demo balance available. Instant debit with zero gateway fees.
                </p>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '0.95rem',
              }}
            >
              Pay ₦{amount.toLocaleString()}
            </button>

            {/* Escrow Disclaimer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              color: '#71717A',
              marginTop: '16px',
            }}>
              <ShieldCheck size={14} color="#059669" />
              <span>Simulated Prototype Mode — No real funds are charged</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
