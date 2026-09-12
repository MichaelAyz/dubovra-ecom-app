import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Seller, User } from '../types';
import { Storage, marketplaceEvents } from '../data/storage';

interface AuthContextType {
  role: UserRole;
  user: User;
  activeSeller: Seller | null;
  setRole: (role: UserRole) => void;
  setActiveSeller: (seller: Seller) => void;
  availableSellers: Seller[];
}

const DEMO_CUSTOMER: User = {
  id: 'cust-demo-john',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '08000000000',
  role: 'customer',
  createdAt: '2026-01-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [user, setUser] = useState<User>(DEMO_CUSTOMER);
  const [availableSellers, setAvailableSellers] = useState<Seller[]>([]);
  const [activeSeller, setActiveSellerState] = useState<Seller | null>(null);

  const reloadSellers = () => {
    const sellers = Storage.getSellers();
    setAvailableSellers(sellers);
    if (!activeSeller && sellers.length > 0) {
      // Default to Mike's Sneakers for the primary demo flow
      const mikes = sellers.find(s => s.slug === 'mikes-sneakers') || sellers[0];
      setActiveSellerState(mikes);
    }
  };

  useEffect(() => {
    reloadSellers();
    const handleSellersUpdate = () => reloadSellers();
    marketplaceEvents.addEventListener('sellers_updated', handleSellersUpdate);
    return () => {
      marketplaceEvents.removeEventListener('sellers_updated', handleSellersUpdate);
    };
  }, []);

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'seller' && activeSeller) {
      setUser({
        id: activeSeller.ownerId,
        name: activeSeller.businessName,
        email: `admin@${activeSeller.slug}.ng`,
        phone: '08000000000',
        role: 'seller',
        sellerId: activeSeller.id,
        createdAt: activeSeller.createdAt,
      });
    } else {
      setUser(DEMO_CUSTOMER);
    }
  };

  const handleSetActiveSeller = (seller: Seller) => {
    setActiveSellerState(seller);
    if (role === 'seller') {
      setUser({
        id: seller.ownerId,
        name: seller.businessName,
        email: `admin@${seller.slug}.ng`,
        phone: '08000000000',
        role: 'seller',
        sellerId: seller.id,
        createdAt: seller.createdAt,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        activeSeller,
        setRole: handleSetRole,
        setActiveSeller: handleSetActiveSeller,
        availableSellers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
