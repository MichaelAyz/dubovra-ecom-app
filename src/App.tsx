import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

// Pages
import { HomePage } from './pages/marketplace/HomePage';
import { SearchPage } from './pages/marketplace/SearchPage';
import { ProductDetailPage } from './pages/product/ProductDetailPage';
import { StorefrontPage } from './pages/storefront/StorefrontPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { CustomerOrdersPage } from './pages/customer/CustomerOrdersPage';

// Seller Pages
import { SellerRegisterPage } from './pages/seller/SellerRegisterPage';
import { SellerDashboardPage } from './pages/seller/SellerDashboardPage';
import { SellerProductsPage } from './pages/seller/SellerProductsPage';
import { SellerOrdersPage } from './pages/seller/SellerOrdersPage';
import { SellerDeliveryPage } from './pages/seller/SellerDeliveryPage';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <div className="page-wrapper">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public Marketplace */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/product/:productId" element={<ProductDetailPage />} />
                  <Route path="/store/:storeSlug" element={<StorefrontPage />} />

                  {/* Customer Purchase & Orders */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/order/:orderId/tracking" element={<OrderTrackingPage />} />
                  <Route path="/orders" element={<CustomerOrdersPage />} />

                  {/* Seller Portal */}
                  <Route path="/seller/register" element={<SellerRegisterPage />} />
                  <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
                  <Route path="/seller/products" element={<SellerProductsPage />} />
                  <Route path="/seller/orders" element={<SellerOrdersPage />} />
                  <Route path="/seller/delivery" element={<SellerDeliveryPage />} />

                  {/* Catch-all fallback */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
