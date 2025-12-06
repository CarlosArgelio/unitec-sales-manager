import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout, Header } from '../components/Layout';
import { Card, Button, Input, Select, Badge, Modal } from '../components/UI';
import { useAuth } from '../hooks/useAuth';
import { useApiData, useCrud, useForm } from '../hooks/useApi';
import { ordersService, productsService, clientsService } from '../services/api';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // acciones rápidas
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      handleNewOrder();
      // Limpiar URL para evitar abrir modal en cada reload
      navigate('/orders', { replace: true });
    }
  }, [searchParams, navigate]);

  // Cargar datos
  const {
    data: orders,
    loading,
    refetch,
  } = useApiData(ordersService.getHeaders, []);
  const { data: clients } = useApiData(clientsService.getAll, []);
  const { data: products } = useApiData(productsService.getAll, []);
  
  // Hooks para operaciones CRUD
  const {
    loading: saving,
    error,
    create,
    update,
    remove,
  } = useCrud(ordersService);

  // Formulario para cabecera de orden
  const {
    data: formData,
    handleChange,
    handleBlur,
    errors,
    validate,
    reset,
    setData: setFormData,
  } = useForm(
    {
      client: "",
      currency: "VES",
      exchange_rate: "1.0",
      _date: new Date().toISOString().split("T")[0],
    },
    {
      client: (value) => (!value ? "El cliente es requerido" : null),
      currency: (value) => (!value ? "La moneda es requerida" : null),
      exchange_rate: (value) =>
        !value || parseFloat(value) <= 0
          ? "La tasa de cambio debe ser mayor a 0"
          : null,
      _date: (value) => (!value ? "La fecha es requerida" : null),
    }
  );

  // Opciones para selects
  const clientOptions = clients?.map(client => ({
    value: client.ci,
    label: `${client.ci} - ${client.name}`
  })) || [];

  const productOptions = products?.map(product => ({
    value: product.code,
    label: `${product.code} - ${product.description} (Stock: ${product.stock})`
  })) || [];

  // Filtrar órdenes
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter(order => {
      const matchesSearch = 
        order.id?.toString().includes(searchTerm) ||
        order.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [orders, searchTerm]);

  // Agregar producto a la orden
  const addOrderItem = (productCode) => {
    const product = products.find(p => p.code === productCode);
    if (!product) return;

    const existingItem = orderItems.find(item => item.product === productCode);
    if (existingItem) {
      setOrderItems(items =>
        items.map(item =>
          item.product === productCode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          product: productCode,
          quantity: 1,
          correlative: orderItems.length + 1
        }
      ]);
    }
  };

  // Actualizar cantidad de un producto
  const updateItemQuantity = (productCode, quantity) => {
    if (quantity <= 0) {
      setOrderItems(items => items.filter(item => item.product !== productCode));
    } else {
      setOrderItems(items =>
        items.map(item =>
          item.product === productCode
            ? { ...item, quantity: parseInt(quantity) }
            : item
        )
      );
    }
  };

  // Calcular totales
  const calculateTotals = () => {
    return orderItems.reduce((acc, item) => {
      const product = products.find(p => p.code === item.product);
      const price = product?.price || 0;
      return acc + (price * item.quantity);
    }, 0);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (orderItems.length === 0) {
      alert('Debe agregar al menos un producto a la orden');
      return;
    }

    try {
      // Crear la cabecera de la orden
      const orderData = {
        client_id: formData.client,  // Enviar solo la CI como client_id
        currency: formData.currency,
        exchange_rate: parseFloat(formData.exchange_rate),
        _date: formData._date,
      };

      const result = await create(orderData);
      
      if (result.success) {
        // Crear las líneas de la orden
        const headerId = result.data.id;
        
        for (const item of orderItems) {
          await ordersService.createRow({
            ...item,
            header: headerId,
          });
        }

        setShowOrderModal(false);
        reset();
        setOrderItems([]);
        setEditingOrder(null);
        refetch();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Nueva orden
  const handleNewOrder = () => {
    setEditingOrder(null);
    reset();
    setOrderItems([]);
    setShowOrderModal(true);
  };

  return (
    <DashboardLayout
      header={<Header user={user} onLogout={logout} />}
      activeItem="orders"
    >
      {/* Header de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Órdenes</h1>
          <p className="text-gray-600 mt-2">
            Gestiona las órdenes de venta
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleNewOrder} variant="primary">
            + Nueva Orden
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por ID o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <Select
              placeholder="Todos los estados"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'pending', label: 'Pendiente' },
                { value: 'processing', label: 'Procesando' },
                { value: 'completed', label: 'Completada' },
                { value: 'cancelled', label: 'Cancelada' }
              ]}
              className="w-48"
            />
          </div>
        </div>
      </Card>

      {/* Lista de órdenes */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron órdenes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moneda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasa Cambio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.client?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order._date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.exchange_rate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success">
                        Completada
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal para crear nueva orden */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setEditingOrder(null);
          reset();
          setOrderItems([]);
        }}
        title="Nueva Orden"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Información básica de la orden */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información de la Orden
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Cliente"
                name="client"
                value={formData.client}
                onChange={(e) => handleChange('client', e.target.value)}
                options={clientOptions}
                error={errors.client}
                required
              />

              <Select
                label="Moneda"
                name="currency"
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                options={[
                  { value: 'VES', label: 'Bolivares Soberanos (VES)' },
                  { value: 'USD', label: 'Dólares Americanos (USD)' }
                ]}
                error={errors.currency}
                required
              />

              <Input
                label="Tasa de Cambio"
                name="exchange_rate"
                type="number"
                step="0.01"
                min="0"
                value={formData.exchange_rate}
                onChange={(e) => handleChange('exchange_rate', e.target.value)}
                error={errors.exchange_rate}
                required
              />

              <Input
                label="Fecha"
                name="_date"
                type="date"
                value={formData._date}
                onChange={(e) => handleChange('_date', e.target.value)}
                error={errors._date}
                required
              />
            </div>
          </Card>

          {/* Productos de la orden */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Productos
              </h3>
              <Select
                placeholder="Agregar producto..."
                onChange={(e) => {
                  if (e.target.value) {
                    addOrderItem(e.target.value);
                    e.target.value = ''; // Reset select
                  }
                }}
                options={productOptions}
                className="w-64"
              />
            </div>

            {orderItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay productos agregados
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item, index) => {
                  const product = products.find(p => p.code === item.product);
                  const subtotal = product ? product.price * item.quantity : 0;
                  
                  return (
                    <div key={`${item.product}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {product?.description || 'Producto no encontrado'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Código: {item.product} | Precio: ${product?.price || 0}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.product, parseInt(e.target.value))}
                          className="w-20"
                        />
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            ${subtotal.toFixed(2)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.product, 0)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${calculateTotals().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowOrderModal(false);
                setEditingOrder(null);
                reset();
                setOrderItems([]);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving || orderItems.length === 0}
            >
              Crear Orden
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};