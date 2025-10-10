// src/components/common/Header.tsx
import React from 'react';
import { Plus, Bell, RefreshCw } from 'lucide-react';
import styles from '../../styles/global';

interface HeaderProps {
  paginaActual: string;
  onNuevoProyecto: () => void;
  onActualizar: () => void;
  cantidadAlertas: number;
  onNavegar?: (pagina: 'dashboard' | 'analytics') => void;
}

const Header: React.FC<HeaderProps> = ({ paginaActual, onNuevoProyecto, onActualizar, cantidadAlertas, onNavegar }) => {
  return (
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
              onClick={onActualizar}
              className={styles.header.actions.button}
              title="Actualizar dashboard"
            >
              <RefreshCw size={20} />
            </button>
            
            <div className="relative">
              <button className={styles.header.notifications.button}>
                <Bell size={20} />
                {cantidadAlertas > 0 && (
                  <span className={styles.header.notifications.badge}>
                    {cantidadAlertas}
                  </span>
                )}
              </button>
            </div>
            
            <button
              onClick={onNuevoProyecto}
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
  );
};

export default Header;