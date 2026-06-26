import api from './api';
import type { TipoRespuesta, Respuesta } from '../types';

export const getTiposRespuesta = async () => {
  const response = await api.get<TipoRespuesta[]>('/tipos-respuesta');
  return response.data;
};

export const crearRespuesta = async (respuesta: { idDocumento: number; idTipoRespuesta: number; idEmpleadoAutor: number; descripcion: string }) => {
  const response = await api.post<Respuesta>('/respuestas', respuesta);
  return response.data;
};
