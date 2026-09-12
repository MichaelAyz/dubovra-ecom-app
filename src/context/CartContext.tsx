import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useToast } from './ToastContext';

interface ConflictState {
  isOpen: boolean;
  incomingProduct: Product | null;
  incomingQuantity: number;
  incomingSize?: string;
  incomingColor?: string;
}

interface CartContextType {
  sellerId: string | null;
  sellerName: string | null;
  sellerSlug: string | null;
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => boolean;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  conflictState: ConflictState;
  resolveConflict: (replace: boolean) => void;
}

const CART_STORAGE_KEY = 'dubovra_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [conflictState, setConflictState] = useState<ConflictState>({
    isOpen: false,
    incomingProduct: null,
    incomingQuantity: 1,
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [items]);

  const sellerId = items.length > 0 ? items[0].sellerId : null;
  const sellerName = items.length > 0 ? items[0].sellerName : null;
  const sellerSlug = items.length > 0 ? items[0].sellerSlug : null;

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ): boolean => {
    // If cart has items from another seller, trigger conflict resolution modal
    if (items.length > 0 && items[0].sellerId !== product.sellerId) {
      setConflictState({
        isOpen: true,
        incomingProduct: product,
        incomingQuantity: quantity,
        incomingSize: selectedSize,
        incomingColor: selectedColor,
      });
      return false;
    }

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.productId === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex >= 0) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          sellerId: product.sellerId,
          sellerName: product.sellerName,
          sellerSlug: product.sellerSlug,
          product,
          quantity,
          selectedSize: selectedSize || (product.variants.sizes ? product.variants.sizes[0] : undefined),
          selectedColor: selectedColor || (product.variants.colors ? product.variants.colors[0] : undefined),
          price: product.price,
        };
        return [...prevItems, newItem];
      }
    });

    showToast(`Added "${product.name}" to cart`);
    return true;
  };

  const resolveConflict = (replace: boolean) => {
    if (replace && conflictState.incomingProduct) {
      const p = conflictState.incomingProduct;
      const q = conflictState.incomingQuantity;
      const newItem: CartItem = {
        productId: p.id,
        sellerId: p.sellerId,
        sellerName: p.sellerName,
        sellerSlug: p.sellerSlug,
        product: p,
        quantity: q,
        selectedSize: conflictState.incomingSize || (p.variants.sizes ? p.variants.sizes[0] : undefined),
        selectedColor: conflictState.incomingColor || (p.variants.colors ? p.variants.colors[0] : undefined),
        price: p.price,
      };
      setItems([newItem]);
      showToast(`Started new cart with ${p.sellerName}`);
    }
    setConflictState({ isOpen: false, incomingProduct: null, incomingQuantity: 1 });
  };

  const removeFromCart = (productId: string, selectedSize?: string) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.selectedSize === selectedSize)));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.productId === productId && item.selectedSize === selectedSize) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        sellerId,
        sellerName,
        sellerSlug,
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        conflictState,
        resolveConflict,
      }}
    >
      {children}
      {/* Seller Conflict Modal */}
      {conflictState.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '440px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              Replace items in cart?
            </h3>
            <p style={{ color: '#52525B', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Your cart currently contains items from <strong>{sellerName}</strong>. Each order is fulfilled directly by an independent merchant. Would you like to clear your cart and start a new order with <strong>{conflictState.incomingProduct?.sellerName}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => resolveConflict(false)}
                className="btn btn-secondary btn-sm"
              >
                Keep Current Cart
              </button>
              <button
                onClick={() => resolveConflict(true)}
                className="btn btn-primary btn-sm"
              >
                Start New Store Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
