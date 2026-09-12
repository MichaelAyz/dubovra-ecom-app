import { Seller } from '../types';
import { Storage } from '../data/storage';

export const sellerService = {
  async getAllSellers(): Promise<Seller[]> {
    return Storage.getSellers();
  },

  async getSellerBySlug(slug: string): Promise<Seller | null> {
    return Storage.getSellerBySlug(slug) || null;
  },

  async getSellerById(id: string): Promise<Seller | null> {
    return Storage.getSellerById(id) || null;
  },

  async createSeller(sellerData: Omit<Seller, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'totalSalesCount' | 'totalRevenue'>): Promise<Seller> {
    const newSeller: Seller = {
      ...sellerData,
      id: `seller-${sellerData.slug}-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewCount: 1,
      totalSalesCount: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString(),
    };
    Storage.saveSeller(newSeller);
    return newSeller;
  },

  async updateSeller(seller: Seller): Promise<Seller> {
    Storage.saveSeller(seller);
    return seller;
  },
};
