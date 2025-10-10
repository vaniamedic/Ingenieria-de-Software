from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
from backend.app.database import engine, SessionLocal
from pydantic import BaseModel
from backend.schemas import NuevoProyecto, ProyectoResponse
from backend import models

# Crear tablas en la BD si no existen
models.Base.metadata.create_all(bind=engine)

app1 = FastAPI()

# CORS para permitir conexión desde tu frontend
app1.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NuevoProyecto(BaseModel):
    nombre: str
    cliente: str
    tipo: str
    ubicacion: str
    fecha_compromiso: str

class ProyectoResponse(BaseModel):
    id: int
    codigo: str
    nombre: str
    tipo: str
    cliente: str
    ubicacion: str
    estado: str
    fecha_registro: str
    fecha_compromiso: str
    estimacion_inicial_dias: int
    estimacion_ajustada_dias: int | None
    justificacion_ajuste: str | None
    avance: float
    profesional_lider_id: int | None

    class Config:
        from_attributes = True

class ActualizarEstado(BaseModel):
    estado: str

# NUEVOS SCHEMAS PARA FASES
class FaseResponse(BaseModel):
    id: int
    proyecto_id: int
    nombre: str
    orden: int
    fase_completada: bool
    fecha_inicio_real: str | None
    fecha_fin_real: str | None

    class Config:
        from_attributes = True

class ActualizarFase(BaseModel):
    fase_completada: bool

# Dependencia de sesión de BD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def calcular_estimacion_dinamica(tipo: str, proyectos_activos: int) -> int:
    """
    Calcula la estimación de días basada en el tipo de proyecto y la carga de trabajo actual.
    """
    fases_base = {
        'Básico': 8,
        'Intermedio': 13,
        'Mayor': 13
    }
    factor_complejidad = {
        'Básico': 3,
        'Intermedio': 5,
        'Mayor': 7
    }

    tiempo_base = fases_base.get(tipo, 8) * factor_complejidad.get(tipo, 3)
    factor_carga = 1 + (proyectos_activos * 0.08)
    return round(tiempo_base * factor_carga)

def generar_fases_reales(tipo: str, proyecto_id: int, db: Session) -> None:
    """
    Genera la lista de fases correcta y detallada según el tipo de IMIV.
    """
    fases_por_tipo = {
      'Básico': [
        'Ficha resumen y esquema', 'Certificado informaciones previas', 'Área de influencia',
        'Caracterización situación actual', 'Medidas de mitigación propuestas',
        'Situación con proyecto mejorada', 'Revisión y ajustes finales', 'Preparación para envío SEIM'
      ],
      'Intermedio': [
        'Ficha resumen y esquema', 'Certificado informaciones previas', 'Definiciones iniciales del IMIV',
        'Estudios de base situación actual', 'Situación base (proyección oferta/demanda)',
        'Situación con proyecto', 'Cuantificación de impactos', 'Desarrollo medidas de mitigación',
        'Situación con proyecto mejorada', 'Modelación de transporte', 'Conclusiones y anexo digital',
        'Revisión integral', 'Preparación para envío SEIM'
      ],
      'Mayor': [
        'Ficha resumen y esquema', 'Certificado informaciones previas', 'Definiciones iniciales del IMIV',
        'Estudios de base situación actual', 'Situación base (proyección oferta/demanda)',
        'Situación con proyecto', 'Cuantificación de impactos', 'Desarrollo medidas de mitigación',
        'Situación con proyecto mejorada', 'Modelación de transporte completa',
        'Conclusiones y anexo digital', 'Revisión integral', 'Preparación para envío SEIM'
      ]
    }
    nombres_fases = fases_por_tipo.get(tipo, fases_por_tipo['Básico'])

    for orden, nombre in enumerate(nombres_fases, start=1):
        fase = models.Fase(
            proyecto_id=proyecto_id,
            nombre=nombre,
            orden=orden,
            fase_completada=False
        )
        db.add(fase)


# POST: agregar proyecto
@app1.post("/proyectos", response_model=ProyectoResponse)
def add_proyecto(nuevo_proyecto: NuevoProyecto, db: Session = Depends(get_db)):
    #Contar proyectos activos
    proyectos_activos = db.query(models.Proyecto).filter(
        models.Proyecto.estado.notin_(['Aprobado', 'Rechazado'])
    ).count()

    # Generar código
    año = datetime.now().year
    ultimo_proyecto_num = db.query(models.Proyecto).count()
    codigo = f"IMIV-{año}-{(ultimo_proyecto_num + 1):04d}"

    #Calcular estimación
    estimacion_dias = calcular_estimacion_dinamica(nuevo_proyecto.tipo, proyectos_activos)

    # Crear el proyecto con todos los campos correctos
    db_proyecto = models.Proyecto(
        codigo=codigo,
        nombre=nuevo_proyecto.nombre,
        cliente=nuevo_proyecto.cliente,
        tipo=nuevo_proyecto.tipo,
        ubicacion=nuevo_proyecto.ubicacion,
        fecha_registro=datetime.now(),
        fecha_compromiso=datetime.fromisoformat(nuevo_proyecto.fecha_compromiso),
        estado="Iniciado",
        estimacion_inicial_dias=estimacion_dias,
        estimacion_ajustada_dias=estimacion_dias,
        avance=0.0
    )

    db.add(db_proyecto)
    db.commit()
    db.refresh(db_proyecto)

    # Generar las fases EN LA TABLA DE FASES
    generar_fases_reales(nuevo_proyecto.tipo, db_proyecto.id, db)
    db.commit()

    return db_proyecto


# GET: listar proyectos
@app1.get("/proyectos", response_model=List[ProyectoResponse])
def listar_proyectos(db: Session = Depends(get_db)):
    proyectos = db.query(models.Proyecto).all()
    # Convertir fechas a ISO string para compatibilidad con frontend
    for proyecto in proyectos:
        proyecto.fecha_registro = proyecto.fecha_registro.isoformat()
        proyecto.fecha_compromiso = proyecto.fecha_compromiso.isoformat()
    return proyectos


# GET: obtener proyecto por ID
@app1.get("/proyectos/{proyecto_id}", response_model=ProyectoResponse)
def obtener_proyecto(proyecto_id: int, db: Session = Depends(get_db)):
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    proyecto.fecha_registro = proyecto.fecha_registro.isoformat()
    proyecto.fecha_compromiso = proyecto.fecha_compromiso.isoformat()
    return proyecto

# PUT: actualizar estado del proyecto
@app1.put("/proyectos/{proyecto_id}/estado", response_model=ProyectoResponse)
def actualizar_estado_proyecto(proyecto_id: int, data: ActualizarEstado, db: Session = Depends(get_db)):
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Validar que el estado sea válido
    estados_validos = ['Iniciado', 'En Desarrollo', 'Subido a SEIM', 'En Corrección', 
                       'En Evaluación SEREMITT', 'Aprobado', 'Rechazado']
    if data.estado not in estados_validos:
        raise HTTPException(status_code=400, detail=f"Estado inválido: {data.estado}")
    
    proyecto.estado = data.estado
    db.commit()
    db.refresh(proyecto)
    
    proyecto.fecha_registro = proyecto.fecha_registro.isoformat()
    proyecto.fecha_compromiso = proyecto.fecha_compromiso.isoformat()
    return proyecto

# ===== NUEVOS ENDPOINTS PARA FASES =====

# GET: obtener fases de un proyecto
@app1.get("/proyectos/{proyecto_id}/fases", response_model=List[FaseResponse])
def obtener_fases_proyecto(proyecto_id: int, db: Session = Depends(get_db)):
    # Verificar que el proyecto existe
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Obtener fases ordenadas
    fases = db.query(models.Fase).filter(
        models.Fase.proyecto_id == proyecto_id
    ).order_by(models.Fase.orden).all()
    
    # Convertir fechas a ISO string
    for fase in fases:
        if fase.fecha_inicio_real:
            fase.fecha_inicio_real = fase.fecha_inicio_real.isoformat()
        if fase.fecha_fin_real:
            fase.fecha_fin_real = fase.fecha_fin_real.isoformat()
    
    return fases

# PATCH: actualizar estado de una fase
@app1.patch("/fases/{fase_id}", response_model=FaseResponse)
def actualizar_fase(fase_id: int, data: ActualizarFase, db: Session = Depends(get_db)):
    fase = db.query(models.Fase).filter(models.Fase.id == fase_id).first()
    if not fase:
        raise HTTPException(status_code=404, detail="Fase no encontrada")
    
    fase.fase_completada = data.fase_completada
    
    # Si se marca como completada, registrar fecha de fin
    if data.fase_completada and not fase.fecha_fin_real:
        fase.fecha_fin_real = datetime.now().date()
        if not fase.fecha_inicio_real:
            fase.fecha_inicio_real = datetime.now().date()
    
    db.commit()
    db.refresh(fase)
    
    # Convertir fechas a ISO string
    if fase.fecha_inicio_real:
        fase.fecha_inicio_real = fase.fecha_inicio_real.isoformat()
    if fase.fecha_fin_real:
        fase.fecha_fin_real = fase.fecha_fin_real.isoformat()
    
    # Actualizar avance del proyecto
    actualizar_avance_proyecto(fase.proyecto_id, db)
    
    return fase

def actualizar_avance_proyecto(proyecto_id: int, db: Session):
    """Calcula y actualiza el avance del proyecto basado en fases completadas"""
    total_fases = db.query(models.Fase).filter(
        models.Fase.proyecto_id == proyecto_id
    ).count()
    
    fases_completadas = db.query(models.Fase).filter(
        models.Fase.proyecto_id == proyecto_id,
        models.Fase.fase_completada == True
    ).count()
    
    if total_fases > 0:
        avance = (fases_completadas / total_fases) * 100
        proyecto = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
        if proyecto:
            proyecto.avance = round(avance, 2)
            db.commit()

# GET: obtener profesionales
@app1.get("/profesionales")
def listar_profesionales(db: Session = Depends(get_db)):
    return db.query(models.Profesional).all()


# DELETE: eliminar proyecto
@app1.delete("/proyectos/{proyecto_id}")
def eliminar_proyecto(proyecto_id: int, db: Session = Depends(get_db)):
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    db.delete(proyecto)
    db.commit()
    return {"message": f"Proyecto {proyecto.codigo} eliminado correctamente"}