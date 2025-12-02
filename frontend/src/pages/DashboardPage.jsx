import React from 'react';
import { DashboardLayout, Header } from '../components/Layout';
import { Card, Badge, Button } from '../components/UI';
import { useAuth } from '../hooks/useAuth';
import { useApiData } from '../hooks/useApi';
import { productsService, clientsService, ordersService } from '../services/api';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  
  // Cargar datos para las métricas
  const { data: products } = useApiData(productsService.getAll, []);
  const { data: clients } = useApiData(clientsService.getAll, []);
  const { data: orders } = useApiData(ordersService.getHeaders, []);
  
  // Calcular métricas
  const totalProducts = products?.length || 0;
  const totalClients = clients?.length || 0;
  const totalOrders = orders?.length || 0;
  const lowStockProducts = products?.filter(p => p.stock < 10).length || 0;

  const quickActions = [
    {
      title: 'Nuevo Producto',
      description: 'Agregar producto al inventario',
      href: '/products/new',
      icon: '📦',
      color: 'bg-blue-500'
    },
    {
      title: 'Nuevo Cliente',
      description: 'Registrar cliente nuevo',
      href: '/clients/new',
      icon: '🏢',
      color: 'bg-green-500'
    },
    {
      title: 'Nueva Orden',
      description: 'Crear orden de venta',
      href: '/orders/new',
      icon: '🛒',
      color: 'bg-purple-500'
    },
    {
      title: 'Ver Inventario',
      description: 'Revisar stock disponible',
      href: '/products',
      icon: '📊',
      color: 'bg-orange-500'
    }
  ];

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <DashboardLayout
      header={<Header user={user} onLogout={logout} />}
      activeItem="dashboard"
    >
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Hola, {user?.first_name || user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido al panel de administración de Sales Manager
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📦</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Productos</p>
              <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">🏢</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{totalClients}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🛒</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Órdenes</p>
              <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Stock Bajo</p>
              <p className="text-2xl font-semibold text-gray-900">{lowStockProducts}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="flex items-center mb-2">
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                    <span className="text-white text-sm">{action.icon}</span>
                  </div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h3>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/orders'}>
              Ver todas
            </Button>
          </div>
          
                    {recentOrders.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 text-center">No hay órdenes recientes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.id}</p>
                    <p className="text-sm text-gray-600">
                      Cliente: {order.client?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="success">Completada</Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Alerts Section */}
      {lowStockProducts > 0 && (
        <Card className="mt-8 border-l-4 border-yellow-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-yellow-800">
                Alerta de Stock Bajo
              </h4>
              <p className="text-yellow-700 mt-1">
                Tienes {lowStockProducts} producto(s) con stock bajo. 
                <button 
                  className="font-medium underline ml-1 hover:text-yellow-900"
                  onClick={() => window.location.href = '/products?filter=low-stock'}
                >
                  Revisar inventario
                </button>
              </p>
            </div>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};