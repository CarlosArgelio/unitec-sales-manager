import { useState, useEffect, useCallback } from 'react';

// Hook genérico para manejo de datos de API
export const useApiData = (apiFunction, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction();
    //   console.log('🔍 API Response structure:', response);

      // Manejar diferentes estructuras de respuesta
      let responseData = response.data;

      // Si es un array, usarlo directamente
      if (Array.isArray(responseData)) {
        setData(responseData);
      }
      // Si es un objeto con 'results' (paginado de DRF)
      else if (responseData && typeof responseData === 'object' && responseData.results) {
        setData(responseData.results);
      }
      // Si es null/undefined, usar array vacío
      else if (!responseData) {
        setData([]);
      }
      // En otros casos, intentar usar como array o devolver como está
      else {
        console.warn('⚠️ Unhandled API response structure:', responseData);
        setData(Array.isArray(responseData) ? responseData : [responseData]);
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err.response?.data?.message || 'Error al cargar datos');
      setData([]); // Asegurar que sea array en caso de error
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook para manejo de un solo elemento
export const useApiItem = (apiFunction, id, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(id);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el elemento');
    } finally {
      setLoading(false);
    }
  }, [id, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook para operaciones CRUD
export const useCrud = (apiFunctions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunctions.create(data);
      return { success: true, data: response.data };
    } catch (err) {
      console.log(err)
      const errorMessage = err.response?.data?.message || 'Error al crear el elemento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunctions.update(id, data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el elemento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await apiFunctions.delete(id);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el elemento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    create,
    update,
    remove,
  };
};

// Hook para formulario con validación
export const useForm = (initialData = {}, validation = {}) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (name, value) => {
  if (name && name.target && typeof name === 'object') {
    const event = name;
    const fieldName = event.target.name;
    const fieldValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    setData(prev => ({ ...prev, [fieldName]: fieldValue }));

    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  }
  else {
    setData(prev => ({ ...prev, [name]: value }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }
};

const handleBlur = (name) => {
  // Si el primer parámetro es un evento de React
  if (name && name.target && typeof name === 'object') {
    const event = name;
    const fieldName = event.target.name;

    setTouched(prev => ({ ...prev, [fieldName]: true }));

    // Validar campo específico
    if (validation[fieldName]) {
      const error = validation[fieldName](data[fieldName]);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }
  // Si se pasa el nombre como parámetro
  else {
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validar campo específico
    if (validation[name]) {
      const error = validation[name](data[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }
};

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validation).forEach(field => {
      const error = validation[field](data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const reset = () => {
    setData(initialData);
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (name, value) => {
    handleChange(name, value);
  };

  const setFieldError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFieldValue,
    setFieldError,
    setData,
  };
};
