// src/types/types.ts

export type TipoProyecto = 'Básico' | 'Intermedio' | 'Mayor';

export type EstadoProyecto = 
  | 'Iniciado' 
  | 'En Desarrollo' 
  | 'Enviado' 
  | 'En Corrección' 
  | 'Finalizado';

export type TipoAlerta = 'critico' | 'advertencia' | 'info' | 'success';

export interface Fase {
  nombre: string;
  completada: boolean;
  fechaInicio: string | null;
  fechaFin: string | null;
}

export interface ObservacionesSEREMITT {
  plazoMaximo: number;
  fechaVencimiento: string;
  observaciones?: string;
}

export interface Proyecto {
  codigo: string;
  nombre: string;
  cliente: string;
  tipo: TipoProyecto;
  ubicacion: string;
  fechaCompromiso: string;
  fechaRegistro: string;
  estado: EstadoProyecto;
  estimacionDias: number;
  estimacionAjustada: number;
  justificacionAjuste?: string;
  avance: number;
  fases: Fase[];
  observacionesSEREMITT: ObservacionesSEREMITT | null;
  profesionalAsignado: string | null;
}

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  proyecto: string;
  mensaje: string;
  revisada: boolean;
  fecha?: string;
}

export interface Filtros {
  tipo: TipoProyecto | 'todos';
  profesional: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface NuevoProyectoData {
  nombre: string;
  cliente: string;
  tipo: TipoProyecto;
  ubicacion: string;
  fechaCompromiso: string;
}

export interface ErroresFormulario {
  nombre?: string;
  cliente?: string;
  tipo?: string;
  ubicacion?: string;
  fechaCompromiso?: string;
}

// Props de componentes
export interface DashKanbanProps {
  proyectos: Proyecto[];
  onProyectoClick: (proyecto: Proyecto) => void;
  onCambiarEstado: (codigoProyecto: string, nuevoEstado: EstadoProyecto) => void;
  calcularDiasRestantes: (fechaCompromiso: string) => number;
  obtenerColorEstado: (proyecto: Proyecto) => string;
}

export interface TarjetaProyectoProps {
  proyecto: Proyecto;
  onClick: () => void;
  onDragStart: () => void;
  calcularDiasRestantes: (fechaCompromiso: string) => number;
  obtenerColorEstado: (proyecto: Proyecto) => string;
}

export interface FormProyectoProps {
  onCerrar: () => void;
  onGuardar: (proyecto: NuevoProyectoData) => void;
  proyectosActivos: number;
  calcularEstimacion: (tipo: TipoProyecto, proyectosActivos: number) => number;
}

export interface DetalleProyectoProps {
  proyecto: Proyecto;
  onCerrar: () => void;
  onActualizarAvance: (fases: Fase[]) => void;
  calcularDiasRestantes: (fechaCompromiso: string) => number;
}