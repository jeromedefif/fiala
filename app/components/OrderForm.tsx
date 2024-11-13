'use client';

import React, { useState } from 'react';
import { Package } from 'lucide-react';

type OrderFormProps = {
    cartItems: {[key: string]: number};
    products: Array<{
        id: number;
        name: string;
        category: string;
        inStock: boolean;
    }>;
    onRemoveFromCart: (productId: number, volume: number) => void;
};

type FormData = {
    name: string;
    email: string;
    phone: string;
    company: string;
    note: string;
};

const OrderForm = ({ cartItems, products, onRemoveFromCart }: OrderFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        company: '',
        note: ''
    });

    const getProductDetails = (productId: number) => {
        return products.find(p => p.id === productId);
    };

    const getTotalVolume = () => {
        return Object.entries(cartItems).reduce((total, [key, count]) => {
            const volume = parseInt(key.split('-')[1]);
            return total + (volume * count);
        }, 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Zde bude logika pro odeslání objednávky
        console.log('Odesílání objednávky:', {
            formData,
            cartItems,
            totalVolume: getTotalVolume()
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Přehled objednávky</h2>
                
                <div className="space-y-4 mb-6">
                    {Object.entries(cartItems).map(([key, count]) => {
                        const [productId, volume] = key.split('-');
                        const product = getProductDetails(parseInt(productId));
                        if (!product) return null;

                        return (
                            <div key={key} className="flex items-center border-b pb-4">
                                <Package className="h-6 w-6 text-gray-800 mr-3" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                    <p className="text-gray-600">
                                        {volume}L × {count}
                                    </p>
                                </div>
                                <div className="text-right text-gray-900 font-medium mr-4">
                                    {parseInt(volume) * count}L
                                </div>
                                <button
                                    onClick={() => onRemoveFromCart(parseInt(productId), parseInt(volume))}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Odebrat položku"
                                >
                                    <span className="text-red-500 hover:text-red-600">×</span>
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="text-right border-t pt-4">
                    <p className="text-lg font-bold text-gray-900">
                        Celkový objem: {getTotalVolume()}L
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Kontaktní údaje</h2>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                            Jméno a příjmení *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="Jan Novák"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="jan.novak@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
                            Telefon *
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="+420 123 456 789"
                        />
                    </div>

                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-1">
                            Název firmy
                        </label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="Název vaší firmy"
                        />
                    </div>

                    <div>
                        <label htmlFor="note" className="block text-sm font-medium text-gray-900 mb-1">
                            Poznámka k objednávce
                        </label>
                        <textarea
                            id="note"
                            name="note"
                            rows={3}
                            value={formData.note}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                            placeholder="Další informace k objednávce..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={Object.keys(cartItems).length === 0}
                            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {Object.keys(cartItems).length === 0 
                                ? 'Nejdříve přidejte položky do košíku' 
                                : 'Odeslat objednávku'
                            }
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;