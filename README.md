# Dubovra E-Commerce Marketplace

Dubovra is a modern multi-vendor e-commerce marketplace prototype designed for independent sellers and their customers across Nigeria.

The main idea behind Dubovra is to make buying and selling as simple as possible. Independent businesses can easily create an online store, add products, set up delivery options, and generate a **unique shareable link** (e.g., `app.com/store/mikes-sneakers`). When customers open that link, they land directly on the seller's store and can make a purchase without getting lost in a main marketplace.

At the same time, shoppers can also explore the main marketplace to discover verified independent stores and search for products across multiple sellers.

---

## Key Features

- **Shareable Seller Storefronts**: Every merchant gets a unique URL link to share on WhatsApp, Instagram, or social media.
- **Frictionless Shopping**: Direct storefront purchasing flow from product selection to checkout.
- **Multi-Vendor Marketplace & Search**: Compare products (like sneakers or electronics) from different sellers in one search.
- **Simulated Payment Simulator**: A realistic payment experience for Card, Bank Transfer, and Wallet checkout.
- **Live Order Tracking**: Real-time order progress timeline that updates instantly when a seller changes the order status in their dashboard.
- **Seller Dashboard & Onboarding**: Easy 3-step store creation wizard, product management, order fulfillment console, and delivery settings.

---

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Modern CSS design system with custom variables and responsive layouts
- **Routing**: React Router
- **Icons**: Lucide React
- **State & Sync**: Local storage persistence with real-time cross-tab broadcast synchronization

---

## How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MichaelAyz/dubovra-ecom-app.git
   cd dubovra-ecom-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` (or the port shown in your terminal).
