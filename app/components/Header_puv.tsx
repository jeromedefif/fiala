'use client';

import React from 'react';
import { ShoppingCart, List } from 'lucide-react';

type HeaderProps = {
  cartItemsCount: number;
  onCartClick: () => void;
  onViewChange: (view: 'catalog' | 'order') => void;
  currentView: 'catalog' | 'order';
};

const Header = ({ cartItemsCount, onCartClick, onViewChange, currentView }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">E-shop</h1>
          
          <nav className="flex space-x-2">
            <button
              onClick={() => onViewChange('catalog')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'catalog'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="inline-block w-5 h-5 mr-2" />
              Katalog
            </button>
            
            <button
              onClick={() => onViewChange('order')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'order'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Objednávka
            </button>
          </nav>
        </div>

        <button
          onClick={onCartClick}
          className="relative px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;