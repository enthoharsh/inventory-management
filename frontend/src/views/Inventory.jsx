import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useAdjustStockMutation
} from '../store/api/apiSlice';
import { useDebounce } from '../hooks/useDebounce';
import {
  Search, Filter, Plus, Edit, PackagePlus, AlertTriangle, ChevronLeft, ChevronRight, X, Loader2, DollarSign, Info
} from 'lucide-react';

export const Inventory = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'Admin';

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');

  const [adjustType, setAdjustType] = useState('IN');
  const [adjustQuantity, setAdjustQuantity] = useState('');

  const [formError, setFormError] = useState('');

  const { data: response, isLoading, isFetching } = useGetProductsQuery(
    {
      search: debouncedSearchTerm,
      category: selectedCategory,
      page: currentPage,
      limit,
    },
    {
      keepPreviousData: true,
    }
  );

  const [createProduct, { isLoading: isCreateLoading }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdateLoading }] = useUpdateProductMutation();
  const [adjustStock, { isLoading: isAdjustLoading }] = useAdjustStockMutation();

  const products = response?.data?.products || [];
  const totalItems = response?.total || 0;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const categories = [
    'Electronics',
    'Health & Beauty',
  ];

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setFormError('');
    setSku('');
    setName('');
    setCategory('Electronics');
    setPrice('');
    setQuantity('');
    setLowStockThreshold('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormError('');
    setSelectedProduct(product);
    setSku(product.sku);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price);
    setLowStockThreshold(product.lowStockThreshold);
    setIsEditModalOpen(true);
  };

  const openAdjustModal = (product) => {
    setFormError('');
    setSelectedProduct(product);
    setAdjustType('IN');
    setAdjustQuantity('');
    setIsAdjustModalOpen(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!sku || !name || !category || !price || !quantity) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      await createProduct({
        sku,
        name,
        category,
        price: Number(price),
        quantity: Number(quantity),
        lowStockThreshold: Number(lowStockThreshold) || 10,
      }).unwrap();

      setIsAddModalOpen(false);
    } catch (err) {
      setFormError(err?.data?.message || err?.message || 'Failed to create product.');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!price || !category || !name || !sku) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      await updateProduct({
        id: selectedProduct._id,
        sku,
        name,
        category,
        price: Number(price),
        lowStockThreshold: Number(lowStockThreshold) || 10,
      }).unwrap();

      setIsEditModalOpen(false);
    } catch (err) {
      setFormError(err?.data?.message || err?.message || 'Failed to update product.');
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!adjustQuantity || Number(adjustQuantity) < 1) {
      setFormError('Adjustment quantity must be at least 1.');
      return;
    }

    try {
      await adjustStock({
        productId: selectedProduct._id,
        type: adjustType,
        quantity: Number(adjustQuantity),
      }).unwrap();

      setIsAdjustModalOpen(false);
    } catch (err) {
      setFormError(err?.data?.message || err?.message || 'Failed to adjust stock.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Browse and adjust master product listings and stock counts
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 border border-blue-650 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-3 border border-gray-200 text-xs">
        <div className="flex-1 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold text-gray-700">Search:</span>
          <input
            type="text"
            placeholder="Search by SKU or Name..."
            value={searchInput}
            onChange={handleSearchChange}
            className="flex-1 bg-white border border-gray-300 px-2 py-1 text-gray-900 outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold text-gray-700">Category:</span>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="bg-white border border-gray-300 px-2 py-1 text-gray-700 outline-none focus:border-blue-600"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end font-bold text-gray-500 md:ml-auto">
          Showing {products.length > 0 ? (currentPage - 1) * limit + 1 : 0} - {Math.min(totalItems, currentPage * limit)} of {totalItems} items
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        {isLoading ? (
          <div className="p-6 text-center text-xs text-gray-500">
            Loading catalog entries...
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-xs text-gray-400">
            No products found matching filters.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 font-bold">
                <th className="py-2.5 px-4 border-r border-gray-200">SKU Code</th>
                <th className="py-2.5 px-4 border-r border-gray-200">Product Name</th>
                <th className="py-2.5 px-4 border-r border-gray-200">Category</th>
                <th className="py-2.5 px-4 text-right border-r border-gray-200">Price</th>
                <th className="py-2.5 px-4 text-center border-r border-gray-200">In Stock</th>
                <th className="py-2.5 px-4 text-center border-r border-gray-200">Alert Limit</th>
                {isAdmin && <th className="py-2.5 px-4 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((prod) => {
                const isLowStock = prod.quantity <= prod.lowStockThreshold;
                return (
                  <tr key={prod._id} className="hover:bg-gray-50 text-gray-700">
                    <td className="py-2 px-4 font-mono font-bold text-blue-600 border-r border-gray-200">
                      {prod.sku}
                    </td>
                    <td className="py-2 px-4 font-semibold border-r border-gray-200 text-gray-900">
                      {prod.name}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-200">
                      {prod.category}
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-semibold border-r border-gray-200 text-gray-900">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-center border-r border-gray-200">
                      <span className={`font-mono font-bold ${isLowStock ? 'text-red-650 font-extrabold' : 'text-gray-800'}`}>
                        {prod.quantity}
                      </span>
                      {isLowStock && (
                        <span className="inline-flex items-center gap-0.5 ml-1.5 text-[9px] font-bold text-red-600 bg-red-50 px-1 border border-red-200 uppercase">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Low
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center font-mono border-r border-gray-200 text-gray-500">
                      {prod.lowStockThreshold}
                    </td>
                    {isAdmin && (
                      <td className="py-2 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openAdjustModal(prod)}
                            className="p-1 border border-blue-500 text-blue-600 bg-white hover:bg-blue-50"
                            title="Adjust Stock Quantity"
                          >
                            <PackagePlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                            title="Edit Product Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-3 border border-gray-200 text-xs">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isFetching}
            className="flex items-center gap-1 px-2.5 py-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 font-semibold"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>

          <span className="font-semibold text-gray-500">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || isFetching}
            className="flex items-center gap-1 px-2.5 py-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 font-semibold"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4">
          <div className="relative w-full max-w-md bg-white border border-gray-200 p-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" /> Create New Product
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-800 font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block" htmlFor="add-sku">
                    SKU Code *
                  </label>
                  <input
                    id="add-sku"
                    type="text"
                    placeholder="PROD-EL-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-2.5 py-1 text-gray-900 outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block" htmlFor="add-name">
                    Product Name *
                  </label>
                  <input
                    id="add-name"
                    type="text"
                    placeholder="Speaker"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-2.5 py-1 text-gray-900 outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block" htmlFor="add-category">
                    Category *
                  </label>
                  <select
                    id="add-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-2 py-1 text-gray-700 outline-none focus:border-blue-600"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block" htmlFor="add-price">
                    Unit Price ($) *
                  </label>
                  <input
                    id="add-price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="49.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-2.5 py-1 text-gray-900 outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block" htmlFor="add-qty">
                    Initial Stock *
                  </label>
                  <input
                    id="add-qty"
                    type="number"
                    min="0"
                    placeholder="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-2.5 py-1 text-gray-900 outline-none focus:border-blue-650"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block" htmlFor="add-threshold">
                    Low Threshold
                  </label>
                  <input
                    id="add-threshold"
                    type="number"
                    min="0"
                    placeholder="10"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-2.5 py-1 text-gray-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreateLoading}
                  className="px-3 py-1.5 border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
                >
                  {isCreateLoading ? 'Loading...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4">
          <div className="relative w-full max-w-md bg-white border border-gray-200 p-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Edit className="w-4 h-4 text-blue-600" /> Edit Product Details
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 hover:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-800 font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block" htmlFor="edit-sku">
                    SKU Code
                  </label>
                  <input
                    id="edit-sku"
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-2.5 py-1 text-gray-900 outline-none focus:border-blue-600 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block" htmlFor="edit-name">
                    Product Name *
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-2.5 py-1 text-gray-900 outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block" htmlFor="edit-category">
                    Category *
                  </label>
                  <select
                    id="edit-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-2 py-1 text-gray-700 outline-none focus:border-blue-650"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block" htmlFor="edit-price">
                    Unit Price ($) *
                  </label>
                  <input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-2.5 py-1 text-gray-900 outline-none focus:border-blue-650"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block" htmlFor="edit-threshold">
                  Low Stock Threshold *
                </label>
                <input
                  id="edit-threshold"
                  type="number"
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full bg-white border border-gray-300 px-2.5 py-1 text-gray-900 outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdateLoading}
                  className="px-3 py-1.5 border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
                >
                  {isUpdateLoading ? 'Loading...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4">
          <div className="relative w-full max-w-sm bg-white border border-gray-200 p-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <PackagePlus className="w-4 h-4 text-blue-600" /> Adjust Stock Quantity
              </h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 hover:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-800 font-semibold">
                {formError}
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 p-3 mb-4 text-xs text-gray-700">
              <div className="flex justify-between font-semibold">
                <span>Product SKU:</span>
                <span className="font-mono text-blue-600">{selectedProduct?.sku}</span>
              </div>
              <div className="font-bold text-gray-900 mt-1">{selectedProduct?.name}</div>
              <div className="flex justify-between border-t border-gray-200 pt-1.5 mt-1.5 font-bold">
                <span>In-Stock Quantity:</span>
                <span>{selectedProduct?.quantity}</span>
              </div>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">
                  Movement Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('IN')}
                    className={`py-1.5 border text-xs font-semibold ${adjustType === 'IN'
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-white border-gray-300 text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    STOCK IN
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('OUT')}
                    className={`py-1.5 border text-xs font-semibold ${adjustType === 'OUT'
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : 'bg-white border-gray-300 text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    STOCK OUT
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block" htmlFor="adjust-qty">
                  Adjustment Quantity *
                </label>
                <input
                  id="adjust-qty"
                  type="number"
                  min="1"
                  placeholder="25"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  className="w-full bg-white border border-gray-300 px-2.5 py-1 text-gray-900 outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjustLoading}
                  className="px-3 py-1.5 border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
                >
                  {isAdjustLoading ? 'Loading...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
