import api from './api';
import type { Derivacion } from '../types';

export const getDerivacionesByDocumento = async (idDocumento: number) => {
  const response = await api.get<Derivacion[]>(`/derivaciones/documento/${idDocumento}`);
  return response.data;
};

export const crearDerivacion = async (derivacion: { idDocumento: number; emisorId: number; receptorId: number; instrucciones?: string }) => {
  const response = await api.post<Derivacion>('/derivaciones', derivacion);
  return response.data;
};
