import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Package, Check, Image as ImageIcon } from 'lucide-react';
import { SellerLayout } from '../../components/seller/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Storage, marketplaceEvents } from '../../data/storage';
import { productService } from '../../services/productService';
import { Product } from '../../types';

export const SellerProductsPage: React.FC = () => {
  const { activeSeller } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Sneakers');
  const [price, setPrice] = useState<number>(150000);
  const [stock, setStock] = useState<number>(10);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=85');
  const [sku, setSku] = useState('MS-NEW-01');
  const [sizes, setSizes] = useState('40, 41, 42, 43, 44');

  const loadProducts = () => {
    if (!activeSeller) return;
    setProducts(Storage.getProducts(activeSeller.id));
  };

  useEffect(() => {
    loadProducts();
    const handleUpdate = () => loadProducts();
    marketplaceEvents.addEventListener('products_updated', handleUpdate);
    return () => {
      marketplaceEvents.removeEventListener('products_updated', handleUpdate);
    };
  }, [activeSeller]);

  if (!activeSeller) return null;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategory(activeSeller.categories[0] || 'Sneakers');
    setPrice(150000);
    setStock(10);
    setImageUrl('https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=85');
    setSku(`PRD-${Math.floor(1000 + Math.random() * 9000)}`);
    setSizes('40, 41, 42, 43, 44');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description);
    setCategory(prod.category);
    setPrice(prod.price);
    setStock(prod.stock);
    setImageUrl(prod.images[0] || '');
    setSku(prod.sku);
    setSizes(prod.variants.sizes ? prod.variants.sizes.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (window.confirm(`Are you sure you want to remove "${prodName}" from your store?`)) {
      await productService.deleteProduct(id);
      showToast(`Removed "${prodName}" from inventory`, 'info');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizeList = sizes.split(',').map(s => s.trim()).filter(Boolean);

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${activeSeller.slug}-${Date.now().toString().slice(-4)}`,
      sellerId: activeSeller.id,
      sellerName: activeSeller.businessName,
      sellerSlug: activeSeller.slug,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      price: Number(price),
      images: [imageUrl],
      category,
      stock: Number(stock),
      variants: {
        sizes: sizeList.length > 0 ? sizeList : undefined,
      },
      sku,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
    };

    await productService.saveProduct(productPayload);
    showToast(editingProduct ? 'Product updated successfully' : 'New product added to store');
    setIsModalOpen(false);
  };

  return (
    <SellerLayout>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E4E4E7',
        padding: '24px',
      }}>
        {/* Header */}
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
              Product Inventory ({products.length})
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#71717A' }}>
              Manage products, pricing, stock levels and size variants for {activeSeller.businessName}.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '10px', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E4E4E7', textAlign: 'left', color: '#71717A' }}>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>Product</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>Category</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>SKU</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>Price</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>Stock</th>
                <th style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid #F1F1F4' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={prod.images[0]}
                        alt=""
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'contain', backgroundColor: '#F4F4F6' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0A0A0C' }}>{prod.name}</div>
                        {prod.badge && (
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#059669' }}>
                            {prod.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#52525B' }}>{prod.category}</td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#71717A' }}>
                    {prod.sku}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 800 }}>
                    ₦{prod.price.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontWeight: 700,
                      color: prod.stock <= 5 ? '#DC2626' : '#059669',
                      backgroundColor: prod.stock <= 5 ? '#FEE2E2' : '#ECFDF5',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                    }}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#F4F4F6', color: '#0A0A0C' }}
                        title="Edit Product"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#DC2626' }}
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
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
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative',
            boxShadow: 'var(--shadow-modal)',
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', padding: '6px', borderRadius: '50%', backgroundColor: '#F4F4F6' }}
            >
              <X size={18} />
            </button>

            <h3 className="headline-card" style={{ marginBottom: '4px' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#52525B', marginBottom: '20px' }}>
              Product will appear immediately on your public storefront and marketplace search.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nike Air Force 1 '07"
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#F8F9FA', border: '1px solid #E4E4E7', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: '#F8F9FA', border: '1px solid #E4E4E7', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                    Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: '#F8F9FA', border: '1px solid #E4E4E7', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Sneakers"
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: '#F8F9FA', border: '1px solid #E4E4E7', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', backgroundColor: '#F8F9FA', border: '1px solid #E4E4E7', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                  Image URL
                </label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#F8F9FA', border: '1px solid #E4E4E7', borderRadius: '8px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                  Available Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="e.g. 40, 41, 42, 43, 44"
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#F8F9FA', border: '1px solid #E4E4E7', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717A', display: 'block', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product details, materials and specifications..."
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#F8F9FA', border: '1px solid #E4E4E7', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ padding: '10px 24px' }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SellerLayout>
  );
};
