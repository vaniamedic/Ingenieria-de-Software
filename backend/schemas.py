from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# ✅ Modelo de Fase (fase individual del proyecto)
class Fase(BaseModel):
    nombre: str
    completada: bool
    fechaInicio: Optional[str] = None
    fechaFin: Optional[str] = None


# ✅ Modelo de observaciones de SEREMITT
class ObservacionesSEREMITT(BaseModel):
    plazoMaximo: Optional[int] = 0
    fechaVencimiento: Optional[str] = None
    observaciones: Optional[str] = None


# ✅ Modelo base: campos llenados desde el formulario
class NuevoProyecto(BaseModel):
    nombre: str
    cliente: str
    tipo: str  # "básico", "intermedio" o "avanzado"
    ubicacion: str
    fechaCompromiso: str


# ✅ Modelo completo que devuelve la API
class ProyectoBase(BaseModel):
    codigo: str
    nombre: str
    cliente: str
    tipo: str
    ubicacion: str
    fechaRegistro: str
    fechaCompromiso: str
    estado: str
    estimacionDias: int
    estimacionAjustada: int
    avance: float
    fases: List[Dict[str, Any]]
    observacionesSEREMITT: Optional[Dict[str, Any]] = None
    profesionalAsignado: Optional[str] = None
    justificacionAjuste: Optional[str] = None


class ProyectoCreate(ProyectoBase):
    pass


class ProyectoResponse(BaseModel):
    id: int
    codigo: str
    nombre: str
    cliente: str
    tipo: str
    ubicacion: str
    fechaRegistro: str
    fechaCompromiso: str
    estado: str
    estimacionDias: int
    estimacionAjustada: int
    avance: float
    fases: Optional[List[Dict[str, Any]]] = None
    observacionesSEREMITT: Optional[Dict[str, Any]] = None
    profesionalAsignado: Optional[str] = None
    justificacionAjuste: Optional[str] = None

    class Config:
        from_attributes = True