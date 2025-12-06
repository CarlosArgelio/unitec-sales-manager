import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout, Header } from '../components/Layout';
import { Card, Button, Input, Badge, Modal } from '../components/UI';
import { useAuth } from '../hooks/useAuth';
import { useApiData, useCrud, useForm } from '../hooks/useApi';
import { clientsService } from '../services/api';

export const ClientsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // acciones rápidas
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      handleNewClient();
      // Limpiar URL para evitar abrir modal en cada reload
      navigate('/clients', { replace: true });
    }
  }, [searchParams, navigate]);

  // Cargar datos
  const { data: clients, loading, refetch } = useApiData(clientsService.getAll, []);
  
  // Hooks para operaciones CRUD
  const { loading: saving, error, create, update, remove } = useCrud(clientsService);
  
  // Formulario
  const {
    data: formData,
    handleChange,
    handleBlur,
    errors,
    validate,
    reset,
    setData: setFormData
  } = useForm(
    {
      ci: '',
      name: ''
    },
    {
      ci: (value) => {
        if (!value) return 'La cédula es requerida';
        if (value.length < 6) return 'La cédula debe tener al menos 6 caracteres';
        return null;
      },
      name: (value) => {
        if (!value) return 'El nombre es requerido';
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return null;
      }
    }
  );

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    
    return clients.filter(client => {
      const searchLower = searchTerm.toLowerCase();
      return (
        client.ci?.toLowerCase().includes(searchLower) ||
        client.name?.toLowerCase().includes(searchLower)
      );
    });
  }, [clients, searchTerm]);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      let result;
      if (editingClient) {
        result = await update(editingClient.ci, formData);
      } else {
        result = await create(formData);
      }

      if (result.success) {
        setShowModal(false);
        reset();
        setEditingClient(null);
        refetch();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Editar cliente
  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      ci: client.ci,
      name: client.name
    });
    setShowModal(true);
  };

  // Eliminar cliente
  const handleDelete = async (clientCi) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      const result = await remove(clientCi);
      if (result.success) {
        refetch();
      }
    }
  };

  // Nuevo cliente
  const handleNewClient = () => {
    setEditingClient(null);
    reset();
    setShowModal(true);
  };

  return (
    <DashboardLayout
      header={<Header user={user} onLogout={logout} />}
      activeItem="clients"
    >
      {/* Header de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">
            Gestiona la base de datos de clientes
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleNewClient} variant="primary">
            + Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <Input
          placeholder="Buscar por cédula o nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </Card>

      {/* Lista de clientes */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron clientes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cédula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.ci} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {client.ci}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {client.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success">
                        Activo
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(client.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(client.ci)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
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

      {/* Modal para crear/editar cliente */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingClient(null);
          reset();
        }}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Input
            label="Cédula de Identidad"
            name="ci"
            value={formData.ci}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.ci}
            placeholder="Ej: 12345678"
            disabled={!!editingClient} // No se puede editar la cédula
            required
          />

          <Input
            label="Nombre Completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            placeholder="Ej: Juan Pérez"
            required
          />

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingClient(null);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving}
            >
              {editingClient ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};