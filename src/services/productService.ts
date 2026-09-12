import { Product } from '../types';
import { Storage } from '../data/storage';

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    return Storage.getProducts();
  },

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return Storage.getProducts(sellerId);
  },

  async getProductById(id: string): Promise<Product | null> {
    return Storage.getProductById(id) || null;
  },

  async searchProducts(query: string, options?: {
    category?: string;
    sellerId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'rating';
  }): Promise<Product[]> {
    let products = Storage.getProducts();
    const cleanQuery = query.trim().toLowerCase();

    if (cleanQuery) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(cleanQuery) ||
        p.description.toLowerCase().includes(cleanQuery) ||
        p.sellerName.toLowerCase().includes(cleanQuery) ||
        p.category.toLowerCase().includes(cleanQuery)
      );
    }

    if (options?.category && options.category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === options.category!.toLowerCase());
    }

    if (options?.sellerId) {
      products = products.filter(p => p.sellerId === options.sellerId);
    }

    if (options?.minPrice !== undefined) {
      products = products.filter(p => p.price >= options.minPrice!);
    }

    if (options?.maxPrice !== undefined) {
      products = products.filter(p => p.price <= options.maxPrice!);
    }

    if (options?.sortBy) {
      switch (options.sortBy) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }

    return products;
  },

  async saveProduct(product: Product): Promise<Product> {
    Storage.saveProduct(product);
    return product;
  },

  async deleteProduct(id: string): Promise<void> {
    Storage.deleteProduct(id);
  },
};
