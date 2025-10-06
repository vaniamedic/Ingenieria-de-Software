// src/components/TarjetaProyecto.tsx
import React from 'react';
import { MapPin } from 'lucide-react';
import styles, { getProyectoColor, getDiasColor, getProgressColor } from '../styles/global';
import { TarjetaProyectoProps } from '../types/types';

const TarjetaProyecto: React.FC<TarjetaProyectoProps> = ({ 
  proyecto, 
  onClick, 
  onDragStart, 
  calcularDiasRestantes, 
  obtenerColorEstado 
}) => {
  const diasRestantes = calcularDiasRestantes(proyecto.fechaCompromiso);
  
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`${styles.card.base} ${obtenerColorEstado(proyecto)}`}
    >
      {/* Header con código y badge tipo */}
      <div className={styles.card.header.flex}>
        <span className={styles.card.header.codigo}>
          {proyecto.codigo}
        </span>
        <span className={`${styles.card.header.badge} ${getProyectoColor(proyecto.tipo)}`}>
          {proyecto.tipo}
        </span>
      </div>
      
      {/* Contenido principal */}
      <h4 className={styles.card.content.title}>
        {proyecto.nombre}
      </h4>
      <p className={styles.card.content.subtitle}>
        {proyecto.cliente}
      </p>
      
      {/* Ubicación */}
      <div className={styles.card.content.info}>
        <MapPin size={12} className="flex-shrink-0" />
        <span className="truncate">{proyecto.ubicacion}</span>
      </div>
      
      {/* Footer con días y porcentaje */}
      <div className={styles.card.footer.flex}>
        <span className={`${styles.card.footer.dias} ${getDiasColor(diasRestantes)}`}>
          {diasRestantes < 0 
            ? `${Math.abs(diasRestantes)}d vencido` 
            : `${diasRestantes}d restantes`}
        </span>
        <span className="text-gray-600 font-semibold">
          {proyecto.avance.toFixed(0)}%
        </span>
      </div>
      
      {/* Barra de progreso */}
      <div className={styles.card.progress.container}>
        <div
          className={`${styles.card.progress.bar} ${getProgressColor(proyecto.avance)}`}
          style={{ width: `${proyecto.avance}%` }}
        />
      </div>
    </div>
  );
};

export default TarjetaProyecto;