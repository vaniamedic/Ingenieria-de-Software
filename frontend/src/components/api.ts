//v, aqui conectar a backend

//import axios from "axios";

//const api = axios.create({
//  baseURL: "http://localhost:8000/api", // "http://localhost:8000" estas es la q dice. el vid
//});

//exportar la api
//export default api;

//me quede en 23:09 del video

import axios from 'axios';
import { Proyecto, NuevoProyectoData } from '../types/types';

const API_URL = "http://127.0.0.1:8000"; // o la IP donde corra FastAPI "http://localhost:8000/api"

export const obtenerProyectos = async (): Promise<Proyecto[]> => {
  const response = await axios.get(`${API_URL}/proyectos`);
  return response.data;
};

export const crearProyecto = async (nuevoProyecto: NuevoProyectoData): Promise<Proyecto> => {
  const response = await axios.post(`${API_URL}/proyectos`, nuevoProyecto);
  return response.data;
};