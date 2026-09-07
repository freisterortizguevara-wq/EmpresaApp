import axios from 'axios';

// URL de la API en MonsterASP con HTTPS
const API_BASE_URL = 'https://freister.runasp.net/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('❌ Error en la API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;