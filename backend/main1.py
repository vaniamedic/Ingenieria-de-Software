
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from backend.database import engine, SessionLocal
from backend.schemas import NuevoProyecto, ProyectoResponse
from backend import models
import uuid

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


# Función auxiliar para calcular estimación de días según tipo
def calcular_estimacion_dias(tipo: str) -> int:
    estimaciones = {
        "básico": 30,
        "Básico": 30,
        "intermedio": 60,
        "Intermedio": 60,
        "avanzado": 90,
        "Avanzado": 90,
        "mayor": 90,
        "Mayor": 90
    }
    return estimaciones.get(tipo, 45)


# Función auxiliar para generar fases según tipo
def generar_fases(tipo: str) -> list:
    fases_por_tipo = {
        "básico": [
            {"nombre": "Análisis", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Diseño", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Implementación", "completada": False, "fechaInicio": None, "fechaFin": None}
        ],
        "Básico": [
            {"nombre": "Análisis", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Diseño", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Implementación", "completada": False, "fechaInicio": None, "fechaFin": None}
        ],
        "intermedio": [
            {"nombre": "Planificación", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Análisis", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Diseño", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Implementación", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Testing", "completada": False, "fechaInicio": None, "fechaFin": None}
        ],
        "Intermedio": [
            {"nombre": "Planificación", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Análisis", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Diseño", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Implementación", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Testing", "completada": False, "fechaInicio": None, "fechaFin": None}
        ],
        "avanzado": [
            {"nombre": "Estudio de factibilidad", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Planificación", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Análisis", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Diseño", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Implementación", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Testing", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Control de calidad", "completada": False, "fechaInicio": None, "fechaFin": None}
        ],
        "Avanzado": [
            {"nombre": "Estudio de factibilidad", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Planificación", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Análisis", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Diseño", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Implementación", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Testing", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Control de calidad", "completada": False, "fechaInicio": None, "fechaFin": None}
        ],
        "Mayor": [
            {"nombre": "Estudio de factibilidad", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Planificación", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Análisis", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Diseño", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Implementación", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Testing", "completada": False, "fechaInicio": None, "fechaFin": None},
            {"nombre": "Control de calidad", "completada": False, "fechaInicio": None, "fechaFin": None}
        ]
    }
    return fases_por_tipo.get(tipo, fases_por_tipo["básico"])


# POST: agregar proyecto
@app1.post("/proyectos", response_model=ProyectoResponse)
def add_proyecto(nuevo_proyecto: NuevoProyecto, db: Session = Depends(get_db)):
    # Generar código único
    codigo = f"PRJ-{str(uuid.uuid4())[:8].upper()}"
    
    # Fecha de registro actual
    fecha_registro = datetime.now().isoformat()
    
    # Calcular estimación de días según tipo
    estimacion_dias = calcular_estimacion_dias(nuevo_proyecto.tipo)
    
    # Generar fases según tipo
    fases = generar_fases(nuevo_proyecto.tipo)
    
    # Crear el proyecto con todos los campos
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
        estimacionAjustada=estimacion_dias,
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
    
    # Actualizar solo los campos que vienen en el request
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





"""
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import datetime
from sqlalchemy.orm import Session
from backend.database import  engine, SessionLocal
from backend.schemas import NuevoProyecto, ProyectoBase, Fase
from backend import models
from backend import schemas
#import schemas
import uuid



# Crear tablas en la BD si no existen
models.Base.metadata.create_all(bind=engine)

app1 = FastAPI()

# CORS para permitir conexión desde tu frontend
app1.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o puedes poner ["http://localhost:5173"] si quieres restringir
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



proyectosss = [
    {
        "codigo": "PRJ-001",
        "nombre": "Optimización Logística",
        "cliente": "Transporte del Sur",
        "tipo": "Básico",
        "ubicacion": "Santiago",
        "fechaRegistro": "2025-10-09T10:00:00",
        "fechaCompromiso": "2025-12-01T00:00:00",
        "estado": "En Desarrollo",
        "estimacionDias": 45,
        "estimacionAjustada": 50,
        "avance": 20,
        "fases": ["Análisis", "Diseño"],
        "observacionesSEREMITT": None,
        "profesionalAsignado": "Carlos Díaz"
    },
    {
        "codigo": "PRJ-002",
        "nombre": "Automatización Planta",
        "cliente": "AgroChile",
        "tipo": "Intermedio",
        "ubicacion": "Curicó",
        "fechaRegistro": "2025-09-15T09:00:00",
        "fechaCompromiso": "2025-11-30T00:00:00",
        "estado": "En Revisión",
        "estimacionDias": 60,
        "estimacionAjustada": 62,
        "avance": 40,
        "fases": ["Planificación", "Implementación"],
        "observacionesSEREMITT": "Requiere inspección adicional",
        "profesionalAsignado": "María Torres"
    },
    {
        "codigo": "PRJ-003",
        "nombre": "Sistema de Energía Solar",
        "cliente": "EcoPower",
        "tipo": "Mayor",
        "ubicacion": "Antofagasta",
        "fechaRegistro": "2025-08-10T14:00:00",
        "fechaCompromiso": "2025-12-20T00:00:00",
        "estado": "Finalizado",
        "estimacionDias": 90,
        "estimacionAjustada": 95,
        "avance": 100,
        "fases": ["Diseño", "Instalación", "Pruebas"],
        "observacionesSEREMITT": "Cumplió todos los estándares",
        "profesionalAsignado": "Laura Fuentes"
    },
    {
        "codigo": "PRJ-004",
        "nombre": "voy en rechazado",
        "cliente": "RetailMax",
        "tipo": "Intermedio",
        "ubicacion": "Valparaíso",
        "fechaRegistro": "2025-09-20T11:00:00",
        "fechaCompromiso": "2025-11-25T00:00:00",
        "estado": "Rechazado",
        "estimacionDias": 55,
        "estimacionAjustada": 58,
        "avance": 30,
        "fases": ["Análisis", "Desarrollo", "Testing"],
        "observacionesSEREMITT": None,
        "profesionalAsignado": "Pedro Herrera"
    },
    {
        "codigo": "PRJ-005",
        "nombre": "voy en enviado",
        "cliente": "Metalúrgica del Norte",
        "tipo": "Mayor",
        "ubicacion": "Iquique",
        "fechaRegistro": "2025-07-01T08:00:00",
        "fechaCompromiso": "2025-10-15T00:00:00",
        "estado": "Enviado",
        "estimacionDias": 80,
        "estimacionAjustada": 85,
        "avance": 60,
        "fases": ["Análisis", "Implementación", "Control de calidad"],
        "observacionesSEREMITT": "Pendiente validación eléctrica",
        "profesionalAsignado": "Andrea Silva"
    }
]

"""

@app1.post("/proyectos") #si funciona
def add_proyecto(data: dict):
    #return {"message": "Proyecto recibido", "data": data}

    # Agregar el nuevo proyecto a la lista
    proyectos.append(data)

    # Mostrar en la consola del servidor para verificar
    print("🔹 Nuevo proyecto agregado:", data)
    print("📦 Total de proyectos guardados:", len(proyectos))
    print(proyectos)

    # Responder al frontend
    return {
        "message": "Proyecto guardado correctamente",
        "total_proyectos": len(proyectos),
        "data": data
    }

@app1.get("/proyectos")
def listar_proyectos():
    return proyectos

"""
# POST: agregar proyecto
@app1.post("/proyectos", response_model=schemas.ProyectoResponse)
def add_proyecto(proyecto: schemas.ProyectoCreate, db: Session = Depends(get_db)):

    db_proyecto = models.Proyecto(**proyecto.dict())
    db.add(db_proyecto)
    db.commit()
    db.refresh(db_proyecto)
    return db_proyecto
    
# GET: listar proyectos
@app1.get("/proyectos", response_model=list[schemas.ProyectoResponse])
def listar_proyectos(db: Session = Depends(get_db)):
    return db.query(models.Proyecto).all()

@app1.get("/proyectos/{codigo}", response_model=schemas.ProyectoResponse)
def obtener_proyecto(codigo: str, db: Session = Depends(get_db)):
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.codigo == codigo).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return proyecto """