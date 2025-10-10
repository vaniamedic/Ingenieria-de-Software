// src/services/api.ts
import axios from 'axios';
import { 
    Proyecto, 
    Profesional, 
    NuevoProyectoData, 
    EstadoProyecto,
    Fase
} from '../../../common/types';

// Se crea una instancia de Axios. La URL base debería estar en un archivo .env
const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api', // Cambiar por la URL de vuestro backend
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Manejo de errores centralizado para las llamadas de API.
 * Extrae el mensaje de error de la respuesta de Axios.
 */
const handleError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        // El backend respondió con un error (ej: 404, 500)
        const message = error.response?.data?.message || error.message;
        console.error('Error de API:', message);
        throw new Error(message);
    } else {
        // Un error inesperado (ej: de red)
        console.error('Error inesperado:', error);
        throw new Error('Ha ocurrido un error inesperado.');
    }
};

// --- SERVICIOS PARA PROYECTOS ---

export const getProyectos = async (): Promise<Proyecto[]> => {
    try {
        const response = await apiClient.get<Proyecto[]>('/proyectos');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const createProyecto = async (data: NuevoProyectoData): Promise<Proyecto> => {
    try {
        const response = await apiClient.post<Proyecto>('/proyectos', data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const updateProyectoEstado = async (id: number, estado: EstadoProyecto): Promise<Proyecto> => {
    try {
        // Usamos PUT o PATCH según la semántica de vuestro backend
        const response = await apiClient.put<Proyecto>(`/proyectos/${id}/estado`, { estado });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// --- SERVICIOS PARA PROFESIONALES ---

export const getProfesionales = async (): Promise<Profesional[]> => {
    try {
        const response = await apiClient.get<Profesional[]>('/profesionales');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// --- SERVICIOS PARA FASES (Ejemplo para el DetalleProyecto) ---

export const getFasesPorProyecto = async (proyectoId: number): Promise<Fase[]> => {
    try {
        const response = await apiClient.get<Fase[]>(`/proyectos/${proyectoId}/fases`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const updateFase = async (faseId: number, data: { fase_completada: boolean }): Promise<Fase> => {
    try {
        const response = await apiClient.patch<Fase>(`/fases/${faseId}`, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};