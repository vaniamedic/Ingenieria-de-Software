import React, { useState, useMemo } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Calendar, Users, Filter, Download } from 'lucide-react';

// Simulación de datos - en producción vendrían del backend
const proyectosSimulados = [
  { codigo: 'IMIV-2024-0001', nombre: 'Proyecto Centro', tipo: 'Mayor', estado: 'Aprobado', avance: 100, diasRestantes: 0, fechaCompromiso: '2024-08-15', profesionalAsignado: 'prof1', fechaRegistro: '2024-01-10' },
  { codigo: 'IMIV-2024-0002', nombre: 'Edificio Norte', tipo: 'Intermedio', estado: 'En Desarrollo', avance: 65, diasRestantes: 15, fechaCompromiso: '2024-12-20', profesionalAsignado: 'prof2', fechaRegistro: '2024-03-15' },
  { codigo: 'IMIV-2024-0003', nombre: 'Local Comercial', tipo: 'Básico', estado: 'Enviado a SEIM', avance: 100, diasRestantes: 30, fechaCompromiso: '2024-11-30', profesionalAsignado: 'prof1', fechaRegistro: '2024-04-20' },
  { codigo: 'IMIV-2024-0004', nombre: 'Condominio Sur', tipo: 'Mayor', estado: 'En Corrección', avance: 85, diasRestantes: 8, fechaCompromiso: '2024-11-15', profesionalAsignado: 'prof3', fechaRegistro: '2024-02-05' },
  { codigo: 'IMIV-2024-0005', nombre: 'Plaza Central', tipo: 'Intermedio', estado: 'Aprobado', avance: 100, diasRestantes: 0, fechaCompromiso: '2024-09-10', profesionalAsignado: 'prof2', fechaRegistro: '2024-01-25' },
  { codigo: 'IMIV-2024-0006', nombre: 'Torres Este', tipo: 'Mayor', estado: 'En Desarrollo', avance: 45, diasRestantes: 35, fechaCompromiso: '2025-01-15', profesionalAsignado: 'prof4', fechaRegistro: '2024-05-10' },
  { codigo: 'IMIV-2024-0007', nombre: 'Mini Market', tipo: 'Básico', estado: 'Aprobado', avance: 100, diasRestantes: 0, fechaCompromiso: '2024-07-30', profesionalAsignado: 'prof1', fechaRegistro: '2024-03-01' },
  { codigo: 'IMIV-2024-0008', nombre: 'Oficinas Oeste', tipo: 'Intermedio', estado: 'En Evaluación SEREMITT', avance: 100, diasRestantes: 20, fechaCompromiso: '2024-12-05', profesionalAsignado: 'prof5', fechaRegistro: '2024-04-15' },
];

interface AnalyticsProps {
  onNavegar: (pagina: 'dashboard' | 'analytics') => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onNavegar }) => {
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState('6meses');

  // Datos calculados
  const stats = useMemo(() => {
    const proyectosFiltrados = filtroTipo === 'todos' 
      ? proyectosSimulados 
      : proyectosSimulados.filter(p => p.tipo === filtroTipo);

    const total = proyectosFiltrados.length;
    const enDesarrollo = proyectosFiltrados.filter(p => p.estado === 'En Desarrollo').length;
    const aprobados = proyectosFiltrados.filter(p => p.estado === 'Aprobado').length;
    const enRiesgo = proyectosFiltrados.filter(p => p.diasRestantes < 10 && p.diasRestantes > 0).length;
    const avancePromedio = (proyectosFiltrados.reduce((acc, p) => acc + p.avance, 0) / total).toFixed(1);

    return { total, enDesarrollo, aprobados, enRiesgo, avancePromedio };
  }, [filtroTipo]);

  // Datos para gráfico de distribución por tipo
  const datosPorTipo = [
    { name: 'Básico', value: proyectosSimulados.filter(p => p.tipo === 'Básico').length, color: '#3b82f6' },
    { name: 'Intermedio', value: proyectosSimulados.filter(p => p.tipo === 'Intermedio').length, color: '#f59e0b' },
    { name: 'Mayor', value: proyectosSimulados.filter(p => p.tipo === 'Mayor').length, color: '#a855f7' },
  ];

  // Datos para gráfico de estados
  const datosPorEstado = [
    { name: 'En Desarrollo', value: proyectosSimulados.filter(p => p.estado === 'En Desarrollo').length, color: '#3b82f6' },
    { name: 'Enviado a SEIM', value: proyectosSimulados.filter(p => p.estado === 'Enviado a SEIM').length, color: '#8b5cf6' },
    { name: 'En Evaluación', value: proyectosSimulados.filter(p => p.estado === 'En Evaluación SEREMITT').length, color: '#f59e0b' },
    { name: 'En Corrección', value: proyectosSimulados.filter(p => p.estado === 'En Corrección').length, color: '#ef4444' },
    { name: 'Aprobado', value: proyectosSimulados.filter(p => p.estado === 'Aprobado').length, color: '#10b981' },
  ];

  // Datos para timeline de proyectos
  const datosTimeline = [
    { mes: 'Ene', Básico: 2, Intermedio: 1, Mayor: 1 },
    { mes: 'Feb', Básico: 1, Intermedio: 0, Mayor: 1 },
    { mes: 'Mar', Básico: 2, Intermedio: 1, Mayor: 0 },
    { mes: 'Abr', Básico: 1, Intermedio: 2, Mayor: 1 },
    { mes: 'May', Básico: 0, Intermedio: 1, Mayor: 1 },
    { mes: 'Jun', Básico: 1, Intermedio: 1, Mayor: 0 },
  ];

  // Datos para rendimiento por profesional
  const datosProfesionales = [
    { nombre: 'Prof. 1', proyectos: 3, aprobados: 2, promedio: 92 },
    { nombre: 'Prof. 2', proyectos: 2, aprobados: 1, promedio: 88 },
    { nombre: 'Prof. 3', proyectos: 1, aprobados: 0, promedio: 85 },
    { nombre: 'Prof. 4', proyectos: 1, aprobados: 0, promedio: 45 },
    { nombre: 'Prof. 5', proyectos: 1, aprobados: 0, promedio: 100 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="container mx-auto">

        <Header 
          paginaActual="analytics"
          cantidadAlertas={0}
          onNavegar={onNavegar}
        />
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los tipos</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Mayor">Mayor</option>
            </select>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="1mes">Último mes</option>
              <option value="3meses">Últimos 3 meses</option>
              <option value="6meses">Últimos 6 meses</option>
              <option value="1año">Último año</option>
            </select>
          </div>
        </div>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-blue-600" size={24} />
              <span className="text-sm text-gray-600 font-medium">Total Proyectos</span>
            </div>
            <p className="text-4xl font-bold text-blue-900">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-purple-600" size={24} />
              <span className="text-sm text-gray-600 font-medium">En Desarrollo</span>
            </div>
            <p className="text-4xl font-bold text-purple-900">{stats.enDesarrollo}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-600" size={24} />
              <span className="text-sm text-gray-600 font-medium">Aprobados</span>
            </div>
            <p className="text-4xl font-bold text-green-900">{stats.aprobados}</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-red-600" size={24} />
              <span className="text-sm text-gray-600 font-medium">En Riesgo</span>
            </div>
            <p className="text-4xl font-bold text-red-900">{stats.enRiesgo}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-yellow-600" size={24} />
              <span className="text-sm text-gray-600 font-medium">Avance Promedio</span>
            </div>
            <p className="text-4xl font-bold text-yellow-900">{stats.avancePromedio}%</p>
          </div>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribución por Tipo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Distribución por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Distribución por Estado */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Proyectos por Estado</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosPorEstado}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {datosPorEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline de Proyectos */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Timeline de Proyectos (2024)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={datosTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Básico" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
              <Area type="monotone" dataKey="Intermedio" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
              <Area type="monotone" dataKey="Mayor" stackId="1" stroke="#a855f7" fill="#a855f7" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Rendimiento por Profesional */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users size={24} />
            Rendimiento por Profesional
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosProfesionales} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nombre" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="proyectos" fill="#3b82f6" name="Proyectos Totales" radius={[0, 8, 8, 0]} />
              <Bar dataKey="aprobados" fill="#10b981" name="Aprobados" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;