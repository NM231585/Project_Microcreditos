const API_URL = 'http://localhost:5000/api';

// Helper para manejar respuestas
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }
  
  return data;
};

// Helper para obtener headers con token
const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Servicio de Autenticación
export const authService = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getMe: async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};

// Servicio de Solicitudes
export const solicitudesService = {
  getAll: async (token, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/solicitudes${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  getById: async (token, id) => {
    const response = await fetch(`${API_URL}/solicitudes/${id}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  create: async (token, solicitudData) => {
    const response = await fetch(`${API_URL}/solicitudes`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(solicitudData),
    });
    return handleResponse(response);
  },

  update: async (token, id, solicitudData) => {
    const response = await fetch(`${API_URL}/solicitudes/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(solicitudData),
    });
    return handleResponse(response);
  },

  aprobar: async (token, id) => {
    const response = await fetch(`${API_URL}/solicitudes/${id}/aprobar`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};

// Servicio de Cronogramas
export const cronogramasService = {
  getById: async (token, id) => {
    const response = await fetch(`${API_URL}/cronogramas/${id}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  getBySolicitud: async (token, solicitudId) => {
    const response = await fetch(`${API_URL}/cronogramas/solicitud/${solicitudId}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  marcarCuotaPagada: async (token, cronogramaId, cuotaId) => {
    const response = await fetch(
      `${API_URL}/cronogramas/${cronogramaId}/cuotas/${cuotaId}/pagar`,
      {
        method: 'PATCH',
        headers: getHeaders(token),
      }
    );
    return handleResponse(response);
  },
};

// Servicio de Upload
export const uploadService = {
  uploadFiles: async (files, token) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return handleResponse(response);
  }
};

export default {
  auth: authService,
  solicitudes: solicitudesService,
  cronogramas: cronogramasService,
  upload: uploadService,
};
