'use client';

import React, { useState } from 'react';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

type Product = {
    id: number;
    name: string;
    category: string;
    inStock: boolean;
};

type AdminProductsProps = {
    products: Product[];
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (id: number) => void;
};

const AdminProducts = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: AdminProductsProps) => {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Víno',
        inStock: true
    });

    const categories = ["Víno", "Nápoje", "Ovocné víno", "Dusík", "PET"];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            onUpdateProduct({
                ...editingProduct,
                ...formData
            });
            setEditingProduct(null);
        } else {
            onAddProduct(formData);
            setIsAddingNew(false);
        }
        setFormData({ name: '', category: 'Víno', inStock: true });
    };

    const startEditing = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            inStock: product.inStock
        });
        setIsAddingNew(false);
    };

    const startAddingNew = () => {
        setIsAddingNew(true);
        setEditingProduct(null);
        setFormData({ name: '', category: 'Víno', inStock: true });
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setIsAddingNew(false);
        setFormData({ name: '', category: 'Víno', inStock: true });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Správa produktů</h2>
                {!isAddingNew && !editingProduct && (
                    <button
                        onClick={startAddingNew}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Přidat produkt
                    </button>
                )}
            </div>

            {/* Formulář pro přidání/editaci */}
            {(isAddingNew || editingProduct) && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {editingProduct ? 'Upravit produkt' : 'Nový produkt'}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                Název produktu
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                                Kategorie
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="inStock"
                                checked={formData.inStock}
                                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="inStock" className="ml-2 block text-sm font-medium text-gray-900">
                                Skladem
                            </label>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Zrušit
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {editingProduct ? 'Uložit změny' : 'Přidat produkt'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Seznam produktů */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Název</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategorie</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stav</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akce</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        product.inStock 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.inStock ? 'Skladem' : 'Není skladem'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => startEditing(product)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteProduct(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;