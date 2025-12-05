import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout, Header } from '../components/Layout';
import { Card, Button, Input, Badge, Modal } from '../components/UI';
import { useAuth } from '../hooks/useAuth';
import { useApiData, useCrud, useForm } from '../hooks/useApi';
import { categoriesService } from '../services/api';

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Cargar datos
  const { data: categories, loading, refetch } = useApiData(categoriesService.getAll, []);
  
  // Hooks para operaciones CRUD
  const { loading: saving, error, create, update, remove } = useCrud(categoriesService);
  
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
      code: '',
      description: ''
    },
    {
      code: (value) => !value ? 'El código es requerido' : null,
      description: (value) => !value ? 'La descripción es requerida' : null
    }
  );

  // Filtrar categorías
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    
    return categories.filter(category => {
      const matchesSearch = 
        category.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [categories, searchTerm]);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const categoryData = {
      code: formData.code,
      description: formData.description
    };

    try {
      let result;
      if (editingCategory) {
        result = await update(editingCategory.code, categoryData);
      } else {
        result = await create(categoryData);
      }

      if (result.success) {
        setShowModal(false);
        reset();
        setEditingCategory(null);
        refetch();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Editar categoría
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      code: category.code,
      description: category.description
    });
    setShowModal(true);
  };

  // Eliminar categoría
  const handleDelete = async (categoryCode) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría? Esto puede afectar productos asociados.')) {
      const result = await remove(categoryCode);
      if (result.success) {
        refetch();
      }
    }
  };

  // Nueva categoría
  const handleNewCategory = () => {
    setEditingCategory(null);
    reset();
    setShowModal(true);
  };

  // Obtener cantidad de productos por categoría
  const getProductCount = (categoryCode) => {
    return categories?.reduce((count, category) => {
      if (category.code === categoryCode) {
        return category.products?.length || 0;
      }
      return count;
    }, 0) || 0;
  };

  return (
    <DashboardLayout
      header={<Header user={user} onLogout={logout} />}
      activeItem="categories"
    >
      {/* Header de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600 mt-2">
            Gestiona las categorías de productos
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleNewCategory} variant="primary">
            + Nueva Categoría
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="code">Código</option>
                  <option value="description">Descripción</option>
                  <option value="created">Fecha de creación</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Con productos
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Todas</option>
                  <option value="with">Con productos</option>
                  <option value="without">Sin productos</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Lista de categorías */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron categorías</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Creación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Modificación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Badge variant="info">
                          {category.products?.length || 0} productos
                        </Badge>
                        {(category.products?.length || 0) > 0 && (
                          <span className="ml-2 text-xs text-green-500">✓ Activa</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(category.code)}
                          className="text-red-600 hover:text-red-900"
                          disabled={getProductCount(category.code) > 0}
                          title={getProductCount(category.code) > 0 ? 'No se puede eliminar una categoría con productos asociados' : 'Eliminar categoría'}
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

      {/* Modal para crear/editar categoría */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
          reset();
        }}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Input
            label="Código"
            name="code"
            value={formData.code}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.code}
            disabled={!!editingCategory} // No se puede editar el código
            required
            placeholder="Ej: BEBIDAS, PLATILLOS, POSTRES"
          />

          <Input
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.description}
            required
            placeholder="Ej: Bebidas y refrescos"
          />

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingCategory(null);
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
              {editingCategory ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};