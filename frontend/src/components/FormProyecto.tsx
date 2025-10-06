// src/components/FormProyecto.tsx

import { useState, useEffect } from 'react';
import { X, Save, Clock } from 'lucide-react';
import stylesForm, { cn } from '../styles/global';
import { FormProyectoProps, NuevoProyectoData, ErroresFormulario, TipoProyecto } from '../types/types';

const FormProyecto: React.FC<FormProyectoProps> = ({ 
  onCerrar, 
  onGuardar, 
  proyectosActivos, 
  calcularEstimacion 
}) => {
  const [datos, setDatos] = useState<NuevoProyectoData>({
    nombre: '',
    cliente: '',
    tipo: 'Básico',
    ubicacion: '',
    fechaCompromiso: ''
  });
  
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [estimacion, setEstimacion] = useState<number | null>(null);

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresFormulario = {};
    
    if (!datos.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (datos.nombre.length > 100) nuevosErrores.nombre = 'Máximo 100 caracteres';
    
    if (!datos.cliente.trim()) nuevosErrores.cliente = 'El cliente es obligatorio';
    if (datos.cliente.length > 100) nuevosErrores.cliente = 'Máximo 100 caracteres';
    
    if (!datos.ubicacion.trim()) nuevosErrores.ubicacion = 'La ubicación es obligatoria';
    
    if (!datos.fechaCompromiso) nuevosErrores.fechaCompromiso = 'La fecha compromiso es obligatoria';
    
    const fechaSeleccionada = new Date(datos.fechaCompromiso);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      nuevosErrores.fechaCompromiso = 'La fecha no puede ser anterior a hoy';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  useEffect(() => {
    if (datos.tipo) {
      const est = calcularEstimacion(datos.tipo, proyectosActivos);
      setEstimacion(est);
    }
  }, [datos.tipo, proyectosActivos, calcularEstimacion]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validarFormulario()) {
      onGuardar(datos);
    }
  };

  return (
    <div className={stylesForm.modal.overlay}>
      <div className={cn(stylesForm.modal.container, stylesForm.modal.sizes.md)}>
        {/* Header */}
        <div className={stylesForm.modal.header.container}>
          <div className={stylesForm.modal.header.flex}>
            <div>
              <h2 className={stylesForm.modal.header.title}>Nuevo Proyecto IMIV</h2>
              <p className={stylesForm.modal.header.subtitle}>
                Complete la información del proyecto
              </p>
            </div>
            <button 
              onClick={onCerrar} 
              className={stylesForm.modal.header.close}
              type="button"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className={stylesForm.modal.body.container}>
          <form onSubmit={handleSubmit} className={stylesForm.form.container}>
            {/* Nombre del Proyecto */}
            <div className={stylesForm.form.field.wrapper}>
              <label className={stylesForm.form.field.label}>
                Nombre del Proyecto
                <span className={stylesForm.form.field.required}>*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={datos.nombre}
                onChange={(e) => setDatos({...datos, nombre: e.target.value})}
                className={cn(
                  stylesForm.form.input.base,
                  errores.nombre ? stylesForm.form.input.error : stylesForm.form.input.normal
                )}
                placeholder="Ej: Edificio Los Castaños"
              />
              {errores.nombre && (
                <p className={stylesForm.form.error}>
                  {errores.nombre}
                </p>
              )}
            </div>
            
            {/* Cliente */}
            <div className={stylesForm.form.field.wrapper}>
              <label className={stylesForm.form.field.label}>
                Cliente
                <span className={stylesForm.form.field.required}>*</span>
              </label>
              <input
                id="cliente"
                name="cliente"
                type="text"
                value={datos.cliente}
                onChange={(e) => setDatos({...datos, cliente: e.target.value})}
                className={cn(
                  stylesForm.form.input.base,
                  errores.cliente ? stylesForm.form.input.error : stylesForm.form.input.normal
                )}
                placeholder="Ej: Inmobiliaria Santa María"
              />
              {errores.cliente && (
                <p className={stylesForm.form.error}>
                  {errores.cliente}
                </p>
              )}
            </div>
            
            {/* Tipo de Proyecto */}
            <div className={stylesForm.form.field.wrapper}>
              <label className={stylesForm.form.field.label}>
                Tipo de Proyecto
                <span className={stylesForm.form.field.required}>*</span>
              </label>
              <select
                value={datos.tipo}
                onChange={(e) => setDatos({...datos, tipo: e.target.value as TipoProyecto})}
                className={stylesForm.form.select.base}
              >
                <option value="Básico">Básico (IMIV básico: 45 días)</option>
                <option value="Intermedio">Intermedio (IMIV intermedio: 60 días)</option>
                <option value="Mayor">Mayor (IMIV mayor: 90 días)</option>
              </select>
              
              {/* Info Box de Estimación */}
              {estimacion && (
                <div className={cn(stylesForm.form.infoBox.base, stylesForm.form.infoBox.info)}>
                  <p className={cn(stylesForm.form.infoBox.text, 'text-blue-800')}>
                    <Clock size={16} className="flex-shrink-0" />
                    <span>
                      Tiempo estimado: <strong>{estimacion} días hábiles</strong>
                      {proyectosActivos > 0 && (
                        <span className="text-xs ml-2">
                          (ajustado por {proyectosActivos} proyecto{proyectosActivos !== 1 ? 's' : ''} activo{proyectosActivos !== 1 ? 's' : ''})
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              )}
            </div>
            
            {/* Ubicación */}
            <div className={stylesForm.form.field.wrapper}>
              <label className={stylesForm.form.field.label}>
                Ubicación
                <span className={stylesForm.form.field.required}>*</span>
              </label>
              <input
                id="ubicacion"
                name="ubicacion"
                type="text"
                value={datos.ubicacion}
                onChange={(e) => setDatos({...datos, ubicacion: e.target.value})}
                className={cn(
                  stylesForm.form.input.base,
                  errores.ubicacion ? stylesForm.form.input.error : stylesForm.form.input.normal
                )}
                placeholder="Ej: Av. Libertad 1234, Viña del Mar"
              />
              {errores.ubicacion && (
                <p className={stylesForm.form.error}>
                  {errores.ubicacion}
                </p>
              )}
            </div>
            
            {/* Fecha Compromiso */}
            <div className={stylesForm.form.field.wrapper}>
              <label className={stylesForm.form.field.label}>
                Fecha Compromiso
                <span className={stylesForm.form.field.required}>*</span>
              </label>
              <input
                id="fechaCompromiso"
                name="fechaCompromiso"
                type="date"
                value={datos.fechaCompromiso}
                onChange={(e) => setDatos({...datos, fechaCompromiso: e.target.value})}
                className={cn(
                  stylesForm.form.input.base,
                  errores.fechaCompromiso ? stylesForm.form.input.error : stylesForm.form.input.normal
                )}
              />
              {errores.fechaCompromiso && (
                <p className={stylesForm.form.error}>
                  {errores.fechaCompromiso}
                </p>
              )}
              <p className={stylesForm.form.field.hint}>
                Fecha en la que el proyecto debe estar finalizado
              </p>
            </div>
            
            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onCerrar}
                className={cn(stylesForm.button.base, stylesForm.button.variants.outline, 'flex-1')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={cn(stylesForm.button.base, stylesForm.button.variants.primary, 'flex-1')}
              >
                <Save size={20} />
                Guardar Proyecto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormProyecto;