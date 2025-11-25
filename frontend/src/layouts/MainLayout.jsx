import React, { useState } from 'react';
import { LayoutDashboard, Package, Users, Settings, LogOut, ChevronRight, ChefHat, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../views/Dashboard';
import InventoryList from '../views/InventoryList';
import ItemModal from '../components/inventory/ItemModal';
import { INITIAL_INVENTORY } from '../data/mockData';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Handlers CRUD
  const handleDelete = (id) => {
    if (confirm('¿Seguro que deseas eliminar este item?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (itemData) => {
    if (editingItem) {
      setInventory(prev => prev.map(i => i.id === editingItem.id ? { ...itemData, id: editingItem.id } : i));
    } else {
      setInventory(prev => [...prev, { ...itemData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        activeTab === id 
          ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
      {id === activeTab && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
             <div className="bg-gradient-to-tr from-blue-500 to-indigo-500 p-2 rounded-lg">
                <ChefHat className="w-6 h-6 text-white" />
             </div>
             GastroStock
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Menú Principal</p>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="inventory" icon={Package} label="Inventario" />
          
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-8">Administración</p>
          <NavItem id="users" icon={Users} label="Equipo" />
          <NavItem id="settings" icon={Settings} label="Configuración" />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                 {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-white truncate">{user.name}</p>
                 <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
           </div>
           <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 text-sm py-2 hover:bg-red-500/10 rounded-lg transition-colors">
             <LogOut className="w-4 h-4" /> Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 relative">
        {/* Header Decoration */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {activeTab === 'dashboard' && <Dashboard inventory={inventory} />}
          {activeTab === 'inventory' && (
            <InventoryList 
              inventory={inventory} 
              onDelete={handleDelete} 
              onEdit={handleEdit} 
            />
          )}
          {activeTab === 'users' && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
               <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
               <h3 className="text-lg font-medium text-slate-300">Gestión de Usuarios</h3>
               <p>Módulo disponible para Administradores.</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {isModalOpen && (
        <ItemModal 
          item={editingItem} 
          onClose={() => { setIsModalOpen(false); setEditingItem(null); }} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default MainLayout;