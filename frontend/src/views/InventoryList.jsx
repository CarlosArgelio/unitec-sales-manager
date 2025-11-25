import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const InventoryList = ({ inventory, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  
  // Verificamos si es admin para mostrar botones de acción (Editar/Eliminar)
  const isAdmin = user?.role === 'admin';

  // Lógica de filtrado en tiempo real (por nombre o categoría)
  const filtered = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header con Título y Buscador */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Inventario Activo</h2>
          <p className="text-slate-400">Gestión de ingredientes y suministros</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
             <input 
               type="text" 
               placeholder="Buscar ingrediente..." 
               className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-64"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
           </div>
           {/* Solo el admin puede ver el botón de Crear Nuevo */}
           {isAdmin && (
             <Button onClick={() => onEdit(null)}>
               <Plus className="w-4 h-4" /> Nuevo
             </Button>
           )}
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="overflow-x-auto rounded-2xl border border-slate-700/50 shadow-2xl">
        <table className="w-full text-left bg-slate-800/40 backdrop-blur-md">
          <thead>
            <tr className="border-b border-slate-700/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Ingrediente</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Cantidad</th>
              <th className="px-6 py-4 text-right">Valor Unit.</th>
              {isAdmin && <th className="px-6 py-4 text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {filtered.map((item) => {
              // Determinar estado para el Badge visual
              const status = item.quantity === 0 ? 'critical' : item.quantity <= item.minStock ? 'low' : 'good';
              
              return (
                <tr key={item.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-slate-200 font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500">Act: {item.lastUpdated}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md text-xs">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={status} />
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-300">
                    {item.quantity} <span className="text-slate-500 text-xs">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-300">
                    ${item.price}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => onEdit(item)} 
                          className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(item.id)} 
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No se encontraron ingredientes con ese nombre.
        </div>
      )}
    </div>
  );
};

export default InventoryList;