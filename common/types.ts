// src/types/types.ts

// --- TIPOS BASADOS EN ENUMs DE LA BBDD ---
export type EstadoProyecto = 
  | 'Iniciado' 
  | 'En Desarrollo' 
  | 'Subido a SEIM' 
  | 'En Corrección' 
  | 'En Evaluación SEREMITT' 
  | 'Aprobado' 
  | 'Rechazado';

export type TipoProyecto = 'Básico' | 'Intermedio' | 'Mayor';

export type TipoAlerta = 'retraso_critico' | 'vencimiento_proximo' | 'seremitt_urgente';

export type SeveridadAlerta = 'critico' | 'advertencia' | 'exito' | 'informativa';


// --- INTERFACES DE LAS TABLAS DE LA BBDD ---
export interface Proyecto {
  id: number;
  codigo: string;
  nombre: string;
  tipo: TipoProyecto;
  cliente: string;
  ubicacion: string;
  estado: EstadoProyecto;
  fecha_registro: string;      // Corresponde a fecha_registro
  fecha_compromiso: string;    // Corresponde a fecha_compromiso
  estimacion_inicial_dias: number;
  estimacion_ajustada_dias?: number | null;
  justificacion_ajuste?: string | null;
  avance: number;
  profesional_lider_id?: number | null;
}

export interface Fase {
  id: number;
  proyecto_id: number;
  nombre: string;
  orden: number;
  fase_completada: boolean;
  fecha_inicio_real?: string | null;
  fecha_fin_real?: string | null;
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
  disponibilidad: number; // Renombrado de 'factor_disponibilidad' para ser más general
}

export interface Asignacion {
  id: number;
  proyecto_id: number;
  profesional_id: number;
  rol_en_proyecto?: string;
}

// --- TIPOS PARA FORMULARIOS Y PROPS ---

// Datos para crear un nuevo proyecto (lo que envía el formulario)
export interface NuevoProyectoData {
  nombre: string;
  cliente: string;
  tipo: TipoProyecto;
  ubicacion: string;
  fecha_compromiso: string;
}

// Filtros del dashboard
export interface Filtros {
  tipo: TipoProyecto | 'todos';
  profesional: number | 'todos'; // Ahora filtramos por ID del profesional
}

// Errores del formulario
export type ErroresFormulario = {
  [key in keyof NuevoProyectoData]?: string;
};


// --- PROPS PARA COMPONENTES ---

export interface DashKanbanProps {
  proyectos: Proyecto[];
  onProyectoClick: (proyecto: Proyecto) => void;
  onCambiarEstado: (proyectoId: number, nuevoEstado: EstadoProyecto) => void; // Cambiado a number
  calcularDiasRestantes: (fecha: string) => number;
  obtenerColorEstado: (proyecto: Proyecto) => string;
}

export interface DetalleProyectoProps {
  proyecto: Proyecto;
  onCerrar: () => void;
  // Esta función ahora es más específica para reflejar la nueva arquitectura
  onActualizarFase: (faseId: number, completada: boolean) => void; 
  calcularDiasRestantes: (fecha: string) => number;
}

export interface FormProyectoProps {
  onCerrar: () => void;
  onGuardar: (data: NuevoProyectoData) => void;
  proyectosActivos: number;
  // Esta función ya no es necesaria aquí, el backend la calculará
  // calcularEstimacion: (tipo: TipoProyecto, carga: number) => number;
}

export interface TarjetaProyectoProps {
  proyecto: Proyecto;
  onClick: () => void;
  onDragStart: () => void;
  calcularDiasRestantes: (fecha: string) => number;
  obtenerColorEstado: (proyecto: Proyecto) => string;
}