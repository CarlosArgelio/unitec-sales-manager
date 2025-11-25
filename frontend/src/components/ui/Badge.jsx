import React from 'react';

const Badge = ({ status }) => {
  let styles = "";
  let label = "";

  if (status === 'good') {
    styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    label = "Óptimo";
  } else if (status === 'low') {
    styles = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    label = "Bajo";
  } else {
    styles = "bg-red-500/10 text-red-400 border-red-500/20";
    label = "Crítico";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles}`}>
      {label}
    </span>
  );
};

export default Badge;