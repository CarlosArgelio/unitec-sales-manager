import React from 'react';

const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>}
    <input 
      className={`bg-slate-900/50 border ${error ? 'border-red-500/50' : 'border-slate-700'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600`}
      {...props}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);

export default Input;