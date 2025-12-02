import React, { useState } from 'react';
import { DashboardLayout, Header } from '../components/Layout';
import { Card, Button, Input, Badge } from '../components/UI';
import { useAuth } from '../hooks/useAuth';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  
  // Estados para diferentes secciones de configuración
  const [generalSettings, setGeneralSettings] = useState({
    company_name: 'Sales Manager',
    company_email: 'info@salesmanager.com',
    company_phone: '+58 212 123 4567',
    currency: 'VES',
    language: 'es'
  });

  const [orderSettings, setOrderSettings] = useState({
    auto_increment: true,
    default_payment_terms: 30,
    require_approval: false,
    allow_partial_shipments: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    low_stock_alerts: true,
    order_notifications: true,
    user_registration_alerts: false,
    daily_reports: true
  });

  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'orders', name: 'Órdenes', icon: '🛒' },
    { id: 'notifications', name: 'Notificaciones', icon: '🔔' },
    { id: 'users', name: 'Usuarios', icon: '👥' },
    { id: 'backup', name: 'Respaldos', icon: '💾' }
  ];

  const handleSave = (section) => {
    // Aquí iría la lógica para guardar en el backend
    alert(`${section} guardado exitosamente`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nombre de la Empresa"
                  value={generalSettings.company_name}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    company_name: e.target.value
                  })}
                />
                <Input
                  label="Email de la Empresa"
                  type="email"
                  value={generalSettings.company_email}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    company_email: e.target.value
                  })}
                />
                <Input
                  label="Teléfono de la Empresa"
                  value={generalSettings.company_phone}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    company_phone: e.target.value
                  })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda Principal
                  </label>
                  <select
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings({
                      ...generalSettings,
                      currency: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="VES">Bolivares Soberanos (VES)</option>
                    <option value="USD">Dólares Americanos (USD)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={() => handleSave('Configuración general')} variant="primary">
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de Órdenes
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-incremento de IDs</h4>
                    <p className="text-sm text-gray-600">Generar IDs automáticamente para las órdenes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={orderSettings.auto_increment}
                    onChange={(e) => setOrderSettings({
                      ...orderSettings,
                      auto_increment: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <Input
                  label="Términos de Pago por Defecto (días)"
                  type="number"
                  value={orderSettings.default_payment_terms}
                  onChange={(e) => setOrderSettings({
                    ...orderSettings,
                    default_payment_terms: parseInt(e.target.value)
                  })}
                />

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Requerir Aprobación</h4>
                    <p className="text-sm text-gray-600">Las órdenes deben ser aprobadas antes de procesarse</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={orderSettings.require_approval}
                    onChange={(e) => setOrderSettings({
                      ...orderSettings,
                      require_approval: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Permitir Envíos Parciales</h4>
                    <p className="text-sm text-gray-600">Allow partial shipments for large orders</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={orderSettings.allow_partial_shipments}
                    onChange={(e) => setOrderSettings({
                      ...orderSettings,
                      allow_partial_shipments: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={() => handleSave('Configuración de órdenes')} variant="primary">
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de Notificaciones
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Alertas de Stock Bajo</h4>
                    <p className="text-sm text-gray-600">Notificar cuando el stock esté por debajo del mínimo</p>
                  </div>
                  <Badge variant={notificationSettings.low_stock_alerts ? 'success' : 'default'}>
                    {notificationSettings.low_stock_alerts ? 'Activado' : 'Desactivado'}
                  </Badge>
                  <input
                    type="checkbox"
                    checked={notificationSettings.low_stock_alerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      low_stock_alerts: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Notificaciones de Órdenes</h4>
                    <p className="text-sm text-gray-600">Notificar sobre nuevas órdenes y cambios de estado</p>
                  </div>
                  <Badge variant={notificationSettings.order_notifications ? 'success' : 'default'}>
                    {notificationSettings.order_notifications ? 'Activado' : 'Desactivado'}
                  </Badge>
                  <input
                    type="checkbox"
                    checked={notificationSettings.order_notifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      order_notifications: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Registro de Usuarios</h4>
                    <p className="text-sm text-gray-600">Notificar cuando se registren nuevos usuarios</p>
                  </div>
                  <Badge variant={notificationSettings.user_registration_alerts ? 'success' : 'default'}>
                    {notificationSettings.user_registration_alerts ? 'Activado' : 'Desactivado'}
                  </Badge>
                  <input
                    type="checkbox"
                    checked={notificationSettings.user_registration_alerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      user_registration_alerts: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Reportes Diarios</h4>
                    <p className="text-sm text-gray-600">Enviar reporte diario de actividad</p>
                  </div>
                  <Badge variant={notificationSettings.daily_reports ? 'success' : 'default'}>
                    {notificationSettings.daily_reports ? 'Activado' : 'Desactivado'}
                  </Badge>
                  <input
                    type="checkbox"
                    checked={notificationSettings.daily_reports}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      daily_reports: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={() => handleSave('Configuración de notificaciones')} variant="primary">
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Gestión de Usuarios
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      Funcionalidad Administrativa
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Para gestionar usuarios, ve a la sección de Usuarios en el menú principal.
                    </p>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = '/users'}
                      >
                        Ir a Gestión de Usuarios
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Respaldos del Sistema
              </h3>
              <div className="space-y-4">
                <Card>
                  <h4 className="font-medium text-gray-900 mb-3">Respaldos Automáticos</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Configura respaldos automáticos de la base de datos
                  </p>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      Crear Respaldo Manual
                    </Button>
                    <Button variant="outline" size="sm">
                      Configurar Automáticos
                    </Button>
                  </div>
                </Card>

                <Card>
                  <h4 className="font-medium text-gray-900 mb-3">Respaldos Recientes</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">backup_2025_12_01.sql</p>
                        <p className="text-sm text-gray-600">2.3 MB - 1 dic 2025</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Descargar
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">backup_2025_11_30.sql</p>
                        <p className="text-sm text-gray-600">2.1 MB - 30 nov 2025</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Descargar
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      header={<Header user={user} onLogout={logout} />}
      activeItem="settings"
    >
      {/* Header de la página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">
          Configura las opciones del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de navegación */}
        <div className="lg:col-span-1">
          <Card padding="none">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium text-left
                    ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <Card>
            {renderTabContent()}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};