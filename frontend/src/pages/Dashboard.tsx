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
    getProyectos, 
    getProfesionales, 
    createProyecto, 
    updateProyectoEstado 
} from '../services/api';
import { 
  Proyecto, 
  Alerta, 
  Filtros, 
  NuevoProyectoData, 
  TipoProyecto,
  EstadoProyecto,
  Profesional,
  Fase,
  SeveridadAlerta,
  TipoAlerta
} from '../../../common/types';
import axios from 'axios';

interface DashboardProps {
  onNavegar: (pagina: 'dashboard' | 'analytics') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavegar }) => {

    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [profesionales, setProfesionales] = useState<Profesional[]>([]);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    
    const [cargando, setCargando] = useState<boolean>(true);
    const [errorApi, setErrorApi] = useState<string | null>(null);
    const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);
    const [filtros, setFiltros] = useState<Filtros>({ 
        tipo: 'todos', 
        profesional: 'todos'
    });

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            setCargando(true);
            setErrorApi(null); // Limpiar errores previos
            try {
                const [proyectosData, profesionalesData] = await Promise.all([
                getProyectos(),
                getProfesionales()
                ]);
                setProyectos(proyectosData);
                setProfesionales(profesionalesData);
                verificarAlertas(proyectosData);
            } catch (error) {
            setErrorApi((error as Error).message);
            } finally {
                setCargando(false);
            }
        };
        cargarDatosIniciales();
    }, []);

    const agregarProyecto = async (nuevoProyectoData: NuevoProyectoData) => {
        try {
        const proyectoCreado = await createProyecto(nuevoProyectoData);
        setProyectos(prevProyectos => [...prevProyectos, proyectoCreado]);
        verificarAlertas([...proyectos, proyectoCreado]);
        setMostrarFormulario(false);
        } catch (error) {
        setErrorApi((error as Error).message);
        }
    };

    // Generar código único de proyecto
    const generarCodigoProyecto = (): string => {
        const año = new Date().getFullYear();
        const numero = (proyectos.length + 1).toString().padStart(4, '0');
        return `IMIV-${año}-${numero}`;

    };

    // Actualizar estado del proyecto
    const actualizarEstadoProyecto = async (proyectoId: number, nuevoEstado: EstadoProyecto) => {
        try {
            // Llamamos a la API y el backend se encarga de la lógica compleja
            const proyectoActualizado = await updateProyectoEstado(proyectoId, nuevoEstado);
            // Actualizamos el estado local con la respuesta autoritativa del backend
            setProyectos(proyectos.map(p => p.id === proyectoId ? proyectoActualizado : p));
            verificarAlertas(proyectos.map(p => p.id === proyectoId ? proyectoActualizado : p));
        } catch (error) {
            setErrorApi((error as Error).message);
        }
    };

    // Calcular días restantes
    const calcularDiasRestantes = (fecha: string): number => {
        const hoy = new Date();
        const fechaCompromiso = new Date(fecha);
        // Ignorar la hora para un cálculo de días completos
        hoy.setHours(0, 0, 0, 0);
        fechaCompromiso.setHours(0, 0, 0, 0);
        const diffTime = fechaCompromiso.getTime() - hoy.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Obtener color según estado
    const obtenerColorEstado = (proyecto: Proyecto): string => {
        if (!proyecto.estimacion_ajustada_dias || proyecto.estimacion_ajustada_dias === 0) return styles.card.estados.gris;
        const diasRestantes = calcularDiasRestantes(proyecto.fecha_compromiso);
        const diasTranscurridos = proyecto.estimacion_ajustada_dias - diasRestantes;
        const avanceEsperado = (diasTranscurridos / proyecto.estimacion_ajustada_dias) * 100;
        const desviacion = proyecto.avance - avanceEsperado;
        if (desviacion >= 0) return styles.card.estados.verde;
        if (desviacion > -15) return styles.card.estados.amarillo;
        return styles.card.estados.rojo;
    };

    // Verificar alertas
    const verificarAlertas = (listaProyectos: Proyecto[]): void => {
        // La lógica de alertas sigue siendo responsabilidad del cliente por ahora
        const nuevasAlertas: Alerta[] = [];
        // ... (la lógica de `verificarAlertas` que ya tenías iría aquí, adaptada a los nuevos tipos) ...
        setAlertas(nuevasAlertas);
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

    // --- RENDERIZADO CONDICIONAL ---
    if (cargando) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando el reino digital...</div>;
    }
    
    if (errorApi) {
        return <div className="min-h-screen flex flex-col items-center justify-center text-red-600 bg-red-50 p-4">
        <h2 className="text-2xl font-bold mb-4">¡Ha Ocurrido un Problema!</h2>
        <p className="mb-4">No se pudo establecer comunicación con los dominios</p>
        <pre className="bg-white p-2 border border-red-200 rounded text-sm text-red-800">Error: {errorApi}</pre>
        </div>;
    }

    useEffect(() => {
        verificarAlertas(proyectos);
    }, [proyectos]);

    // Filtrar proyectos
    const proyectosFiltrados = proyectos.filter(p => {
        const filtroTipoOk = filtros.tipo === 'todos' || p.tipo === filtros.tipo;
        const filtroProfesionalOk = filtros.profesional === 'todos' || p.profesional_lider_id === filtros.profesional;
        return filtroTipoOk && filtroProfesionalOk;
    });

    const proyectosActivosCount = proyectos.filter(p => p.estado !== 'Aprobado' && p.estado !== 'Rechazado').length;

   return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="container mx-auto">
        <Header 
          paginaActual="dashboard"
          onNuevoProyecto={() => setMostrarFormulario(true)}
          cantidadAlertas={alertas.filter(a => !a.revisada).length}
          onNavegar={onNavegar}
        />
        
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
                onChange={(e) => setFiltros({...filtros, profesional: e.target.value === 'todos' ? 'todos' : Number(e.target.value)})}
                className={styles.filters.select}
              >
                <option value="todos">Todos los profesionales</option>
                {profesionales.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.nombre_completo}</option>
                ))}
              </select>
              
              <div className={styles.filters.counter}>
                {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

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

      {mostrarFormulario && (
        <FormProyecto
          onCerrar={() => setMostrarFormulario(false)}
          onGuardar={agregarProyecto}
          proyectosActivos={proyectosActivosCount}
        />
      )}

      {proyectoSeleccionado && (
        <DetalleProyecto
          proyecto={proyectoSeleccionado}
          onCerrar={() => setProyectoSeleccionado(null)}
          onActualizarFase={(faseId, completada) => console.log(`API_CALL: updateFase(${faseId}, { completada: ${completada} })`)}
          calcularDiasRestantes={calcularDiasRestantes}
        />
      )}
      <Footer />
    </div>
  );
};

export default Dashboard;