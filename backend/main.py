# main1.py

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from backend.database import engine, SessionLocal
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

    # Se usa .get() para evitar errores si llega un tipo inesperado
    tiempo_base = fases_base.get(tipo, 8) * factor_complejidad.get(tipo, 3)

    # Por cada proyecto activo, se añade un 8% de tiempo
    factor_carga = 1 + (proyectos_activos * 0.08)

    # Se retorna la estimación final redondeada
    return round(tiempo_base * factor_carga)

def generar_fases_reales(tipo: str) -> list:
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
    # Obtiene la lista de nombres de fase según el tipo
    nombres_fases = fases_por_tipo.get(tipo, fases_por_tipo['Básico'])

    # Convierte la lista de nombres en la estructura de objetos que necesita la BD
    return [
        {"nombre": nombre, "completada": False, "fechaInicio": None, "fechaFin": None}
        for nombre in nombres_fases
    ]


# POST: agregar proyecto
@app1.post("/proyectos", response_model=ProyectoResponse)
def add_proyecto(nuevo_proyecto: NuevoProyecto, db: Session = Depends(get_db)):
    # (✅ CORREGIDO) 3. Se cuentan los proyectos activos para el cálculo dinámico.
    proyectos_activos = db.query(models.Proyecto).filter(
        models.Proyecto.estado.notin_(['Aprobado', 'Rechazado'])
    ).count()

    # Generar código (este formato lo puedes ajustar si quieres el tuyo de IMIV-AÑO-NUM)
    año = datetime.now().year
    ultimo_proyecto_num = db.query(models.Proyecto).count()
    codigo = f"IMIV-{año}-{(ultimo_proyecto_num + 1):04d}"

    fecha_registro = datetime.now().isoformat()

    # (✅ CORREGIDO) 4. Se usan las nuevas funciones para obtener los datos correctos.
    estimacion_dias = calcular_estimacion_dinamica(nuevo_proyecto.tipo, proyectos_activos)
    fases = generar_fases_reales(nuevo_proyecto.tipo)

    # Crear el proyecto con todos los campos correctos
    db_proyecto = models.Proyecto(
        codigo=codigo,
        nombre=nuevo_proyecto.nombre,
        cliente=nuevo_proyecto.cliente,
        tipo=nuevo_proyecto.tipo,
        ubicacion=nuevo_proyecto.ubicacion,
        fechaRegistro=fecha_registro,
        fechaCompromiso=nuevo_proyecto.fechaCompromiso,
        estado="En Desarrollo",
        estimacionDias=estimacion_dias,
        estimacionAjustada=estimacion_dias, # Inicialmente la ajustada es igual a la estimada
        avance=0.0,
        fases=fases,
        observacionesSEREMITT=None,
        profesionalAsignado=None,
        justificacionAjuste=None
    )

    db.add(db_proyecto)
    db.commit()
    db.refresh(db_proyecto)

    return db_proyecto


# GET: listar proyectos
@app1.get("/proyectos", response_model=list[ProyectoResponse])
def listar_proyectos(db: Session = Depends(get_db)):
    return db.query(models.Proyecto).all()


# GET: obtener proyecto por código
@app1.get("/proyectos/{codigo}", response_model=ProyectoResponse)
def obtener_proyecto(codigo: str, db: Session = Depends(get_db)):
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.codigo == codigo).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return proyecto


# PUT: actualizar proyecto
@app1.put("/proyectos/{codigo}", response_model=ProyectoResponse)
def actualizar_proyecto(codigo: str, proyecto_actualizado: dict, db: Session = Depends(get_db)):
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.codigo == codigo).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    for key, value in proyecto_actualizado.items():
        if hasattr(proyecto, key):
            setattr(proyecto, key, value)

    db.commit()
    db.refresh(proyecto)
    return proyecto


# DELETE: eliminar proyecto
@app1.delete("/proyectos/{codigo}")
def eliminar_proyecto(codigo: str, db: Session = Depends(get_db)):
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.codigo == codigo).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    db.delete(proyecto)
    db.commit()
    return {"message": f"Proyecto {codigo} eliminado correctamente"}