// src/types/types.ts

export type TipoProyecto = 'Básico' | 'Intermedio' | 'Mayor';

export type EstadoProyecto =
  | 'En Desarrollo' 
  | 'Enviado a SEIM' 
  | 'En Evaluación SEREMITT' 
  | 'En Corrección' 
  | 'Aprobado' 
  | 'Rechazado';

export type TipoAlerta = 'critico' | 'advertencia' | 'info';

export interface Fase {
  nombre: string;
  completada: boolean;
  fechaInicio: string | null;
  fechaFin: string | null;
}

export interface ObservacionesSEREMITT {
  ciclo: number;                        // Número de ciclo de corrección (1, 2, 3...)
  etapaActual: string;                  // Descripción de la etapa actual del proceso
  plazoMaximo: number;                  // Días máximos según tabla de plazos
  fechaVencimiento: string;             // Fecha límite para esta etapa
  fechaEnvio?: string;                  // Cuando se envió por primera vez
  fechaRecepcionObservaciones?: string; // Cuando se recibieron observaciones
  fechaReenvio?: string;                // Cuando se reenvió corregido
  observaciones?: string;               // Texto de observaciones recibidas
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
    avance: number;
    fases: Fase[];
    observacionesSEREMITT: ObservacionesSEREMITT | null;
    profesionalAsignado: string | null;
    cicloSEREMITT?: number | null;        // Para tracking del ciclo actual
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