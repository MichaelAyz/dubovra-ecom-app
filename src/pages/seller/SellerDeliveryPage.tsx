import React, { useState } from 'react';
import { Truck, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { SellerLayout } from '../../components/seller/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sellerService } from '../../services/sellerService';
import { DeliveryOption } from '../../types';

export const SellerDeliveryPage: React.FC = () => {
  const { activeSeller, setActiveSeller } = useAuth();
  const { showToast } = useToast();

  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>(
    activeSeller?.deliveryOptions || []
  );

  if (!activeSeller) return null;

  const handleUpdateFee = (id: string, newFee: number) => {
    setDeliveryOptions(prev => prev.map(opt => opt.id === id ? { ...opt, fee: newFee } : opt));
  };

  const handleUpdateDuration = (id: string, newDuration: string) => {
    setDeliveryOptions(prev => prev.map(opt => opt.id === id ? { ...opt, duration: newDuration } : opt));
  };

  const handleSave = async () => {
    const updated = {
      ...activeSeller,
      deliveryOptions,
    };
    await sellerService.updateSeller(updated);
    setActiveSeller(updated);
    showToast('Delivery configurations saved successfully!');
  };

  return (
    <SellerLayout>
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
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Store Delivery Configurations
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#71717A' }}>
              Set custom fees and turnaround transit times for {activeSeller.businessName}.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '10px', gap: '6px' }}
          >
            <Save size={15} />
            <span>Save Settings</span>
          </button>
        </div>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {deliveryOptions.map((opt) => (
            <div
              key={opt.id}
              style={{
                border: '1px solid #E4E4E7',
                borderRadius: '14px',
                padding: '20px',
                backgroundColor: '#F8F9FA',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A' }}>
                  Zone & Method
                </span>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0A0A0C' }}>
                  {opt.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                  {opt.zone}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                  Delivery Fee (₦)
                </label>
                <input
                  type="number"
                  value={opt.fee}
                  onChange={(e) => handleUpdateFee(opt.id, Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4E4E7',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                  Transit Turnaround
                </label>
                <input
                  type="text"
                  value={opt.duration}
                  onChange={(e) => handleUpdateDuration(opt.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4E4E7',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SellerLayout>
  );
};
