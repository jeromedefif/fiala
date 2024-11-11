'use client';

import React, { useState } from 'react';
import { Wine, Package } from 'lucide-react';

// Typy pro TypeScript
type Product = {
    id: number;
    name: string;
    category: string;
    inStock: boolean;
};

type ProductListProps = {
    onAddToCart: (productId: number, volume: number) => void;
    cartItems: {[key: string]: number};
    products: Product[];
};

const categories = ["Všechny", "Víno", "Nápoje", "Ovocné víno", "Dusík", "PET"];
const volumes = [5, 10, 20, 30, 50];

const ProductList = ({ onAddToCart, cartItems, products }: ProductListProps) => {
    const [selectedCategory, setSelectedCategory] = useState("Všechny");
    const [showCartItems, setShowCartItems] = useState(false);

    const isInCart = (productId: number) => {
        return Object.keys(cartItems).some(key => key.startsWith(`${productId}-`) && cartItems[key] > 0);
    };

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === "Všechny" ? true : product.category === selectedCategory;
        const cartMatch = showCartItems ? isInCart(product.id) : true;
        return categoryMatch && cartMatch;
    });

    const getCartCount = (productId: number, volume: number) => {
        const key = `${productId}-${volume}`;
        return cartItems[key] || 0;
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="mb-6 space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">Katalog produktů</h1>
                
                <div className="flex items-center justify-between">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="cart-filter"
                            checked={showCartItems}
                            onChange={(e) => setShowCartItems(e.target.checked)}
                            className="rounded"
                        />
                        <label htmlFor="cart-filter" className="text-gray-900 font-medium">
                            Zobrazit pouze položky v košíku
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {filteredProducts.map((product) => (
                    <div 
                        key={product.id} 
                        className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <div className="mr-4">
                            {product.category === "Víno" ? (
                                <Wine className="h-6 w-6 text-gray-800" />
                            ) : (
                                <Package className="h-6 w-6 text-gray-800" />
                            )}
                        </div>

                        <div className="flex-grow">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900">{product.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    product.inStock 
                                        ? 'bg-green-100 text-green-900' 
                                        : 'bg-red-100 text-red-900'
                                }`}>
                                    {product.inStock ? "Skladem" : "Není skladem"}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">
                                Kategorie: {product.category}
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            {volumes.map(volume => (
                                <div key={`${product.id}-${volume}`} className="relative">
                                    <button
                                        onClick={() => product.inStock && onAddToCart(product.id, volume)}
                                        disabled={!product.inStock}
                                        className={`w-16 px-2 py-1 text-sm border rounded-lg ${
                                            product.inStock
                                                ? 'bg-white text-gray-900 border-gray-300 hover:bg-blue-50 active:bg-blue-100'
                                                : 'opacity-50 cursor-not-allowed text-gray-500'
                                        }`}
                                    >
                                        {volume}L
                                    </button>
                                    {getCartCount(product.id, volume) > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                            {getCartCount(product.id, volume)}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredProducts.length === 0 && (
                <p className="text-center text-gray-900 mt-8 font-medium">
                    {showCartItems 
                        ? "V košíku nejsou žádné položky" 
                        : "V této kategorii nejsou žádné produkty"}
                </p>
            )}
        </div>
    );
};

export default ProductList;