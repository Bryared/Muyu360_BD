import api from './api';
import type { Area, Cargo, Remitente, TipoDocumento } from '../types';

export const getAreas = async () => {
  const response = await api.get<Area[]>('/areas');
  return response.data;
};

export const getCargos = async () => {
  const response = await api.get<Cargo[]>('/cargos');
  return response.data;
};

export const getRemitentes = async () => {
  const response = await api.get<Remitente[]>('/remitentes');
  return response.data;
};

export const crearRemitente = async (remitente: Omit<Remitente, 'idRemitente'>) => {
  const response = await api.post<Remitente>('/remitentes', remitente);
  return response.data;
};

export const getTiposDocumento = async () => {
  const response = await api.get<TipoDocumento[]>('/tipos-documento');
  return response.data;
};

export const crearTipoDocumento = async (tipo: { nombre: string }) => {
  const response = await api.post<TipoDocumento>('/tipos-documento', tipo);
  return response.data;
};
