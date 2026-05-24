import React from 'react';
import { useGetDashboardQuery } from '../store/api/apiSlice';
import { useSelector } from 'react-redux';
import { Layers, AlertTriangle, ShieldCheck, Clock, ShoppingCart, RefreshCw, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: response, isLoading, isFetching, refetch, error } = useGetDashboardQuery();

  const analytics = response?.data || {};
  const { totalProducts = 0, lowStockCount = 0, lowStockAlerts = [], recentMovements = [] } = analytics;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            System Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time catalog telemetry and stock flow monitoring
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={isLoading || isFetching}
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {isFetching ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="h-24 bg-white border border-gray-200 animate-pulse"></div>
        ) : (
          <div className="bg-white border border-gray-200 p-4 flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase">Total Catalog SKU</div>
              <div className="text-2xl font-extrabold text-gray-900 mt-1">{totalProducts}</div>
              <div className="text-[10px] text-gray-500 mt-2">Active catalog products</div>
            </div>
            <div className="p-1.5 bg-blue-50 text-blue-600 border border-blue-100">
              <Layers className="w-4 h-4" />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="h-24 bg-white border border-gray-200 animate-pulse"></div>
        ) : (
          <div className={`bg-white border p-4 flex items-start justify-between ${
            lowStockCount > 0 ? 'border-red-400 bg-red-50/10' : 'border-gray-200'
          }`}>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase">Low Stock Indicators</div>
              <div className={`text-2xl font-extrabold mt-1 ${
                lowStockCount > 0 ? 'text-red-655' : 'text-gray-900'
              }`}>{lowStockCount}</div>
              <div className={`text-[10px] mt-2 font-semibold ${
                lowStockCount > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {lowStockCount > 0 ? 'Replenishment needed' : 'All items sufficiently stocked'}
              </div>
            </div>
            <div className={`p-1.5 border ${
              lowStockCount > 0 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : 'bg-green-50 text-green-600 border-green-200'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="h-24 bg-white border border-gray-200 animate-pulse"></div>
        ) : (
          <div className="bg-white border border-gray-200 p-4 flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase">Security & Role</div>
              <div className="text-lg font-bold text-gray-900 mt-1 uppercase">{user?.role}</div>
              <div className="text-[10px] text-gray-500 mt-2">
                {user?.role === 'Admin' ? 'Unrestricted Admin Access' : 'Restricted Viewer Account'}
              </div>
            </div>
            <div className="p-1.5 bg-purple-50 text-purple-600 border border-purple-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-800">
          [Connection Error] {error?.data?.message || error?.message || 'Failed to connect to backend server. Please verify the server is running on port 5500.'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">Recent Movements (Last 5)</h2>
          </div>

          <div className="bg-white border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 animate-pulse"></div>
                ))}
              </div>
            ) : recentMovements.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No recent stock movements found.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 font-bold">
                    <th className="py-2.5 px-4 border-r border-gray-200">SKU Code</th>
                    <th className="py-2.5 px-4 border-r border-gray-200">Product Name</th>
                    <th className="py-2.5 px-4 text-center border-r border-gray-200">Type</th>
                    <th className="py-2.5 px-4 text-center border-r border-gray-200">Qty</th>
                    <th className="py-2.5 px-4 border-r border-gray-200">Operator</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentMovements.map((move) => {
                    const product = move.productId || {};
                    const operator = move.assignedBy || {};
                    const isIN = move.type === 'IN';
                    return (
                      <tr key={move._id} className="hover:bg-gray-50 text-gray-700">
                        <td className="py-2 px-4 font-mono font-bold text-blue-600 border-r border-gray-200">
                          {product.sku || 'N/A'}
                        </td>
                        <td className="py-2 px-4 border-r border-gray-200 font-semibold">
                          {product.name || 'Deleted Product'}
                        </td>
                        <td className="py-2 px-4 text-center border-r border-gray-200">
                          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold border ${
                            isIN
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : 'bg-red-50 border-red-200 text-red-700'
                          }`}>
                            {isIN ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                            {isIN ? 'IN' : 'OUT'}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center font-mono font-bold border-r border-gray-200">
                          {move.quantity}
                        </td>
                        <td className="py-2 px-4 border-r border-gray-200 text-gray-650">
                          {operator.name || 'System'}
                        </td>
                        <td className="py-2 px-4 text-gray-550">
                          {formatDate(move.timestamp)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <ShoppingCart className="w-4 h-4 text-red-600" />
            <h2 className="text-base font-bold text-gray-900">Low Stock Indicators</h2>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-white border border-gray-200 animate-pulse"></div>
                ))}
              </div>
            ) : lowStockAlerts.length === 0 ? (
              <div className="bg-white border border-gray-200 p-6 text-center text-gray-400 text-xs">
                No items are below threshold.
              </div>
            ) : (
              lowStockAlerts.map((prod) => {
                return (
                  <div
                    key={prod.id}
                    className="bg-white border border-gray-200 p-3 text-xs"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-bold text-gray-900">{prod.name}</div>
                        <div className="text-[10px] text-blue-600 font-mono font-bold mt-0.5">{prod.sku}</div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-red-650 bg-red-50 px-1 border border-red-200">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          {prod.quantity} Left
                        </span>
                        <div className="text-[9px] text-gray-450 font-semibold mt-1">Limit: {prod.threshold}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
