import React, { useState } from 'react';
import { Button, Input, Badge, Modal } from '../components/UI';
import { useApiData, useCrud, useForm } from '../hooks/useApi';
import { categoriesService } from '../services/api';

export const CategoriesSection = ({ onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

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
      code: (value) => {
        if (!value) return 'El código es requerido';
        if (editingCategory && !value.trim()) return 'El código es requerido';
        return null;
      },
      description: (value) => !value ? 'La descripción es requerida' : null
    }
  );

  // Filtrar categorías
  const filteredCategories = categories?.filter(category =>
    category.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const categoryData = {
      code: formData.code.trim(),
      description: formData.description.trim()
    };

    try {
      let result;
      if (editingCategory) {
        result = await update(editingCategory.code, categoryData);
      } else {
        result = await create(categoryData);
      }

      if (result.success) {
        setShowAddModal(false);
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
    setShowAddModal(true);
  };

  // Eliminar categoría
  const handleDelete = async (categoryCode) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
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
    setShowAddModal(true);
    setFormData({
      code: '',
      description: ''
    });
  };

  // Seleccionar categoría
  const handleCategorySelectInternal = (categoryCode) => {
    if (onCategorySelect) {
      onCategorySelect(categoryCode);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Gestionar Categorías</h3>
          <Button onClick={handleNewCategory} variant="outline" size="sm">
            + Agregar Categoría
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="px-6 py-4 border-b border-gray-200">
        <Input
          placeholder="Buscar categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Lista de categorías */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron categorías</p>
            <Button onClick={handleNewCategory} variant="primary" className="mt-4">
              Crear primera categoría
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <div
                key={category.code}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="primary" className="text-xs">
                    {category.code}
                  </Badge>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(category.code)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-900 mb-3">
                  {category.description}
                </div>
                <button
                  onClick={() => handleCategorySelectInternal(category.code)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Seleccionar para productos →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para crear/editar categoría */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
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
            disabled={false}
            required
            placeholder="Ej: 123456"
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

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
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
    </div>
  );
};