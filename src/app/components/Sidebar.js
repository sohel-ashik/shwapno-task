'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package2, 
  ChevronLeft, 
  ChevronRight,
  Menu
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Inventory',
      href: '/',
      icon: Package2
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-40 lg:hidden bg-blue-600 text-white p-2 rounded-md shadow-md"
      >
        <Menu size={20} />
      </button>
      
      {/* Sidebar Overlay for Mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full z-40
          transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-900 shadow-xl
          flex flex-col
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          {!collapsed && (
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Inventory App
            </h1>
          )}
          
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 lg:block hidden"
          >
            {collapsed ? 
              <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : 
              <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            }
          </button>
          
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`} />
                
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="px-3 py-4 border-t dark:border-gray-700">
          {!collapsed && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              © 2024 Shwapno Task
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;