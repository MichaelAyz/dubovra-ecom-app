import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, ArrowRight, ArrowLeft, Check, Copy, ExternalLink, Sparkles, Truck, Image, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sellerService } from '../../services/sellerService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const SellerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole, setActiveSeller } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [createdSlug, setCreatedSlug] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Form Fields - Step 1: Business Details
  const [businessName, setBusinessName] = useState('Kemi Luxury Apparel');
  const [slug, setSlug] = useState('kemi-luxury-apparel');
  const [category, setCategory] = useState('Fashion');
  const [description, setDescription] = useState('Curated contemporary African couture and ready-to-wear luxury fashion based in Lekki.');
  const [location, setLocation] = useState('Lekki Phase 1, Lagos');

  // Step 2: Branding
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85');

  // Step 3: Delivery
  const [lagosFee, setLagosFee] = useState(2500);
  const [expressFee, setExpressFee] = useState(5000);
  const [nationwideFee, setNationwideFee] = useState(7000);

  const handleBusinessNameChange = (val: string) => {
    setBusinessName(val);
    const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setSlug(generated);
  };

  const handleFinishOnboarding = async () => {
    try {
      const newSeller = await sellerService.createSeller({
        ownerId: `user-seller-${Date.now()}`,
        businessName,
        slug,
        tagline: description.slice(0, 50) + '...',
        description,
        logo,
        coverImage,
        location,
        categories: [category, 'New Arrivals', 'Featured'],
        deliveryOptions: [
          { id: 'del-1', zone: 'Lagos', name: 'Standard Delivery', fee: Number(lagosFee), duration: '2–3 days' },
          { id: 'del-2', zone: 'Lagos', name: 'Express Delivery', fee: Number(expressFee), duration: 'Same day' },
          { id: 'del-3', zone: 'Nationwide', name: 'Nationwide Courier', fee: Number(nationwideFee), duration: '3–5 days' },
        ],
        policies: {
          returns: '7-day returns on unworn items with tags intact.',
          dispatch: 'Same day dispatch on orders placed before 1 PM.',
        },
      });

      setCreatedSlug(newSeller.slug);
      setActiveSeller(newSeller);
      setRole('seller');
      setStep(4); // Celebration page

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {
        // Ignored
      }
    } catch (err) {
      console.error(err);
    }
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dubovra.com';
  const fullStoreUrl = `${origin}/store/${createdSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullStoreUrl);
    setCopied(true);
    showToast('Store link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container-narrow">
        {step < 4 ? (
          <div>
            {/* Header & Stepper */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span className="section-pretitle" style={{ color: '#059669' }}>
                Merchant Onboarding
              </span>
              <h1 className="headline-section" style={{ fontSize: '2rem', marginBottom: '16px' }}>
                CREATE YOUR DIGITAL STOREFRONT
              </h1>

              {/* Progress Steps */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {[
                  { num: 1, label: 'Store Info' },
                  { num: 2, label: 'Branding' },
                  { num: 3, label: 'Delivery' },
                ].map((s, idx) => (
                  <React.Fragment key={s.num}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: step === s.num ? '#0A0A0C' : step > s.num ? '#059669' : '#E4E4E7',
                        color: step >= s.num ? '#FFFFFF' : '#71717A',
                      }}>
                        {step > s.num ? <Check size={14} /> : s.num}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: step === s.num ? 700 : 500 }}>
                        {s.label}
                      </span>
                    </div>
                    {idx < 2 && <div style={{ width: '30px', height: '2px', backgroundColor: step > idx + 1 ? '#059669' : '#E4E4E7' }} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E4E4E7',
              padding: '36px',
              boxShadow: 'var(--shadow-card)',
            }}>
              {/* PAGE 1: Business Details */}
              {step === 1 && (
                <div>
                  <h3 className="headline-card" style={{ marginBottom: '6px' }}>
                    Step 1 — Business Details
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#52525B', marginBottom: '24px' }}>
                    Tell us about your brand. Every merchant gets an instant, unique shareable URL.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                        Business Name
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => handleBusinessNameChange(e.target.value)}
                        placeholder="e.g. Mike's Sneakers"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: '#F8F9FA',
                          border: '1px solid #E4E4E7',
                          borderRadius: '10px',
                          fontSize: '0.92rem',
                          fontWeight: 600,
                        }}
                      />
                    </div>

                    {/* Slug preview */}
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                        Your Storefront URL
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#F8F9FA',
                        border: '1px solid #E4E4E7',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '0.88rem',
                        fontFamily: 'monospace',
                        color: '#0A0A0C',
                        fontWeight: 600,
                      }}>
                        <span style={{ color: '#71717A' }}>dubovra.com/store/</span>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                          style={{
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            fontWeight: 700,
                            color: '#059669',
                            flex: 1,
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                          Primary Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: '#F8F9FA',
                            border: '1px solid #E4E4E7',
                            borderRadius: '10px',
                            fontSize: '0.92rem',
                            fontWeight: 600,
                          }}
                        >
                          <option value="Fashion">Fashion & Apparel</option>
                          <option value="Sneakers">Sneakers & Footwear</option>
                          <option value="Electronics">Electronics & Gadgets</option>
                          <option value="Beauty">Beauty & Cosmetics</option>
                          <option value="Home & Living">Home & Living</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                          Location
                        </label>
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Ikeja, Lagos"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: '#F8F9FA',
                            border: '1px solid #E4E4E7',
                            borderRadius: '10px',
                            fontSize: '0.92rem',
                            fontWeight: 600,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                        Store Description / Bio
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: '#F8F9FA',
                          border: '1px solid #E4E4E7',
                          borderRadius: '10px',
                          fontSize: '0.92rem',
                          resize: 'vertical',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-primary"
                      style={{ padding: '12px 28px', gap: '8px' }}
                    >
                      <span>Continue to Branding</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 2: Branding */}
              {step === 2 && (
                <div>
                  <h3 className="headline-card" style={{ marginBottom: '6px' }}>
                    Step 2 — Store Appearance
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#52525B', marginBottom: '24px' }}>
                    Select high-resolution brand assets for your banner and merchant avatar.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '8px' }}>
                        Store Logo / Avatar
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img
                          src={logo}
                          alt="Logo preview"
                          style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', border: '1px solid #E4E4E7' }}
                        />
                        <input
                          type="text"
                          value={logo}
                          onChange={(e) => setLogo(e.target.value)}
                          placeholder="Image URL..."
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            backgroundColor: '#F8F9FA',
                            border: '1px solid #E4E4E7',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '8px' }}>
                        Cover Banner Photo
                      </label>
                      <div style={{
                        height: '140px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        marginBottom: '8px',
                        border: '1px solid #E4E4E7',
                      }}>
                        <img src={coverImage} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="Banner image URL..."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: '#F8F9FA',
                          border: '1px solid #E4E4E7',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-secondary"
                      style={{ gap: '6px' }}
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn btn-primary"
                      style={{ padding: '12px 28px', gap: '8px' }}
                    >
                      <span>Continue to Delivery</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 3: Delivery Options */}
              {step === 3 && (
                <div>
                  <h3 className="headline-card" style={{ marginBottom: '6px' }}>
                    Step 3 — Delivery Configuration
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#52525B', marginBottom: '24px' }}>
                    Set your delivery rates for local dispatch and nationwide transit.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                        Lagos Standard Delivery (₦)
                      </label>
                      <input
                        type="number"
                        value={lagosFee}
                        onChange={(e) => setLagosFee(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: '#F8F9FA',
                          border: '1px solid #E4E4E7',
                          borderRadius: '10px',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                        Lagos Express Same-Day Delivery (₦)
                      </label>
                      <input
                        type="number"
                        value={expressFee}
                        onChange={(e) => setExpressFee(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: '#F8F9FA',
                          border: '1px solid #E4E4E7',
                          borderRadius: '10px',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                        Interstate & Nationwide Courier (₦)
                      </label>
                      <input
                        type="number"
                        value={nationwideFee}
                        onChange={(e) => setNationwideFee(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          backgroundColor: '#F8F9FA',
                          border: '1px solid #E4E4E7',
                          borderRadius: '10px',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-secondary"
                      style={{ gap: '6px' }}
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFinishOnboarding}
                      className="btn btn-primary"
                      style={{ padding: '12px 32px', gap: '8px' }}
                    >
                      <span>Create Store</span>
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* STEP 4: Success Celebration Page (Section 15 Specification) */
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E4E4E7',
            padding: '48px 36px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle2 size={48} color="#059669" />
            </div>

            <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>
              Storefront Live
            </span>

            <h1 className="headline-hero" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '8px' }}>
              🎉 YOUR STORE IS READY!
            </h1>

            <p style={{ fontSize: '0.95rem', color: '#52525B', maxWidth: '440px', margin: '0 auto 28px' }}>
              Congratulations! Your digital storefront is published. Share your unique link directly with customers on WhatsApp, Instagram, or SMS.
            </p>

            {/* Link Box */}
            <div style={{
              backgroundColor: '#F8F9FA',
              border: '1px solid #E4E4E7',
              borderRadius: '14px',
              padding: '16px 20px',
              maxWidth: '520px',
              margin: '0 auto 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#0A0A0C',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {fullStoreUrl}
              </div>

              <button
                onClick={handleCopyLink}
                className="btn btn-primary btn-sm"
                style={{ padding: '8px 16px', gap: '6px' }}
              >
                {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to="/seller/dashboard"
                className="btn btn-primary btn-lg"
                style={{ borderRadius: '12px', padding: '14px 28px' }}
              >
                Go to Dashboard
              </Link>

              <Link
                to={`/store/${createdSlug}`}
                className="btn btn-secondary btn-lg"
                style={{ borderRadius: '12px', padding: '14px 24px', gap: '6px' }}
              >
                <span>View Public Store</span>
                <ExternalLink size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
