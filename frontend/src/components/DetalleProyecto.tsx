// src/components/DetalleProyecto.tsx
import React, { useState } from 'react';
import { X, Edit2, Save, CheckCircle, AlertTriangle, User, MapPin, FileText, Calendar } from 'lucide-react';
import styles, { cn } from '../styles/global';
import { DetalleProyectoProps, Fase } from '../types/types';

const DetalleProyecto: React.FC<DetalleProyectoProps> = ({ 
  proyecto, 
  onCerrar, 
  onActualizarAvance, 
  calcularDiasRestantes 
}) => {
  const [fases, setFases] = useState<Fase[]>(proyecto.fases);
  const [editando, setEditando] = useState<boolean>(false);

  const toggleFase = (index: number): void => {
    const nuevasFases = [...fases];
    nuevasFases[index].completada = !nuevasFases[index].completada;
    
    if (nuevasFases[index].completada && !nuevasFases[index].fechaFin) {
      nuevasFases[index].fechaFin = new Date().toISOString().split('T')[0];
      if (!nuevasFases[index].fechaInicio) {
        nuevasFases[index].fechaInicio = new Date().toISOString().split('T')[0];
      }
    }
    
    setFases(nuevasFases);
  };

  const guardarAvance = (): void => {
    onActualizarAvance(fases);
    setEditando(false);
  };

  const diasRestantes = calcularDiasRestantes(proyecto.fechaCompromiso);

  return (
    <div className={styles.modal.overlay}>
      <div className={cn(styles.modal.container, styles.modal.sizes.lg)}>
        {/* Header */}
        <div className={styles.modal.header.container}>
          <div className={styles.modal.header.flex}>
            <div>
              <h2 className={styles.modal.header.title}>{proyecto.nombre}</h2>
              <p className={styles.modal.header.subtitle}>{proyecto.codigo}</p>
            </div>
            <button 
              onClick={onCerrar} 
              className={styles.modal.header.close}
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className={styles.modal.body.container}>
          {/* Información del Proyecto */}
          <div className={styles.detail.grid}>
            {/* Columna Izquierda - Info */}
            <div className={styles.detail.infoCard.container}>
              <div className={styles.detail.infoCard.item}>
                <User size={18} className={styles.detail.infoCard.icon} />
                <span><span className={styles.detail.infoCard.label}>Cliente:</span> {proyecto.cliente}</span>
              </div>
              
              <div className={styles.detail.infoCard.item}>
                <MapPin size={18} className={styles.detail.infoCard.icon} />
                <span><span className={styles.detail.infoCard.label}>Ubicación:</span> {proyecto.ubicacion}</span>
              </div>
              
              <div className={styles.detail.infoCard.item}>
                <FileText size={18} className={styles.detail.infoCard.icon} />
                <span><span className={styles.detail.infoCard.label}>Tipo:</span> {proyecto.tipo}</span>
              </div>
              
              <div className={styles.detail.infoCard.item}>
                <Calendar size={18} className={styles.detail.infoCard.icon} />
                <span>
                  <span className={styles.detail.infoCard.label}>Fecha Compromiso:</span>{' '}
                  {new Date(proyecto.fechaCompromiso).toLocaleDateString('es-CL')}
                </span>
              </div>
            </div>
            
            {/* Columna Derecha - Stats */}
            <div className="space-y-3">
              {/* Días Restantes */}
              <div className={cn(
                styles.detail.statCard.base,
                diasRestantes < 0 
                  ? styles.detail.statCard.danger
                  : diasRestantes <= 5 
                    ? styles.detail.statCard.warning 
                    : styles.detail.statCard.info
              )}>
                <p className={styles.detail.statCard.label}>Días Restantes</p>
                <p className={cn(
                  styles.detail.statCard.value,
                  diasRestantes < 0 
                    ? 'text-red-600' 
                    : diasRestantes <= 5 
                      ? 'text-orange-600' 
                      : 'text-blue-600'
                )}>
                  {diasRestantes < 0 ? Math.abs(diasRestantes) : diasRestantes}
                </p>
                <p className={styles.detail.statCard.subtext}>
                  {diasRestantes < 0 ? 'días vencidos' : 'días para entrega'}
                </p>
              </div>
              
              {/* Avance del Proyecto */}
              <div className={cn(styles.detail.statCard.base, styles.detail.statCard.success)}>
                <p className={styles.detail.statCard.label}>Avance del Proyecto</p>
                <p className={cn(styles.detail.statCard.value, 'text-green-600')}>
                  {proyecto.avance.toFixed(0)}%
                </p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${proyecto.avance}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Fases del Proyecto */}
          <div className={styles.detail.section.container}>
            <div className={styles.detail.section.header}>
              <h3 className={styles.detail.section.title}>Fases del Proyecto</h3>
              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className={cn(styles.button.base, styles.button.variants.primary)}
                >
                  <Edit2 size={18} />
                  Editar Avance
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFases(proyecto.fases);
                      setEditando(false);
                    }}
                    className={cn(styles.button.base, styles.button.variants.outline)}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarAvance}
                    className={cn(styles.button.base, styles.button.variants.success)}
                  >
                    <Save size={18} />
                    Guardar
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {fases.map((fase, index) => (
                <div
                  key={index}
                  className={cn(
                    styles.detail.phase.base,
                    fase.completada 
                      ? styles.detail.phase.completed 
                      : styles.detail.phase.pending
                  )}
                >
                  <div className={styles.detail.phase.content}>
                    <input
                      type="checkbox"
                      checked={fase.completada}
                      onChange={() => editando && toggleFase(index)}
                      disabled={!editando}
                      className={styles.detail.phase.checkbox}
                    />
                    <div className={styles.detail.phase.info}>
                      <h4 className={cn(
                        styles.detail.phase.title,
                        fase.completada ? 'text-green-700' : 'text-gray-700'
                      )}>
                        {fase.nombre}
                      </h4>
                      {fase.fechaInicio && (
                        <p className={styles.detail.phase.dates}>
                          Inicio: {new Date(fase.fechaInicio).toLocaleDateString('es-CL')}
                          {fase.fechaFin && ` | Fin: ${new Date(fase.fechaFin).toLocaleDateString('es-CL')}`}
                        </p>
                      )}
                    </div>
                    {fase.completada && (
                      <CheckCircle size={24} className={cn(styles.detail.phase.icon, 'text-green-600')} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Observaciones SEREMITT */}
          {proyecto.observacionesSEREMITT && (
            <div className={styles.detail.section.container}>
              <h3 className={styles.detail.section.title}>Observaciones SEREMITT</h3>
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={20} className="text-yellow-600" />
                  <span className="font-semibold text-yellow-800">
                    Plazo de corrección: {proyecto.observacionesSEREMITT.plazoMaximo} días
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Vencimiento: {new Date(proyecto.observacionesSEREMITT.fechaVencimiento).toLocaleDateString('es-CL')}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Días restantes: {calcularDiasRestantes(proyecto.observacionesSEREMITT.fechaVencimiento)} días
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleProyecto;