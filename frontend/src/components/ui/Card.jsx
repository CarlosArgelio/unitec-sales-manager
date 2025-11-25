import React from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl ${className}`}>
    {children}
  </div>
);

export default Card;