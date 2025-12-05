import React from "react";

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

// Layout del dashboard
export const DashboardLayout = ({
  children,
  sidebar,
  header,
  activeItem = "dashboard",
}) => {
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
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 py-5">
              <h1 className="text-xl font-bold text-gray-900">Sales Manager</h1>
            </div>

            {/* Navigation */}
            <nav className="mt-5 flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${
                      item.current
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span className="mr-3 flex-shrink-0">{item.icon}</span>
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 md:pl-64">
          {/* Top header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
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

// Componente de header
// Componente de header
export const Header = ({ user, onLogout, title = "Dashboard" }) => {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Breadcrumbs o título de página */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {/* User menu */}
      <div className="flex items-center space-x-3">
        {/* User dropdown */}
        <div className="relative">
          <button className="flex items-center space-x-3 text-sm">
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
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Cerrar sesión"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
