from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()

# Enums que coinciden con tu BD
class EstadoProyectoEnum(str, enum.Enum):
    INICIADO = "Iniciado"
    EN_DESARROLLO = "En Desarrollo"
    SUBIDO_A_SEIM = "Subido a SEIM"
    EN_CORRECCION = "En Corrección"
    EN_EVALUACION_SEREMITT = "En Evaluación SEREMITT"
    APROBADO = "Aprobado"
    RECHAZADO = "Rechazado"

class TipoAlertaEnum(str, enum.Enum):
    RETRASO_CRITICO = "retraso_critico"
    VENCIMIENTO_PROXIMO = "vencimiento_proximo"
    SEREMITT_URGENTE = "seremitt_urgente"

class SeveridadAlertaEnum(str, enum.Enum):
    CRITICO = "critico"
    ADVERTENCIA = "advertencia"
    EXITO = "exito"
    INFORMATIVA = "informativa"

class Proyecto(Base):
    __tablename__ = "proyectos"
    
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), unique=True, nullable=False)
    nombre = Column(String(255), nullable=False)
    tipo = Column(String(20), nullable=False)
    cliente = Column(String(150), nullable=False)
    ubicacion = Column(Text, nullable=False)
    estado = Column(String(50), nullable=False, default="Iniciado")
    
    # Fechas
    fecha_registro = Column(DateTime(timezone=True), nullable=False)
    fecha_compromiso = Column(Date, nullable=False)
    
    # Estimaciones
    estimacion_inicial_dias = Column(Integer, nullable=False)
    estimacion_ajustada_dias = Column(Integer, nullable=True)
    justificacion_ajuste = Column(Text, nullable=True)
    
    # Seguimiento
    avance = Column(Float, default=0.0)
    
    # Relaciones
    profesional_lider_id = Column(Integer, ForeignKey('profesionales.id', ondelete='SET NULL'), nullable=True)
    
    # Relationships
    fases = relationship("Fase", back_populates="proyecto", cascade="all, delete-orphan")
    observaciones = relationship("ObservacionSeremitt", back_populates="proyecto", cascade="all, delete-orphan")
    alertas = relationship("Alerta", back_populates="proyecto", cascade="all, delete-orphan")
    profesional_lider = relationship("Profesional", back_populates="proyectos_liderados")

class Fase(Base):
    __tablename__ = "fases"
    
    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey('proyectos.id', ondelete='CASCADE'), nullable=False)
    nombre = Column(String(255), nullable=False)
    orden = Column(Integer, nullable=False)
    fase_completada = Column(Boolean, default=False)
    fecha_inicio_real = Column(Date, nullable=True)
    fecha_fin_real = Column(Date, nullable=True)
    
    # Relationship
    proyecto = relationship("Proyecto", back_populates="fases")

class ObservacionSeremitt(Base):
    __tablename__ = "observaciones_seremitt"
    
    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey('proyectos.id', ondelete='CASCADE'), nullable=False)
    ciclo = Column(Integer, nullable=False, default=1)
    etapa_actual = Column(String(100), nullable=True)
    fecha_recepcion_observaciones = Column(Date, nullable=False)
    plazo_maximo_dias = Column(Integer, nullable=False)
    fecha_vencimiento = Column(Date, nullable=False)
    fecha_reenvio = Column(Date, nullable=True)
    
    # Relationship
    proyecto = relationship("Proyecto", back_populates="observaciones")

class Alerta(Base):
    __tablename__ = "alertas"
    
    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey('proyectos.id', ondelete='CASCADE'), nullable=False)
    tipo_alerta = Column(String(50), nullable=False)
    severidad = Column(String(50), nullable=False)
    mensaje = Column(Text, nullable=False)
    revisada = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime(timezone=True), nullable=False)
    
    # Relationship
    proyecto = relationship("Proyecto", back_populates="alertas")

class Profesional(Base):
    __tablename__ = "profesionales"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre_completo = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    rol = Column(String(50), nullable=True)
    disponibilidad = Column(Float, default=1.0)
    fecha_creacion = Column(DateTime(timezone=True), nullable=False)
    
    # Relationships
    proyectos_liderados = relationship("Proyecto", back_populates="profesional_lider")
    asignaciones = relationship("Asignacion", back_populates="profesional", cascade="all, delete-orphan")

class Asignacion(Base):
    __tablename__ = "asignaciones"
    
    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey('proyectos.id', ondelete='CASCADE'), nullable=False)
    profesional_id = Column(Integer, ForeignKey('profesionales.id', ondelete='CASCADE'), nullable=False)
    rol_en_proyecto = Column(Text, nullable=True)
    
    # Relationships
    profesional = relationship("Profesional", back_populates="asignaciones")