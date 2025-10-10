from sqlalchemy import Column, Integer, String, Float
from .database import Base
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import Column, Integer, String, Float

#models

class Proyecto(Base):
    __tablename__ = "proyectos"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String)
    nombre = Column(String)
    cliente = Column(String)
    tipo = Column(String)
    ubicacion = Column(String)
    fechaRegistro = Column(String)
    fechaCompromiso = Column(String)
    estado = Column(String)
    estimacionDias = Column(Integer)
    estimacionAjustada = Column(Integer)
    avance = Column(Float)
    
    # Usar JSON para almacenar estructuras complejas
    fases = Column(JSON, nullable=True)
    observacionesSEREMITT = Column(JSON, nullable=True)
    
    profesionalAsignado = Column(String, nullable=True)
    justificacionAjuste = Column(String, nullable=True)