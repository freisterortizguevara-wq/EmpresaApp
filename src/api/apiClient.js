import axios from 'axios';

// ============================================
// 🔑 DETECCIÓN AUTOMÁTICA: LOCAL O PRODUCCIÓN
// ============================================
// Si estamos en localhost (desarrollo) → usa localhost
// Si estamos en freister.runasp.net (producción) → usa MonsterASP con HTTP
// ============================================

const getApiUrl = () => {
    // Si estamos en desarrollo (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'https://localhost:7025/api';  // URL de desarrollo local
    }
    
    // Si estamos en producción (MonsterASP) → USAR HTTP (NO HTTPS)
    return 'http://freister.runasp.net/api';  // URL de producción con HTTP
};

const API_BASE_URL = getApiUrl();

console.log('🔵 API URL:', API_BASE_URL);  // Esto te ayuda a saber cuál está usando

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('❌ Error en la API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;