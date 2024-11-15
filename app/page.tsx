'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import AdminProducts from './components/AdminProducts';
import LoginDialog from './components/LoginDialog';

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
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [products, setProducts] = useState(initialProducts);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Načtení košíku z localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Ukládání košíku do localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const getCartItemsCount = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  const handleViewChange = (view: 'catalog' | 'order' | 'admin') => {
    if (view === 'admin' && !isAuthenticated) {
      setIsLoginDialogOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleLogin = (password: string) => {
    if (password === 'jeromedefif') {
      setIsAuthenticated(true);
      setIsLoginDialogOpen(false);
      setCurrentView('admin');
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Header
          cartItemsCount={getCartItemsCount()}
          onViewChange={handleViewChange}
          currentView={currentView}
        />
      </div>

      <main className="container mx-auto px-4 py-6">
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
        {currentView === 'admin' && isAuthenticated && (
          <AdminProducts
            products={products}
            onAddProduct={(product) => {
              const newId = Math.max(...products.map(p => p.id), 0) + 1;
              setProducts([...products, { ...product, id: newId }]);
            }}
            onUpdateProduct={(product) => {
              setProducts(products.map(p => p.id === product.id ? product : p));
            }}
            onDeleteProduct={(id) => {
              setProducts(products.filter(p => p.id !== id));
            }}
          />
        )}
      </main>

      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}