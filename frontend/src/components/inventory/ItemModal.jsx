import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ItemModal = ({ item, onClose, onSave }) => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    name: '', 
    category: '', 
    quantity: '', 
    unit: '', 
    minStock: '', 
    price: ''
  });

  // Si recibimos un prop "item" (modo edición), llenamos el formulario con sus datos
  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir strings a números y formatear antes de enviar al padre (o al backend)
    onSave({
      ...formData,
      quantity: Number(formData.quantity),
      minStock: Number(formData.minStock),
      price: Number(formData.price),
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg bg-slate-900 border-slate-700 shadow-2xl">
        {/* Header del Modal */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-white">
            {item ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input 
                label="Nombre del Producto" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Ej. Trufa Negra"
              />
            </div>
            
            <Input 
              label="Categoría" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              placeholder="Ej. Lácteos" 
              required 
            />
            
            <Input 
              label="Unidad" 
              name="unit" 
              value={formData.unit} 
              onChange={handleChange} 
              placeholder="kg, L, uni" 
              required 
            />
            
            <Input 
              label="Cantidad Actual" 
              type="number" 
              step="0.01"
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
              required 
            />
            
            <Input 
              label="Stock Mínimo" 
              type="number" 
              step="0.01"
              name="minStock" 
              value={formData.minStock} 
              onChange={handleChange} 
              required 
            />
            
            <Input 
              label="Costo Unitario ($)" 
              type="number" 
              step="0.01"
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          {/* Footer con Botones */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {item ? 'Actualizar Cambios' : 'Guardar Item'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ItemModal;