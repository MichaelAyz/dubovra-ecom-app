import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Truck,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Store,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Storage } from '../../data/storage';
import { orderService } from '../../services/orderService';
import { PaymentModal } from '../../components/checkout/PaymentModal';
import { DeliveryOption } from '../../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, sellerId, sellerName, sellerSlug, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Active step (1: Info, 2: Address, 3: Delivery Method, 4: Summary & Payment)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states with realistic Nigerian defaults for Demo Scenario 1
  const [fullName, setFullName] = useState('John Doe');
  const [phone, setPhone] = useState('08000000000');
  const [email, setEmail] = useState('john.doe@example.com');

  const [address, setAddress] = useState('12 Example Street');
  const [city, setCity] = useState('Victoria Island');
  const [state, setState] = useState('Lagos');
  const [instructions, setInstructions] = useState('Call before arrival');

  // Delivery options from active seller
  const activeSeller = sellerId ? Storage.getSellerById(sellerId) : null;
  const deliveryOptions: DeliveryOption[] = activeSeller?.deliveryOptions || [
    { id: 'std-del', zone: 'Lagos', name: 'Standard Delivery', fee: 2500, duration: '2–3 business days' },
    { id: 'exp-del', zone: 'Lagos', name: 'Express Delivery', fee: 5000, duration: 'Same day (Order before 1 PM)' },
  ];

  // Default to Express Delivery (₦5,000) for demo scenario!
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryOption>(
    deliveryOptions.find(d => d.name.toLowerCase().includes('express')) || deliveryOptions[0]
  );

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 1.5rem', textAlign: 'center' }}>
        <h2 className="headline-card" style={{ marginBottom: '12px' }}>Your Cart is Empty</h2>
        <p style={{ color: '#52525B', marginBottom: '24px' }}>Please add products to your cart before proceeding to checkout.</p>
        <Link to="/" className="btn btn-primary btn-sm">Return to Marketplace</Link>
      </div>
    );
  }

  const deliveryFee = selectedDeliveryMethod.fee;
  const total = subtotal + deliveryFee;

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentSuccess = async (method: 'card' | 'bank_transfer' | 'wallet') => {
    try {
      const newOrder = await orderService.createOrder({
        customerId: user.id,
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        sellerId: sellerId!,
        sellerName: sellerName!,
        sellerSlug: sellerSlug!,
        items,
        subtotal,
        deliveryFee,
        shippingAddress: {
          fullName,
          phone,
          email,
          address,
          city,
          state,
          instructions,
        },
        deliveryMethod: selectedDeliveryMethod,
        paymentMethod: method,
      });

      clearCart();
      setIsPaymentModalOpen(false);
      showToast(`Order #${newOrder.id} confirmed!`);
      navigate(`/order/${newOrder.id}`);
    } catch (err) {
      console.error('Failed to create order', err);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container-narrow">
        {/* Header with Step Indicator */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <span className="section-pretitle">Frictionless Checkout</span>
          <h1 className="headline-section" style={{ fontSize: '2rem', marginBottom: '20px' }}>
            CHECKOUT
          </h1>

          {/* Stepper Progress Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '540px',
            margin: '0 auto',
            gap: '8px',
          }}>
            {[
              { num: 1, label: 'Contact' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Delivery' },
              { num: 4, label: 'Summary' },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div
                  onClick={() => step.num < currentStep && setCurrentStep(step.num)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: step.num < currentStep ? 'pointer' : 'default',
                  }}
                >
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    backgroundColor: currentStep === step.num
                      ? '#0A0A0C'
                      : currentStep > step.num
                      ? '#059669'
                      : '#E4E4E7',
                    color: currentStep >= step.num ? '#FFFFFF' : '#71717A',
                  }}>
                    {currentStep > step.num ? <Check size={14} /> : step.num}
                  </span>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: currentStep === step.num ? 700 : 500,
                    color: currentStep === step.num ? '#0A0A0C' : '#71717A',
                  }}>
                    {step.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div style={{
                    width: '32px',
                    height: '2px',
                    backgroundColor: currentStep > idx + 1 ? '#059669' : '#E4E4E7',
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Checkout Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E4E4E7',
          padding: '36px',
          boxShadow: 'var(--shadow-card)',
        }}>
          {/* Fulfilling Merchant Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#F8F9FA',
            borderRadius: '12px',
            border: '1px solid #E4E4E7',
            marginBottom: '28px',
            fontSize: '0.85rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Store size={16} color="#059669" />
              <span>Ordering directly from: <strong>{sellerName}</strong></span>
            </div>
            <span className="badge badge-dark" style={{ fontSize: '0.65rem' }}>
              Direct Fulfillment
            </span>
          </div>

          <form onSubmit={handleStepSubmit}>
            {/* STEP 1: Customer Contact Information */}
            {currentStep === 1 && (
              <div>
                <h3 className="headline-card" style={{ marginBottom: '6px' }}>
                  Step 1 — Customer Information
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#52525B', marginBottom: '24px' }}>
                  Provide your contact details for order confirmation and delivery notifications.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08000000000"
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

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', gap: '8px' }}>
                    <span>Continue to Address</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Address */}
            {currentStep === 2 && (
              <div>
                <h3 className="headline-card" style={{ marginBottom: '6px' }}>
                  Step 2 — Delivery Address
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#52525B', marginBottom: '24px' }}>
                  Enter the street destination where the merchant dispatch rider will drop your package.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 12 Example Street"
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                        City / Area
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Victoria Island / Ikeja"
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

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                        State
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
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
                        <option value="Lagos">Lagos State</option>
                        <option value="FCT Abuja">Abuja (FCT)</option>
                        <option value="Rivers">Rivers State (Port Harcourt)</option>
                        <option value="Oyo">Oyo State (Ibadan)</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '6px' }}>
                      Additional Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Leave at security gate or call on arrival"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#F8F9FA',
                        border: '1px solid #E4E4E7',
                        borderRadius: '10px',
                        fontSize: '0.92rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn btn-secondary"
                    style={{ gap: '6px' }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', gap: '8px' }}>
                    <span>Continue to Delivery</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Delivery Method */}
            {currentStep === 3 && (
              <div>
                <h3 className="headline-card" style={{ marginBottom: '6px' }}>
                  Step 3 — Delivery Method
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#52525B', marginBottom: '24px' }}>
                  Select your preferred shipping speed directly provided by <strong>{sellerName}</strong>.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                  {deliveryOptions.map((method) => {
                    const isSelected = selectedDeliveryMethod.id === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedDeliveryMethod(method)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '18px 20px',
                          borderRadius: '14px',
                          border: isSelected ? '2px solid #0A0A0C' : '1px solid #E4E4E7',
                          backgroundColor: isSelected ? '#F8F9FA' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            border: isSelected ? '6px solid #0A0A0C' : '2px solid #D4D4D8',
                            backgroundColor: '#FFFFFF',
                          }} />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0A0A0C' }}>
                              {method.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#71717A', marginTop: '2px' }}>
                              {method.duration} • {method.zone}
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A0A0C' }}>
                          ₦{method.fee.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn btn-secondary"
                    style={{ gap: '6px' }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', gap: '8px' }}>
                    <span>Review Order</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Order Summary & Review */}
            {currentStep === 4 && (
              <div>
                <h3 className="headline-card" style={{ marginBottom: '6px' }}>
                  Step 4 — Review & Payment
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#52525B', marginBottom: '24px' }}>
                  Confirm your delivery address and order details before continuing to the payment simulator.
                </p>

                {/* Breakdown Tiles */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}>
                  <div style={{ backgroundColor: '#F8F9FA', padding: '16px', borderRadius: '12px', border: '1px solid #E4E4E7' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', marginBottom: '6px' }}>
                      Customer
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#52525B' }}>{phone}</div>
                    <div style={{ fontSize: '0.8rem', color: '#52525B' }}>{email}</div>
                  </div>

                  <div style={{ backgroundColor: '#F8F9FA', padding: '16px', borderRadius: '12px', border: '1px solid #E4E4E7' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', marginBottom: '6px' }}>
                      Destination & Method
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{address}, {city}</div>
                    <div style={{ fontSize: '0.8rem', color: '#52525B' }}>{state} State</div>
                    <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                      {selectedDeliveryMethod.name} (₦{deliveryFee.toLocaleString()})
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div style={{
                  border: '1px solid #E4E4E7',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', marginBottom: '12px' }}>
                    Order Items
                  </div>
                  {items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: i === items.length - 1 ? 0 : '10px',
                        marginBottom: i === items.length - 1 ? 0 : '10px',
                        borderBottom: i === items.length - 1 ? 'none' : '1px solid #F1F1F4',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.product.images[0]}
                          alt=""
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'contain', backgroundColor: '#F4F4F6' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{item.product.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#71717A' }}>
                            Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Calculation */}
                <div style={{
                  backgroundColor: '#F8F9FA',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '28px',
                  fontSize: '0.88rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#52525B' }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 700, color: '#0A0A0C' }}>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#52525B' }}>
                    <span>{selectedDeliveryMethod.name}</span>
                    <span style={{ fontWeight: 700, color: '#0A0A0C' }}>₦{deliveryFee.toLocaleString()}</span>
                  </div>
                  <div style={{
                    borderTop: '1px solid #E4E4E7',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#0A0A0C',
                  }}>
                    <span>Grand Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="btn btn-secondary"
                    style={{ gap: '6px' }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ padding: '12px 36px', gap: '8px', fontSize: '0.95rem' }}
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Simulated Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={total}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
