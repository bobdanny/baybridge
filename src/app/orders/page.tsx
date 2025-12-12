// @ts-nocheck


"use client";


import React, { useState } from 'react';
import { Plus, Upload, Download, Search, Filter, Edit, Trash2, Eye, Copy, MoreVertical, X, Image as ImageIcon, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample products data
  const products = [
    { id: 1, name: 'Premium Arabica Green Beans', category: 'Green Beans', sku: 'ARB-GRN-001', price: 850, stock: 245, status: 'active', image: '🌱' },
    { id: 2, name: 'Robusta Roasted Dark', category: 'Roasted Beans', sku: 'ROB-RST-002', price: 720, stock: 18, status: 'active', image: '☕' },
    { id: 3, name: 'Instant Coffee Premium', category: 'Instant Powder', sku: 'INS-PWD-003', price: 450, stock: 0, status: 'inactive', image: '🥤' },
    { id: 4, name: 'Organic Arabica Green', category: 'Green Beans', sku: 'ARB-GRN-004', price: 950, stock: 156, status: 'active', image: '🌱' },
    { id: 5, name: 'Medium Roast Blend', category: 'Roasted Beans', sku: 'BLD-RST-005', price: 680, stock: 89, status: 'active', image: '☕' },
    { id: 6, name: 'Classic Instant Powder', category: 'Instant Powder', sku: 'INS-PWD-006', price: 380, stock: 234, status: 'active', image: '🥤' },
    { id: 7, name: 'Single Origin Arabica', category: 'Green Beans', sku: 'ARB-GRN-007', price: 1200, stock: 45, status: 'active', image: '🌱' },
    { id: 8, name: 'Espresso Roast Dark', category: 'Roasted Beans', sku: 'ESP-RST-008', price: 790, stock: 12, status: 'active', image: '☕' },
    { id: 9, name: 'Premium Instant Gold', category: 'Instant Powder', sku: 'INS-PWD-009', price: 650, stock: 167, status: 'active', image: '🥤' },
    { id: 10, name: 'French Roast Blend', category: 'Roasted Beans', sku: 'FRN-RST-010', price: 850, stock: 3, status: 'active', image: '☕' },
  ];

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700 border-red-200' };
    if (stock < 20) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700 border-green-200' };
  };

  const stockAlerts = products.filter(p => p.stock < 20 && p.stock > 0);
  const outOfStock = products.filter(p => p.stock === 0);
  const topSelling = [
    { name: 'Premium Arabica Green Beans', sales: 145 },
    { name: 'Classic Instant Powder', sales: 132 },
    { name: 'Medium Roast Blend', sales: 98 },
  ];

  const recentlyAdded = products.slice(0, 3);

  const handleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pid => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-2">
              Products
            </h1>
            <p className="text-gray-600">Manage your coffee product inventory</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 bg-white border-2 border-emerald-600/20 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-all duration-300 font-semibold shadow-sm flex items-center gap-2">
              <Upload className="w-5 h-5" /> Import
            </button>
            <button className="px-4 py-2.5 bg-white border-2 border-emerald-600/20 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-all duration-300 font-semibold shadow-sm flex items-center gap-2">
              <Download className="w-5 h-5" /> Export
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Product
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-emerald-100/50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 bg-white text-gray-700 font-semibold min-w-[180px]"
            >
              <option value="all">All Categories</option>
              <option value="green">Green Beans</option>
              <option value="roasted">Roasted Beans</option>
              <option value="instant">Instant Powder</option>
            </select>

            {/* Status Filter */}
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 bg-white text-gray-700 font-semibold min-w-[180px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>

            {/* More Filters Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all duration-300 font-semibold flex items-center gap-2"
            >
              <Filter className="w-5 h-5" /> Filters
            </button>

            {/* View Toggle */}
            <div className="flex gap-2 bg-emerald-50 p-1 rounded-xl border-2 border-emerald-200">
              <button 
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === 'table' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600'}`}
              >
                Table
              </button>
              <button 
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === 'cards' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600'}`}
              >
                Cards
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t-2 border-emerald-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" className="w-full px-3 py-2 border-2 border-emerald-100 rounded-lg focus:outline-none focus:border-emerald-600" />
                    <input type="number" placeholder="Max" className="w-full px-3 py-2 border-2 border-emerald-100 rounded-lg focus:outline-none focus:border-emerald-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Range</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" className="w-full px-3 py-2 border-2 border-emerald-100 rounded-lg focus:outline-none focus:border-emerald-600" />
                    <input type="number" placeholder="Max" className="w-full px-3 py-2 border-2 border-emerald-100 rounded-lg focus:outline-none focus:border-emerald-600" />
                  </div>
                </div>
                <div className="flex items-end">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedProducts.length > 0 && (
        <div className="mb-6 bg-emerald-600 text-white rounded-xl p-4 shadow-lg flex items-center justify-between">
          <span className="font-semibold">{selectedProducts.length} products selected</span>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-semibold">
              Bulk Edit
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-semibold">
              Export Selected
            </button>
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-semibold">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Products Section */}
        <div className="lg:col-span-3">
          {viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
                    <tr>
                      <th className="py-4 px-4">
                        <input 
                          type="checkbox" 
                          checked={selectedProducts.length === products.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Product</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Category</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">SKU</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Price</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Stock</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Status</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-emerald-50/30 transition-colors">
                          <td className="py-4 px-4">
                            <input 
                              type="checkbox" 
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleSelectProduct(product.id)}
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-2xl">
                                {product.image}
                              </div>
                              <span className="font-semibold text-gray-900">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700">{product.category}</td>
                          <td className="py-4 px-4 text-sm font-mono text-gray-600">{product.sku}</td>
                          <td className="py-4 px-4 text-sm font-bold text-gray-900">₹{product.price}</td>
                          <td className="py-4 px-4 text-sm font-semibold text-gray-900">{product.stock} kg</td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${stockStatus.color}`}>
                              {stockStatus.label}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors" title="View">
                                <Eye className="w-4 h-4 text-emerald-700" />
                              </button>
                              <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                                <Edit className="w-4 h-4 text-blue-700" />
                              </button>
                              <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors" title="Duplicate">
                                <Copy className="w-4 h-4 text-purple-700" />
                              </button>
                              <button className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4 text-red-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-3 py-1 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-600 bg-white text-sm font-semibold"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-600">entries</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((page) => (
                      <button 
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${currentPage === page ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Card View */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-emerald-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-6xl">
                        {product.image}
                      </div>
                      <div className="absolute top-3 right-3">
                        <input 
                          type="checkbox" 
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-gray-500">SKU</p>
                          <p className="text-sm font-mono text-gray-700">{product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Stock</p>
                          <p className="text-sm font-bold text-gray-900">{product.stock} kg</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-emerald-700">₹{product.price}</p>
                        <div className="flex gap-2">
                          <button className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-emerald-700" />
                          </button>
                          <button className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Stock Alerts */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-emerald-100/50">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-gray-900">Stock Alerts</h3>
            </div>
            <div className="space-y-3">
              {stockAlerts.map((product) => (
                <div key={product.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-1">{product.name}</p>
                  <p className="text-xs text-amber-700">Only {product.stock} kg left</p>
                </div>
              ))}
              {outOfStock.map((product) => (
                <div key={product.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-1">{product.name}</p>
                  <p className="text-xs text-red-700">Out of stock</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 shadow-lg text-white">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-bold">Top Selling</h3>
            </div>
            <div className="space-y-3">
              {topSelling.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm text-emerald-50">{product.name}</p>
                  <span className="font-bold">{product.sales}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Added */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-emerald-100/50">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-900">Recently Added</h3>
            </div>
            <div className="space-y-3">
              {recentlyAdded.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-xl">
                    {product.image}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-emerald-100 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Product Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Premium Arabica Green Beans"
                  className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              {/* Category & SKU */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 bg-white">
                    <option>Green Beans</option>
                    <option>Roasted Beans</option>
                    <option>Instant Powder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">SKU / Product Code *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., ARB-GRN-001"
                    className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                  <input 
                    type="number" 
                    placeholder="850"
                    className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity (kg) *</label>
                  <input 
                    type="number" 
                    placeholder="245"
                    className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description / Notes</label>
                <textarea 
                  rows={4}
                  placeholder="Enter product description, origin, flavor notes, etc."
                  className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                <div>
                  <p className="font-semibold text-gray-900">Product Status</p>
                  <p className="text-sm text-gray-600">Make this product visible to customers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}