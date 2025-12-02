import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación
// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    // console.log('📤 Interceptor request:', config);
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    // console.log('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/sign-in', credentials);
    // El backend devuelve directamente {token, user}, no response.data
    return response.data ? response.data : response;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

// Servicios de productos
export const productsService = {
  getAll: () => api.get('/products/'),
  getById: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
};

// Servicios de categorías
export const categoriesService = {
  getAll: () => api.get('/categories/'),
  getById: (id) => api.get(`/categories/${id}/`),
  create: (data) => api.post('/categories/', data),
  update: (id, data) => api.put(`/categories/${id}/`, data),
  delete: (id) => api.delete(`/categories/${id}/`),
};

// Servicios de clientes
export const clientsService = {
  getAll: () => api.get('/clients/'),
  getById: (id) => api.get(`/clients/${id}/`),
  create: (data) => api.post('/clients/', data),
  update: (id, data) => api.put(`/clients/${id}/`, data),
  delete: (id) => api.delete(`/clients/${id}/`),
};

// Servicios de órdenes
export const ordersService = {
  getHeaders: () => api.get('/orders/header/'),
  getHeaderById: (id) => api.get(`/orders/header/${id}/`),
  createHeader: (data) => api.post('/orders/header/', data),
  updateHeader: (id, data) => api.put(`/orders/header/${id}/`, data),
  deleteHeader: (id) => api.delete(`/orders/header/${id}/`),

  getRows: () => api.get('/orders/row/'),
  getRowById: (id) => api.get(`/orders/row/${id}/`),
  createRow: (data) => api.post('/orders/row/', data),
  updateRow: (id, data) => api.put(`/orders/row/${id}/`, data),
  deleteRow: (id) => api.delete(`/orders/row/${id}/`),
};

// Servicios de usuarios
export const usersService = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}/`),
  create: (data) => api.post('/users/', data),
  update: (id, data) => api.put(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
};

export default api;