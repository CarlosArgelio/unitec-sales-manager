import React, { useMemo } from 'react';
import { Package, AlertTriangle, X, TrendingUp, Bell } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = ({ inventory }) => {
  const stats = useMemo(() => {
    const totalItems = inventory.length;
    const lowStock = inventory.filter(i => i.quantity <= i.minStock).length;
    const totalValue = inventory.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);
    const criticalItems = inventory.filter(i => i.quantity === 0).length;
    return { totalItems, lowStock, totalValue, criticalItems };
  }, [inventory]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Panel General</h2>
          <p className="text-slate-400">Visión global del estado del restaurante</p>
        </div>
        <div className="flex gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1.5"></span>
          Sistema Backend Conectado
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 hover:border-blue-500/50 transition-colors">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-medium">Total Items</p>
            <h3 className="text-2xl font-bold text-white">{stats.totalItems}</h3>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4 hover:border-amber-500/50 transition-colors">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-medium">Stock Bajo</p>
            <h3 className="text-2xl font-bold text-white">{stats.lowStock}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 hover:border-red-500/50 transition-colors">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
            <X className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-medium">Agotados</p>
            <h3 className="text-2xl font-bold text-white">{stats.criticalItems}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 hover:border-emerald-500/50 transition-colors">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-medium">Valor Inventario</p>
            <h3 className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString()}</h3>
          </div>
        </Card>
      </div>

      {/* Alertas Inteligentes */}
      <Card className="border-l-4 border-l-amber-500">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-500" />
          Alertas de Reabastecimiento
        </h3>
        <div className="space-y-3">
          {inventory.filter(i => i.quantity <= i.minStock).map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500"></div>
                 <div>
                    <p className="text-slate-200 font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">Stock actual: <span className="text-red-400 font-bold">{item.quantity} {item.unit}</span> (Mín: {item.minStock})</p>
                 </div>
              </div>
              <Button variant="secondary" className="text-xs py-1 h-8">Solicitar Compra</Button>
            </div>
          ))}
          {inventory.filter(i => i.quantity <= i.minStock).length === 0 && (
            <p className="text-slate-500 italic">Todo el inventario está en niveles óptimos.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;