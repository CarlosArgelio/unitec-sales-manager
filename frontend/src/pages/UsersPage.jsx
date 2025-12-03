import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout, Header } from '../components/Layout';
import { Card, Button, Input, Badge, Modal } from '../components/UI';
import { useAuth } from '../hooks/useAuth';
import { useApiData, useCrud, useForm } from '../hooks/useApi';
import { usersService } from '../services/api';

export const UsersPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Cargar datos
  const { data: users, loading, refetch } = useApiData(usersService.getAll, []);
  
  // Hooks para operaciones CRUD
  const { loading: saving, error, create, update, remove } = useCrud(usersService);
  
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
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      password2: '',
      is_staff: false,
      is_active: true
    },
    {
      username: (value) => {
        if (!value) return 'El nombre de usuario es requerido';
        if (value.length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres';
        return null;
      },
      email: (value) => {
        if (!value) return 'El email es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'El email no es válido';
        return null;
      },
      first_name: (value) => !value ? 'El nombre es requerido' : null,
      last_name: (value) => !value ? 'El apellido es requerido' : null,
      password: (value) => {
        if (!editingUser && !value) return 'La contraseña es requerida';
        if (value && value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return null;
      },
      password2: (value) => {
        if (formData.password && value !== formData.password) {
          return 'Las contraseñas no coinciden';
        }
        return null;
      }
    }
  );

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.username?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.first_name?.toLowerCase().includes(searchLower) ||
        user.last_name?.toLowerCase().includes(searchLower)
      );
    });
  }, [users, searchTerm]);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        is_staff: formData.is_staff,
        is_active: formData.is_active
      };

      // Solo incluir password si se está creando o si se proporcionó una nueva
      if (!editingUser || formData.password) {
        userData.password = formData.password;
        if (formData.password2) {
          userData.password2 = formData.password2;
        }
      }

      let result;
      if (editingUser) {
        result = await update(editingUser.id || editingUser.username, userData);
      } else {
        result = await create(userData);
      }

      if (result.success) {
        setShowModal(false);
        reset();
        setEditingUser(null);
        refetch();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Editar usuario
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      password: '',
      password2: '',
      is_staff: user.is_staff,
      is_active: user.is_active
    });
    setShowModal(true);
  };

  // Eliminar usuario
  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const result = await remove(userId);
      if (result.success) {
        refetch();
      }
    }
  };

  // Nuevo usuario
  const handleNewUser = () => {
    setEditingUser(null);
    reset();
    setShowModal(true);
  };

  return (
    <DashboardLayout
      header={<Header user={user} onLogout={logout} />}
      activeItem="users"
    >
      {/* Header de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-2">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleNewUser} variant="primary">
            + Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por username, email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="staff">Administradores</option>
              <option value="user">Usuarios</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de usuarios */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.is_staff ? 'warning' : 'default'}>
                        {user.is_staff ? 'Administrador' : 'Usuario'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.is_active ? 'success' : 'danger'}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.date_joined).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        {user.username !== 'admin' && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal para crear/editar usuario */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
          reset();
        }}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre de Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.username}
              disabled={!!editingUser} // No se puede editar el username
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.first_name}
              required
            />

            <Input
              label="Apellido"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.last_name}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={editingUser ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              required={!editingUser}
            />

            <Input
              label="Confirmar Contraseña"
              name="password2"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password2}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_staff"
                checked={formData.is_staff}
                onChange={(e) => handleChange('is_staff', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_staff" className="ml-2 block text-sm text-gray-900">
                Es administrador
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Usuario activo
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingUser(null);
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
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};