// src/types/types.ts

export type TipoProyecto = 'Básico' | 'Intermedio' | 'Mayor';
export type TipoAlerta = 'retraso_critico' | 'vencimiento_proximo' | 'seremitt_urgente';
export type SeveridadAlerta = 'critico' | 'advertencia' | 'exito' | 'informativa';

export type EstadoProyecto = 
  | 'Iniciado' 
  | 'En Desarrollo' 
  | 'Enviado a SEIM'
  | 'En Corrección' 
  | 'En Evaluación SEREMITT'
  | 'Aprobado'
  | 'Rechazado';

export interface Fase {
  id: number;
  proyecto_id: number;
  nombre: string;
  orden: number;
  fase_completada: boolean;
  fecha_inicio_real?: string | null; // 'YYYY-MM-DD' format
  fecha_fin_real?: string | null; // 'YYYY-MM-DD' format
}

export interface ObservacionSeremitt {
  id: number;
  proyecto_id: number;
  ciclo: number;
  etapa_actual?: string;
  fecha_recepcion_observaciones: string;
  plazo_maximo_dias: number;
  fecha_vencimiento: string;
  fecha_reenvio?: string | null;
}

export interface Proyecto {
  id: number;
  codigo: string;
  nombre: string;
  tipo: TipoProyecto;
  cliente: string;
  ubicacion: string;
  estado: EstadoProyecto;
  fecha_registro: string; // ISO 8601 string format
  fecha_compromiso: string; // 'YYYY-MM-DD' format
  estimacion_inicial_dias: number;
  estimacion_ajustada_dias?: number | null;
  justificacion_ajuste?: string | null;
  avance: number;
  profesional_lider_id?: number | null;
}

export interface Alerta {
  id: number;
  proyecto_id: number;
  tipo_alerta: TipoAlerta;
  severidad: SeveridadAlerta;
  mensaje: string;
  revisada: boolean;
  fecha_creacion: string;
}

export interface Profesional {
  id: number;
  nombre_completo: string;
  email: string;
  rol?: string;
  factor_disponibilidad: number;
  fecha_creacion: string; // ISO 8601 string format
}

export interface Asignacion {
  id: number;
  proyecto_id: number;
  profesional_id: number;
  rol_en_proyecto?: string;
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

