export interface Area {
  idArea: number;
  nombre: string;
  descripcion?: string;
}

export interface Cargo {
  idCargo: number;
  nombre: string;
}

export interface Empleado {
  idEmpleado: number;
  nombre: string;
  apellidos: string;
  email: string;
  area?: Area;
  cargo: Cargo;
}

export interface Remitente {
  idRemitente: number;
  nombreInstitucion: string;
  tipoEntidad: string;
  rucDni?: string;
  correoContacto?: string;
  telefono?: string;
}

export interface TipoDocumento {
  idTipoDocumento: number;
  nombre: string;
}

export interface EstadoDocumento {
  idEstadoDocumento: number;
  nombre: string;
}

export interface Derivacion {
  idDerivacion: number;
  idDocumento?: number;
  emisor: Empleado;
  receptor: Empleado;
  fechaDerivacion: string;
  instrucciones?: string;
}

export interface Documento {
  idDocumento: number;
  correlativo: string;
  idRemitente: number;
  nombreRemitente: string;
  idTipoDocumento: number;
  nombreTipoDocumento: string;
  idEstadoDocumento: number;
  nombreEstadoDocumento: string;
  fechaRecepcion: string;
  motivo: string;
  asunto?: string;
  requiereRespuesta: boolean;
  observaciones?: string;
  archivoUrl?: string;
  palabrasClave?: string[];
}

export interface DocumentoRequest {
  idRemitente: number;
  idTipoDocumento: number;
  motivo: string;
  asunto?: string;
  requiereRespuesta?: boolean;
  observaciones?: string;
  archivoUrl?: string;
  idsPalabrasClave?: number[];
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface TipoRespuesta {
  idTipoRespuesta: number;
  nombre: string;
}

export interface Respuesta {
  idRespuesta: number;
  idDocumento: number;
  tipoRespuesta: TipoRespuesta;
  autor: Empleado;
  fechaRespuesta: string;
  descripcion: string;
}
