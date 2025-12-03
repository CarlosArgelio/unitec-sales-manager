import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/api';

// Context para autenticación
const AuthContext = createContext();

// Hook personalizado para autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
    //   console.log('🔍 Respuesta del login:', response);
      
      // Extraer token y user de la respuesta
      const token = response.token;
      const user = response.user;
      
      if (!token || !user) {
        console.error('❌ Respuesta incompleta:', response);
        return { success: false, error: 'Respuesta del servidor incompleta' };
      }
      
      // Guardar token y datos del usuario
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
      
    //   console.log('✅ Login exitoso:', { token: token.substring(0, 10) + '...', user: user.username });
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.detail || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};