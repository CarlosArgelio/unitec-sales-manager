import React, { useState } from "react";

// Layout principal de la aplicación
export const MainLayout = ({ children }) => {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
};

// Layout para páginas de autenticación
export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">{children}</div>
    </div>
  );
};

// Layout del dashboard con sidebar responsive
export const DashboardLayout = ({
  children,
  sidebar,
  header,
  activeItem = "dashboard",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "#/dashboard",
      icon: "📊",
      current: activeItem === "dashboard",
    },
    {
      name: "Productos",
      href: "#/products",
      icon: "📦",
      current: activeItem === "products",
    },
    {
      name: "Categorías",
      href: "#/categories",
      icon: "📋",
      current: activeItem === "categories",
    },
    {
      name: "Clientes",
      href: "#/clients",
      icon: "🏢",
      current: activeItem === "clients",
    },
    {
      name: "Órdenes",
      href: "#/orders",
      icon: "🛒",
      current: activeItem === "orders",
    },
    {
      name: "Usuarios",
      href: "#/users",
      icon: "👥",
      current: activeItem === "users",
    },
    {
      name: "Configuración",
      href: "#/settings",
      icon: "⚙️",
      current: activeItem === "settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Layout Grid */}
      <div className="h-screen flex">
        {/* Sidebar para desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
          <SidebarContent navigation={navigation} />
        </div>

        {/* Sidebar móvil - Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Overlay para cerrar sidebar */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50" 
              onClick={() => setSidebarOpen(false)}
            ></div>
            
            {/* Sidebar móvil */}
            <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
              <SidebarContent navigation={navigation} />
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex flex-col flex-1 md:pl-64">
          {/* Top header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              {/* Botón hamburguesa para móvil */}
              <div className="flex items-center">
                <button
                  type="button"
                  className="md:hidden -ml-2 mr-2 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Abrir sidebar</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                
                {/* Breadcrumb o título de página */}
                <div className="hidden md:block">
                  <span className="text-lg font-medium text-gray-700">
                    {navigation.find(item => item.current)?.name || 'Dashboard'}
                  </span>
                </div>
              </div>

              {/* Resto del header */}
              {header}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Componente del contenido del sidebar
const SidebarContent = ({ navigation }) => {
  return (
    <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-4 py-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">Sales Manager</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 px-2 pb-4 space-y-1">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`
              group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150
              ${
                item.current
                  ? "bg-blue-100 text-blue-900 border-r-2 border-blue-500"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            <span className="mr-3 flex-shrink-0 text-lg" role="img" aria-label={item.name}>
              {item.icon}
            </span>
            <span className="truncate">{item.name}</span>
          </a>
        ))}
      </nav>

      {/* Footer del sidebar */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Sales Manager
          <br />
          <span className="text-gray-400">v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

// Componente de header mejorado
export const Header = ({ user, onLogout, title = "Dashboard" }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      {/* Breadcrumbs o título de página */}
      <div className="md:hidden">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {/* User menu */}
      <div className="flex items-center space-x-3">
        {/* User dropdown */}
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-3 text-sm p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-700">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <a href="#/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Mi Perfil
              </a>
              <a href="#/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Configuración
              </a>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};