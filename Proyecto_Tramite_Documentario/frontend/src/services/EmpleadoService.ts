import api from './api';
import type { Empleado } from '../types';

export const getEmpleados = async () => {
  const response = await api.get<Empleado[]>('/empleados');
  return response.data;
};

export const crearEmpleado = async (empleado: { nombre: string; apellidos: string; email: string; idArea?: number; idCargo: number }) => {
  const response = await api.post<Empleado>('/empleados', empleado);
  return response.data;
};
