import React from 'react';

export const Tabs = ({ 
  children, 
  defaultValue, 
  value, 
  onValueChange, 
  className = '',
  orientation = 'horizontal' 
}) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div className={`w-full ${className}`} data-orientation={orientation}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type.displayName === 'TabsList') {
          return React.cloneElement(child, { 
            activeTab, 
            onTabChange: handleTabChange,
            orientation 
          });
        }
        return null;
      })}
      
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type.displayName === 'TabsContent') {
          return React.cloneElement(child, { 
            activeTab, 
            orientation 
          });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList = ({ 
  children, 
  activeTab, 
  onTabChange, 
  className = '',
  orientation = 'horizontal' 
}) => {
  const baseClasses = orientation === 'vertical' 
    ? 'flex flex-col space-y-1' 
    : 'flex space-x-1';
    
  const borderClasses = orientation === 'vertical'
    ? 'border-r border-gray-200 pr-0'
    : 'border-b border-gray-200 pb-0';

  return (
    <div className={`${baseClasses} ${borderClasses} ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type.displayName === 'TabsTrigger') {
          return React.cloneElement(child, { 
            activeTab, 
            onTabChange,
            orientation 
          });
        }
        return child;
      })}
    </div>
  );
};

export const TabsTrigger = ({ 
  children, 
  value, 
  activeTab, 
  onTabChange, 
  className = '',
  disabled = false,
  orientation = 'horizontal' 
}) => {
  const isActive = activeTab === value;
  
  const baseClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer hover:text-blue-600 hover:bg-blue-50';

  const activeClasses = isActive
    ? 'text-blue-600 bg-blue-50 border-blue-500'
    : 'text-gray-600 border-transparent';

  const orientationClasses = orientation === 'vertical'
    ? 'justify-start px-4 py-2 border-r-2'
    : 'justify-center px-4 py-2 border-b-2';

  const fullClasses = `
    flex items-center text-sm font-medium transition-colors duration-200
    ${orientationClasses}
    ${activeClasses}
    ${baseClasses}
    ${className}
  `;

  return (
    <button
      type="button"
      onClick={() => !disabled && onTabChange?.(value)}
      disabled={disabled}
      className={fullClasses}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ 
  children, 
  value, 
  activeTab, 
  className = '',
  orientation = 'horizontal' 
}) => {
  if (activeTab !== value) {
    return null;
  }

  const orientationClasses = orientation === 'vertical'
    ? 'ml-6'
    : 'mt-6';

  return (
    <div className={`${orientationClasses} ${className}`}>
      {children}
    </div>
  );
};

// Configurar display names para identificación
Tabs.displayName = 'Tabs';
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

// Hook para usar las tabs más fácilmente
export const useTabs = (initialValue = '') => {
  const [activeTab, setActiveTab] = React.useState(initialValue);
  
  const setTab = React.useCallback((value) => {
    setActiveTab(value);
  }, []);
  
  return { activeTab, setTab };
};