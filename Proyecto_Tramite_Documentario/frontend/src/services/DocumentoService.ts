import api from './api';
import type { Documento, DocumentoRequest, PageResponse } from '../types';

export const getDocumentos = async (page = 0, size = 10) => {
  const response = await api.get<PageResponse<Documento>>(`/documentos?page=${page}&size=${size}`);
  return response.data;
};

export const crearDocumento = async (documento: DocumentoRequest) => {
  const response = await api.post<Documento>('/documentos', documento);
  return response.data;
};
