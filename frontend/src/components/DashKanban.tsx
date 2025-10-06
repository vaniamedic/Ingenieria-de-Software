// src/components/DashKanban.tsx
import React, { useState } from 'react';
import TarjetaProyecto from './TarjetaProyecto';
import styles from '../styles/global';
import { DashKanbanProps, EstadoProyecto } from '../types/types';

const DashKanban: React.FC<DashKanbanProps> = ({ 
  proyectos, 
  onProyectoClick, 
  onCambiarEstado, 
  calcularDiasRestantes, 
  obtenerColorEstado 
}) => {
  const estados: EstadoProyecto[] = [
    'En Desarrollo', 
    'Enviado a SEIM',
    'En Evaluación SEREMITT', 
    'En Corrección', 
    'Aprobado',
    'Rechazado'
  ];
  
  const [draggedProject, setDraggedProject] = useState<string | null>(null);

  return (
    <div className={`${styles.dashboard.grid.base} ${styles.dashboard.grid.responsive}`}>
      {estados.map(estado => (
        <div
          key={estado}
          className={styles.dashboard.column.base}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedProject) {
              onCambiarEstado(draggedProject, estado);
              setDraggedProject(null);
            }
          }}
        >
          <h3 className={styles.dashboard.column.header}>
            {estado}
            <span className={styles.dashboard.column.badge}>
              {proyectos.filter(p => p.estado === estado).length}
            </span>
          </h3>
          
          <div className={styles.dashboard.column.list}>
            {proyectos
              .filter(p => p.estado === estado)
              .map(proyecto => (
                <TarjetaProyecto
                  key={proyecto.codigo}
                  proyecto={proyecto}
                  onClick={() => onProyectoClick(proyecto)}
                  onDragStart={() => setDraggedProject(proyecto.codigo)}
                  calcularDiasRestantes={calcularDiasRestantes}
                  obtenerColorEstado={obtenerColorEstado}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashKanban;