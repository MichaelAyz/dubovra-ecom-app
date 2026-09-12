export interface PaymentPayload {
  method: 'card' | 'bank_transfer' | 'wallet';
  amount: number;
  cardDetails?: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    cardHolder: string;
  };
}

export const paymentService = {
  async processPayment(payload: PaymentPayload): Promise<{ success: boolean; transactionReference: string; message: string }> {
    // Realistic simulation with 1200ms processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const ref = `REF-DBV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return {
      success: true,
      transactionReference: ref,
      message: 'Simulated payment approved successfully.',
    };
  },
};
