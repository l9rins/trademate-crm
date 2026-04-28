import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;
        
        if (!response && config && !config._retry && config.method === 'get') {
            config._retry = true;
            return api(config);
        }

        if (response?.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            // toast is already used in other files via sonner, we can use it here if we import it, 
            // but api.js is a lib file. I'll import toast.
            const { toast } = await import('sonner');
            toast.error("Session expired", { description: "Please sign in again." });
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        }
        return Promise.reject(error);
    }
);

export default api;
