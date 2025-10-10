import React from 'react';
import { LayoutDashboard, BarChart3, Bell, Plus } from 'lucide-react';

interface HeaderProps {
<<<<<<< HEAD
  paginaActual: 'dashboard' | 'analytics';
  onNuevoProyecto?: () => void;
  cantidadAlertas?: number;
  onNavegar: (pagina: 'dashboard' | 'analytics') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  paginaActual, 
  onNuevoProyecto, 
  cantidadAlertas = 0,
  onNavegar 
}) => {
=======
  paginaActual: string;
  onNuevoProyecto: () => void;
  onActualizar: () => void;
  cantidadAlertas: number;
  onNavegar?: (pagina: 'dashboard' | 'analytics') => void;
}

const Header: React.FC<HeaderProps> = ({ paginaActual, onNuevoProyecto, onActualizar, cantidadAlertas, onNavegar }) => {
>>>>>>> c4031176c45b43bdf0a54eaa0a305aacd680b923
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 sm:py-6">
          {/* Logo y título */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Sistema de Gestión IMIV
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              Consultores y Asesorías Viales de la Cuadra Ltda.
            </p>
          </div>
          
          {/* Acciones */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notificaciones */}
            <div className="relative">
              <button 
                className="p-2 hover:bg-blue-700 rounded-lg relative transition-all duration-200 hover:scale-105"
                title="Notificaciones"
              >
                <Bell size={20} />
                {cantidadAlertas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                    {cantidadAlertas}
                  </span>
                )}
              </button>
            </div>
            
            {/* Botón Nuevo Proyecto - solo en dashboard */}
            {paginaActual === 'dashboard' && onNuevoProyecto && (
              <button
                onClick={onNuevoProyecto}
                className="bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2 transition-all duration-200 hover:shadow-md hover:scale-105 text-sm sm:text-base"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Nuevo Proyecto</span>
                <span className="sm:hidden">Nuevo</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Barra de navegación */}
        <nav className="border-t border-blue-500/30">
          <div className="flex gap-1 sm:gap-2 -mb-px">
            <button
              onClick={() => onNavegar('dashboard')}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base
                transition-all duration-200 border-b-4 relative
                ${paginaActual === 'dashboard'
                  ? 'text-white border-white bg-blue-600/30'
                  : 'text-blue-200 border-transparent hover:text-white hover:bg-blue-700/30 hover:border-blue-300'
                }
              `}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
              {paginaActual === 'dashboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white shadow-lg shadow-white/50" />
              )}
            </button>
            
            <button
              onClick={() => onNavegar('analytics')}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base
                transition-all duration-200 border-b-4 relative
                ${paginaActual === 'analytics'
                  ? 'text-white border-white bg-blue-600/30'
                  : 'text-blue-200 border-transparent hover:text-white hover:bg-blue-700/30 hover:border-blue-300'
                }
              `}
            >
              <BarChart3 size={20} />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Gráficos</span>
              {paginaActual === 'analytics' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white shadow-lg shadow-white/50" />
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;