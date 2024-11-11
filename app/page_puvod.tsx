'use client';

import { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import AdminProducts from './components/AdminProducts';

// Počáteční data produktů
const initialProducts = [
    { id: 1, name: "Červené víno", category: "Víno", inStock: true },
    { id: 2, name: "Bílé víno", category: "Víno", inStock: false },
    { id: 3, name: "Cola", category: "Nápoje", inStock: true },
    { id: 4, name: "Jahodové víno", category: "Ovocné víno", inStock: true },
    { id: 5, name: "Dusíková patrona", category: "Dusík", inStock: true },
    { id: 6, name: "PET láhev 1L", category: "PET", inStock: false },
];

export default function Home() {
  const [currentView, setCurrentView] = useState<'catalog' | 'order' | 'admin'>('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [products, setProducts] = useState(initialProducts);

  const getCartItemsCount = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  const handleAddToCart = (productId: number, volume: number) => {
    setCartItems(prev => {
      const key = `${productId}-${volume}`;
      return {
        ...prev,
        [key]: (prev[key] || 0) + 1
      };
    });
  };

  const handleRemoveFromCart = (productId: number, volume: number) => {
    setCartItems(prev => {
      const key = `${productId}-${volume}`;
      const newItems = { ...prev };
      delete newItems[key];
      return newItems;
    });
  };

  // Funkce pro správu produktů
  const handleAddProduct = (productData: Omit<typeof products[0], 'id'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts([...products, { ...productData, id: newId }]);
  };

  const handleUpdateProduct = (updatedProduct: typeof products[0]) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
    // Vyčistit košík od smazaného produktu
    setCartItems(prev => {
      const newItems = { ...prev };
      Object.keys(newItems).forEach(key => {
        if (key.startsWith(`${productId}-`)) {
          delete newItems[key];
        }
      });
      return newItems;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={getCartItemsCount()}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        onViewChange={setCurrentView}
        currentView={currentView}
      />
      
      <main className="pt-6">
        {currentView === 'catalog' && (
          <ProductList 
            onAddToCart={handleAddToCart} 
            cartItems={cartItems}
            products={products}
          />
        )}
        {currentView === 'order' && (
          <OrderForm 
            cartItems={cartItems}
            products={products}
            onRemoveFromCart={handleRemoveFromCart}
          />
        )}
        {currentView === 'admin' && (
          <AdminProducts
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
      </main>
    </div>
  );
}