// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Filter, AlertTriangle, Plus, Bell, RefreshCw } from 'lucide-react';
import DashKanban from '../components/DashKanban';
import FormProyecto from '../components/FormProyecto';
import DetalleProyecto from '../components/DetalleProyecto';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import styles from '../styles/global';
import { 
  Proyecto, 
  Alerta, 
  Filtros, 
  NuevoProyectoData, 
  TipoProyecto,
  EstadoProyecto,
  Fase 
} from '../types/types';

interface DashboardProps {
  onNavegar: (pagina: 'dashboard' | 'analytics') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavegar }) => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({ 
    tipo: 'todos', 
    profesional: 'todos' 
  });

  // Generar código único de proyecto
  const generarCodigoProyecto = (): string => {
    const año = new Date().getFullYear();
    const numero = (proyectos.length + 1).toString().padStart(4, '0');
    return `IMIV-${año}-${numero}`;
  };

  // Calcular estimación automática
  const calcularEstimacion = (tipo: TipoProyecto, proyectosActivos: number): number => {
    //Requerido por fase
    const fasesBase: Record<TipoProyecto, number> = {
      'Básico': 8,     
      'Intermedio': 13,
      'Mayor': 13
    };
    // ¿Cuántos días por fase? Editar luego
    const factorComplejidad: Record<TipoProyecto, number> = {
      'Básico': 3,
      'Intermedio': 5,
      'Mayor': 7
    };
    // Tiempo base = fases × complejidad
    const tiempoBase = fasesBase[tipo] * factorComplejidad[tipo];
    // Por cada proyecto activo adicional, +8% de tiempo
    const factorCarga = 1 + (proyectosActivos * 0.08);
    // Estimación final redondeada, supongo
    return Math.round(tiempoBase * factorCarga);
  };

  // Agregar nuevo proyecto
  const agregarProyecto = (nuevoProyecto: NuevoProyectoData): void => {
    const proyectosActivos = proyectos.filter(p => 
        p.estado !== 'Aprobado' && p.estado !== 'Rechazado'
    ).length;
    const estimacionDias = calcularEstimacion(nuevoProyecto.tipo, proyectosActivos);
    
    // Fases según tipo de IMIV (según leyes del gobierno)
    const fasesPorTipo: Record<TipoProyecto, string[]> = {
      'Básico': [
        'Ficha resumen y esquema',
        'Certificado informaciones previas',
        'Área de influencia',
        'Caracterización situación actual',
        'Medidas de mitigación propuestas',
        'Situación con proyecto mejorada',
        'Revisión y ajustes finales',
        'Preparación para envío SEIM'
      ],
      'Intermedio': [
        'Ficha resumen y esquema',
        'Certificado informaciones previas',
        'Definiciones iniciales del IMIV',
        'Estudios de base situación actual',
        'Situación base (proyección oferta/demanda)',
        'Situación con proyecto',
        'Cuantificación de impactos',
        'Desarrollo medidas de mitigación',
        'Situación con proyecto mejorada',
        'Modelación de transporte',
        'Conclusiones y anexo digital',
        'Revisión integral',
        'Preparación para envío SEIM'
      ],
      'Mayor': [
        'Ficha resumen y esquema',
        'Certificado informaciones previas',
        'Definiciones iniciales del IMIV',
        'Estudios de base situación actual',
        'Situación base (proyección oferta/demanda)',
        'Situación con proyecto',
        'Cuantificación de impactos',
        'Desarrollo medidas de mitigación',
        'Situación con proyecto mejorada',
        'Modelación de transporte completa',
        'Conclusiones y anexo digital',
        'Revisión integral',
        'Preparación para envío SEIM'
      ]
    };


    const proyecto: Proyecto = {
      ...nuevoProyecto,
      codigo: generarCodigoProyecto(),
      fechaRegistro: new Date().toISOString(),
      estado: 'En Desarrollo',
      estimacionDias,
      estimacionAjustada: estimacionDias,
      avance: 0,
      fases: fasesPorTipo[nuevoProyecto.tipo].map(nombre => ({
        nombre,
        completada: false,
        fechaInicio: null,
        fechaFin: null
      })),
      observacionesSEREMITT: null,
      profesionalAsignado: null,
      cicloSEREMITT: null // Para tracking del ciclo de correcciones
    };
    
    const nuevosProyectos = [...proyectos, proyecto];
    setProyectos(nuevosProyectos);
    verificarAlertas(nuevosProyectos);
  };

  // Calcular días restantes
  const calcularDiasRestantes = (fechaCompromiso: string): number => {
    const hoy = new Date();
    const fecha = new Date(fechaCompromiso);
    const diffTime = fecha.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Obtener color según estado
  const obtenerColorEstado = (proyecto: Proyecto): string => {
    const diasRestantes = calcularDiasRestantes(proyecto.fechaCompromiso);
    const avanceEsperado = ((proyecto.estimacionAjustada - diasRestantes) / proyecto.estimacionAjustada) * 100;
    const desviacion = proyecto.avance - avanceEsperado;
    
    if (desviacion >= 0) return styles.card.estados.verde;
    if (desviacion >= -15) return styles.card.estados.amarillo;
    return styles.card.estados.rojo;
  };

  // Verificar alertas
  const verificarAlertas = (listaProyectos: Proyecto[]): void => {
    const nuevasAlertas: Alerta[] = [];
    
    listaProyectos.forEach(proyecto => {
        if (proyecto.estado === 'Aprobado' || proyecto.estado === 'Rechazado') return;
      
        // Alerta por retraso en desarrollo
        if (proyecto.estado === 'En Desarrollo') {
            const diasRestantes = calcularDiasRestantes(proyecto.fechaCompromiso);
            const avanceEsperado = ((proyecto.estimacionAjustada - diasRestantes) / proyecto.estimacionAjustada) * 100;
            const desviacion = proyecto.avance - avanceEsperado;
            
            if (desviacion <= -15) {
                nuevasAlertas.push({
                    id: `${proyecto.codigo}-retraso`,
                    tipo: 'critico',
                    proyecto: proyecto.codigo,
                    mensaje: `${proyecto.codigo}: Retraso crítico de ${Math.abs(desviacion).toFixed(1)}% en desarrollo`,
                    revisada: false
                });
            }
            
            if (diasRestantes <= 10 && diasRestantes > 0) {
                nuevasAlertas.push({
                    id: `${proyecto.codigo}-vencimiento`,
                    tipo: 'advertencia',
                    proyecto: proyecto.codigo,
                    mensaje: `${proyecto.codigo}: Quedan ${diasRestantes} días para fecha compromiso`,
                    revisada: false
                });
            }
        }
             
        // Alertas específicas por estado SEREMITT
        if (proyecto.observacionesSEREMITT) {
            const obs = proyecto.observacionesSEREMITT;
            const diasRestantes = calcularDiasRestantes(obs.fechaVencimiento);
            
            // Alerta crítica si quedan menos de 3 días
            if (diasRestantes <= 3 && diasRestantes >= 0) {
                nuevasAlertas.push({
                    id: `${proyecto.codigo}-seremitt-urgente`,
                    tipo: 'critico',
                    proyecto: proyecto.codigo,
                    mensaje: `${proyecto.codigo}: ¡URGENTE! Quedan ${diasRestantes} días para ${obs.etapaActual}`,
                    revisada: false
                });
            } 
            // Alerta advertencia si quedan menos de 7 días
            else if (diasRestantes <= 7 && diasRestantes > 3) {
                nuevasAlertas.push({
                    id: `${proyecto.codigo}-seremitt-warning`,
                    tipo: 'advertencia',
                    proyecto: proyecto.codigo,
                    mensaje: `${proyecto.codigo}: Quedan ${diasRestantes} días para ${obs.etapaActual}`,
                    revisada: false
                });
            }
            
            // Alerta si se venció el plazo
            if (diasRestantes < 0) {
                nuevasAlertas.push({
                    id: `${proyecto.codigo}-seremitt-vencido`,
                    tipo: 'critico',
                    proyecto: proyecto.codigo,
                    mensaje: `${proyecto.codigo}: Plazo VENCIDO hace ${Math.abs(diasRestantes)} días (${obs.etapaActual})`,
                    revisada: false
                });
            }
        }
    });
    setAlertas(nuevasAlertas);
    };

// Actualizar estado del proyecto
const actualizarEstadoProyecto = (codigoProyecto: string, nuevoEstado: EstadoProyecto): void => {
    const nuevosProyectos = proyectos.map(p => {
        if (p.codigo === codigoProyecto) {
            const proyectoActualizado = { ...p, estado: nuevoEstado };
            
            if (nuevoEstado === 'Enviado a SEIM') {
                const plazoEvaluacion = p.tipo === 'Básico' ? 45 : 60;
                const fechaVencimiento = new Date();
                fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoEvaluacion);
                
                proyectoActualizado.observacionesSEREMITT = {
                    ciclo: 1,
                    etapaActual: 'Evaluación SEREMITT (Paso 1)',
                    plazoMaximo: plazoEvaluacion,
                    fechaVencimiento: fechaVencimiento.toISOString(),
                    fechaEnvio: new Date().toISOString()
                };
            }
            
            if (nuevoEstado === 'En Corrección' && p.observacionesSEREMITT) {
                const plazoCorreccion = p.tipo === 'Básico' ? 20 : 30;
                const fechaVencimiento = new Date();
                fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoCorreccion);
                
                proyectoActualizado.observacionesSEREMITT = {
                    ...p.observacionesSEREMITT,
                    etapaActual: 'Corrección consultora (Paso 2)',
                    plazoMaximo: plazoCorreccion,
                    fechaVencimiento: fechaVencimiento.toISOString(),
                    fechaRecepcionObservaciones: new Date().toISOString()
                };
            }
            
            if (nuevoEstado === 'En Evaluación SEREMITT' && p.observacionesSEREMITT) {
                const plazoRevision = p.tipo === 'Básico' ? 20 : 30;
                const fechaVencimiento = new Date();
                fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoRevision);
                
                proyectoActualizado.observacionesSEREMITT = {
                    ...p.observacionesSEREMITT,
                    ciclo: (p.observacionesSEREMITT.ciclo || 1) + 1,
                    etapaActual: `Revisión SEREMITT ciclo ${(p.observacionesSEREMITT.ciclo || 1) + 1} (Paso 3)`,
                    plazoMaximo: plazoRevision,
                    fechaVencimiento: fechaVencimiento.toISOString(),
                    fechaReenvio: new Date().toISOString()
                };
            }
            
            return proyectoActualizado;
        }
        return p;
    });
    
    setProyectos(nuevosProyectos);
    verificarAlertas(nuevosProyectos);
};

    // Actualizar avance
    const actualizarAvance = (codigoProyecto: string, fases: Fase[]): void => {
        const fasesCompletadas = fases.filter(f => f.completada).length;
        const avance = (fasesCompletadas / fases.length) * 100;
        
        const nuevosProyectos = proyectos.map(p => 
        p.codigo === codigoProyecto ? { ...p, fases, avance } : p
        );
        
        setProyectos(nuevosProyectos);
        verificarAlertas(nuevosProyectos);
    };

    useEffect(() => {
        verificarAlertas(proyectos);
    }, [proyectos]);

    // Filtrar proyectos
    const proyectosFiltrados = proyectos.filter(p => {
        if (filtros.tipo !== 'todos' && p.tipo !== filtros.tipo) return false;
        if (filtros.profesional !== 'todos' && p.profesionalAsignado !== filtros.profesional) return false;
        return true;
    });

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="container mx-auto">

                <Header 
                    paginaActual="dashboard"
                    onNuevoProyecto={() => setMostrarFormulario(true)}
                    cantidadAlertas={alertas.filter(a => !a.revisada).length}
                    onNavegar={onNavegar}
                />
                {/* Filtros */}
                <div className={styles.layout.container + ' py-4 sm:py-6'}>
                    <div className={styles.filters.container}>
                        <div className={styles.filters.wrapper}>
                            <Filter size={20} className={styles.filters.icon} />
                            <select
                            value={filtros.tipo}
                            onChange={(e) => setFiltros({...filtros, tipo: e.target.value as TipoProyecto | 'todos'})}
                            className={styles.filters.select}
                            >
                                <option value="todos">Todos los tipos</option>
                                <option value="Básico">Básico</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Mayor">Mayor</option>
                            </select>
                            
                            <select
                                value={filtros.profesional}
                                onChange={(e) => setFiltros({...filtros, profesional: e.target.value})}
                                className={styles.filters.select}
                            >
                                <option value="todos">Todos los profesionales</option>
                                <option value="prof1">Profesional 1</option>
                                <option value="prof2">Profesional 2</option>
                                <option value="prof3">Profesional 3</option>
                                <option value="prof4">Profesional 4</option>
                                <option value="prof5">Profesional 5</option>
                            </select>
                            
                            <div className={styles.filters.counter}>
                                {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertas */}
                {alertas.filter(a => !a.revisada).length > 0 && (
                    <div className={styles.alerts.container}>
                        <div className={`${styles.alerts.wrapper} ${styles.alerts.types.danger}`}>
                            <div className={styles.alerts.content.flex}>
                                <AlertTriangle className={`${styles.alerts.content.icon} text-red-500`} size={20} />
                                <div className={styles.alerts.content.body}>
                                    <h3 className={`${styles.alerts.content.title} text-red-800`}>
                                        Alertas Activas ({alertas.filter(a => !a.revisada).length})
                                    </h3>
                                    {alertas.filter(a => !a.revisada).slice(0, 5).map(alerta => (
                                    <div key={alerta.id} className={`${styles.alerts.content.item} text-red-700`}>
                                        • {alerta.mensaje}
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dashboard Kanban */}
                <div className={styles.dashboard.container}>
                    <DashKanban 
                        proyectos={proyectosFiltrados}
                        onProyectoClick={setProyectoSeleccionado}
                        onCambiarEstado={actualizarEstadoProyecto}
                        calcularDiasRestantes={calcularDiasRestantes}
                        obtenerColorEstado={obtenerColorEstado}
                    />
                </div>
            </main>
                {/* Modal Formulario */}
                {mostrarFormulario && (
                    <FormProyecto
                        onCerrar={() => setMostrarFormulario(false)}
                        onGuardar={(proyecto) => {
                            agregarProyecto(proyecto);
                            setMostrarFormulario(false);
                        }}
                        proyectosActivos={proyectos.filter(p => 
                            p.estado !== 'Aprobado' && p.estado !== 'Rechazado'
                        ).length}
                        calcularEstimacion={calcularEstimacion}
                    />
                )}

                {/* Modal Detalle Proyecto */}
                {proyectoSeleccionado && (
                    <DetalleProyecto
                    proyecto={proyectoSeleccionado}
                    onCerrar={() => setProyectoSeleccionado(null)}
                    onActualizarAvance={(fases) => actualizarAvance(proyectoSeleccionado.codigo, fases)}
                    calcularDiasRestantes={calcularDiasRestantes}
                    />
                )}
            <Footer />
        </div>
    );
};

export default Dashboard;