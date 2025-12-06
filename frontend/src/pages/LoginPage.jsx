import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input, Button, Card } from '../components/UI';
import { AuthLayout } from '../components/Layout';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirigir a la página que intentaba acceder o al dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sales Manager
        </h1>
        <p className="text-gray-600 mb-8">
          Inicia sesión en tu cuenta
        </p>
      </div>

      <Card className="shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Input
            label="Usuario"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ingresa tu nombre de usuario"
            autoComplete="username"
            required
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>
      </Card>

      {/* <div className="text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Regístrate aquí
          </button>
        </p>
        
        <p className="text-sm text-gray-600 mt-2">
          <button
            onClick={() => navigate('/forgot-password')}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </p>
      </div> */}
    </AuthLayout>
  );
};