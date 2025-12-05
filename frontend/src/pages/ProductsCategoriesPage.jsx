import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout, Header } from '../components/Layout';
import { Card, Button, Input, Select, Badge, Modal, Tabs } from '../components/UI';
import { useAuth } from '../hooks/useAuth';
import { useApiData, useCrud, useForm } from '../hooks/useApi';
import { productsService, categoriesService } from '../services/api';
import { CategoriesSection } from './CategoriesSection';

export const ProductsCategoriesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  // Cargar datos
  const { data: products, loading, refetch } = useApiData(productsService.getAll, []);
  const { data: categories } = useApiData(categoriesService.getAll, []);
  
  // Hooks para operaciones CRUD
  const { loading: saving, error, create, update, remove } = useCrud(productsService);
  
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
      description: '',
      price: '',
      stock: '',
      category: '',
      is_active: true
    },
    {
      code: (value) => !value ? 'El código es requerido' : null,
      description: (value) => !value ? 'La descripción es requerida' : null,
      price: (value) => !value || parseFloat(value) <= 0 ? 'El precio debe ser mayor a 0' : null,
      stock: (value) => !value || parseInt(value) < 0 ? 'El stock no puede ser negativo' : null,
      category: (value) => !value ? 'La categoría es requerida' : null
    }
  );

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter(product => {
      const matchesSearch = 
        product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.category?.code === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const productData = {
      code: formData.code,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      is_active: formData.is_active
    };

    try {
      let result;
      if (editingProduct) {
        result = await update(editingProduct.code, productData);
      } else {
        result = await create(productData);
      }

      if (result.success) {
        setShowModal(false);
        reset();
        setEditingProduct(null);
        refetch();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Editar producto
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category?.code || '',
      is_active: product.is_active
    });
    setShowModal(true);
  };

  // Eliminar producto
  const handleDelete = async (productCode) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const result = await remove(productCode);
      if (result.success) {
        refetch();
      }
    }
  };

  // Nuevo producto
  const handleNewProduct = () => {
    setEditingProduct(null);
    reset();
    setShowModal(true);
  };

  // Opciones para el select de categorías
  const categoryOptions = categories?.map(cat => ({
    value: cat.code,
    label: cat.description
  })) || [];

  // Manejar selección de categoría desde la sección de categorías
  const handleCategorySelect = (categoryCode) => {
    setSelectedCategory(categoryCode);
    setActiveTab('products');
  };

  return (
    <DashboardLayout
      header={<Header user={user} onLogout={logout} />}
      activeItem="products"
    >
      {/* Header de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona el inventario de productos y sus categorías
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleNewProduct} variant="primary">
            + Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Tabs para alternar entre productos y categorías */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Productos ({filteredProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categorías ({categories?.length || 0})
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido de las tabs */}
      {activeTab === 'products' ? (
        <>
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
                <Select
                  placeholder="Todas las categorías"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={categoryOptions}
                  className="w-48"
                />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Todos</option>
                      <option value="active">Activos</option>
                      <option value="inactive">Inactivos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rango de precio
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Todos</option>
                      <option value="0-100">0 - 100</option>
                      <option value="100-500">100 - 500</option>
                      <option value="500-1000">500 - 1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Todos</option>
                      <option value="low">Stock bajo</option>
                      <option value="medium">Stock medio</option>
                      <option value="high">Stock alto</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Lista de productos */}
          <Card>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron productos</p>
                <Button onClick={handleNewProduct} variant="primary" className="mt-4">
                  Crear primer producto
                </Button>
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
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
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
                    {filteredProducts.map((product) => (
                      <tr key={product.code} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {product.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="primary">
                            {product.category?.description || 'Sin categoría'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${product.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${
                              product.stock < 10 ? 'text-red-600' : 
                              product.stock < 50 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {product.stock}
                            </span>
                            {product.stock < 10 && (
                              <span className="ml-2 text-xs text-red-500">⚠️ Bajo</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={product.is_active ? 'success' : 'danger'}>
                            {product.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(product.code)}
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
        </>
      ) : (
        <CategoriesSection onCategorySelect={handleCategorySelect} />
      )}

      {/* Modal para crear/editar producto */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
          reset();
        }}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
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
              label="Código"
              name="code"
              value={formData.code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.code}
              disabled={!!editingProduct}
              required
            />

            <Input
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Precio"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.price}
              required
            />

            <Input
              label="Stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.stock}
              required
            />
          </div>

          <Select
            label="Categoría"
            name="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            options={categoryOptions}
            error={errors.category}
            required
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Producto activo
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingProduct(null);
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
              {editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};