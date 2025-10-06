// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Filter, AlertTriangle, Plus, Bell, RefreshCw } from 'lucide-react';
import DashKanban from '../components/DashKanban';
import FormProyecto from '../components/FormProyecto';
import DetalleProyecto from '../components/DetalleProyecto';
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

const Dashboard: React.FC = () => {
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
    const estimacionBase: Record<TipoProyecto, number> = {
      'Básico': 45,
      'Intermedio': 60,
      'Mayor': 90
    };
    const factorCarga = Math.floor(proyectosActivos / 3) * 5;
    return estimacionBase[tipo] + factorCarga;
  };

  // Agregar nuevo proyecto
  const agregarProyecto = (nuevoProyecto: NuevoProyectoData): void => {
    const proyectosActivos = proyectos.filter(p => p.estado !== 'Finalizado').length;
    const estimacionDias = calcularEstimacion(nuevoProyecto.tipo, proyectosActivos);
    
    const proyecto: Proyecto = {
      ...nuevoProyecto,
      codigo: generarCodigoProyecto(),
      fechaRegistro: new Date().toISOString(),
      estado: 'Iniciado',
      estimacionDias,
      estimacionAjustada: estimacionDias,
      avance: 0,
      fases: [
        { nombre: 'Levantamiento de información', completada: false, fechaInicio: null, fechaFin: null },
        { nombre: 'Análisis de impacto vial', completada: false, fechaInicio: null, fechaFin: null },
        { nombre: 'Elaboración de propuestas', completada: false, fechaInicio: null, fechaFin: null },
        { nombre: 'Redacción informe', completada: false, fechaInicio: null, fechaFin: null },
        { nombre: 'Revisión interna', completada: false, fechaInicio: null, fechaFin: null },
        { nombre: 'Subido a SEIM', completada: false, fechaInicio: null, fechaFin: null }
      ],
      observacionesSEREMITT: null,
      profesionalAsignado: null
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
      if (proyecto.estado === 'Finalizado') return;
      
      const diasRestantes = calcularDiasRestantes(proyecto.fechaCompromiso);
      const avanceEsperado = ((proyecto.estimacionAjustada - diasRestantes) / proyecto.estimacionAjustada) * 100;
      const desviacion = proyecto.avance - avanceEsperado;
      
      if (desviacion <= -15) {
        nuevasAlertas.push({
          id: `${proyecto.codigo}-retraso`,
          tipo: 'critico',
          proyecto: proyecto.codigo,
          mensaje: `Proyecto ${proyecto.codigo} con retraso crítico (${Math.abs(desviacion).toFixed(1)}% bajo lo esperado)`,
          revisada: false
        });
      }
      
      if (diasRestantes <= 5 && diasRestantes > 0) {
        nuevasAlertas.push({
          id: `${proyecto.codigo}-vencimiento`,
          tipo: 'advertencia',
          proyecto: proyecto.codigo,
          mensaje: `Quedan ${diasRestantes} días para la fecha compromiso del proyecto ${proyecto.codigo}`,
          revisada: false
        });
      }
      
      if (proyecto.observacionesSEREMITT) {
        const diasCorreccion = calcularDiasRestantes(proyecto.observacionesSEREMITT.fechaVencimiento);
        if (diasCorreccion <= 5 && diasCorreccion > 0) {
          nuevasAlertas.push({
            id: `${proyecto.codigo}-seremitt`,
            tipo: 'advertencia',
            proyecto: proyecto.codigo,
            mensaje: `Quedan ${diasCorreccion} días para corregir observaciones SEREMITT del proyecto ${proyecto.codigo}`,
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
        
        if (nuevoEstado === 'Enviado') {
          const plazoRespuesta = p.tipo === 'Básico' ? 20 : 30;
          const fechaVencimiento = new Date();
          fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoRespuesta);
          
          proyectoActualizado.observacionesSEREMITT = {
            plazoMaximo: plazoRespuesta,
            fechaVencimiento: fechaVencimiento.toISOString()
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
    <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <header className={styles.header.container}>
            <div className={styles.header.wrapper}>
                <div className={styles.header.flex}>
                <div>
                    <h1 className={styles.header.title.h1}>Sistema de Gestión IMIV</h1>
                    <p className={styles.header.title.subtitle}>
                    Consultores y Asesorías Viales de la Cuadra Ltda.
                    </p>
                </div>
                
                <div className={styles.header.actions.container}>
                    <button
                    onClick={() => verificarAlertas(proyectos)}
                    className={styles.header.actions.button}
                    title="Actualizar dashboard"
                    >
                    <RefreshCw size={20} />
                    </button>
                    
                    <div className="relative">
                    <button className={styles.header.notifications.button}>
                        <Bell size={20} />
                        {alertas.filter(a => !a.revisada).length > 0 && (
                        <span className={styles.header.notifications.badge}>
                            {alertas.filter(a => !a.revisada).length}
                        </span>
                        )}
                    </button>
                    </div>
                    
                    <button
                    onClick={() => setMostrarFormulario(true)}
                    className={styles.header.actions.buttonPrimary}
                    >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Nuevo Proyecto</span>
                    <span className="sm:hidden">Nuevo</span>
                    </button>
                </div>
                </div>
            </div>
        </header>
        <main className="flex-1">
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
                        Alertas Activas
                        </h3>
                        {alertas.filter(a => !a.revisada).slice(0, 3).map(alerta => (
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

            {/* Modal Formulario */}
            {mostrarFormulario && (
                <FormProyecto
                    onCerrar={() => setMostrarFormulario(false)}
                    onGuardar={(proyecto) => {
                        agregarProyecto(proyecto);
                        setMostrarFormulario(false);
                    }}
                    proyectosActivos={proyectos.filter(p => p.estado !== 'Finalizado').length}
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
        </main>
    </div>
  );
};

export default Dashboard;