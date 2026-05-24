import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { LayoutDashboard, Layers, User, LogOut, Database, Menu, X } from 'lucide-react';

export const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Inventory Catalog', path: '/inventory', icon: Layers },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600 animate-none" />
          <span className="font-bold text-gray-900 tracking-tight">Inventory System</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 border border-gray-300 bg-white"
        >
          {isSidebarOpen ? <X className="w-4 h-4 text-gray-700" /> : <Menu className="w-4 h-4 text-gray-700" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`w-full md:w-60 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between py-4 px-4 ${
          isSidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-6">
          <div className="hidden md:flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="font-extrabold text-lg text-gray-900 tracking-tight">Inventory System</span>
          </div>

          <nav className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold border ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 text-current" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200 mt-6 md:mt-0">
          <div className="bg-gray-50 border border-gray-200 p-3 text-xs text-gray-700 flex items-center gap-2">
            <div className="p-1 bg-white border border-gray-200 text-blue-600">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-900 truncate">{user?.name}</div>
              <div className="font-mono text-[9px] uppercase text-gray-500">
                Role: {user?.role}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-transparent text-red-650 hover:bg-red-50 hover:border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
