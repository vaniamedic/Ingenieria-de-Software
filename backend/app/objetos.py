import datetime
import uuid

class Proyecto:
    def __init__(self, nombre, descripcion, ubicacion, cliente, dificultad, estado,activo,fecha_creacion_objeto,
                 fecha_inicio_proyecto, fecha_cierre_proyecto, duracion_estimada):
        self.id = str(uuid.uuid4())  # Identificador único
        self.nombre = nombre
        self.descripcion = descripcion
        self.ubicacion = ubicacion #Santiago, Viña del mar, etc
        self.cliente = cliente #crear codigo cliente

        self.dificultad = int(dificultad)  # 1:"basica", 2:"intermedia", 3:"mayor"
        self.estado = int(estado) #1:inicio, 2:revision, 3:correccion, 4:resolucion, 5:cerrado:aprobado, 6:cerrado:rechazado
        self.activo = int(activo) #1: proyecto activo, 0: proyecto cerrado

        self.fecha_creacion_objeto = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.fecha_inicio_proyecto = fecha_inicio_proyecto
        self.fecha_cierre_proyecto = fecha_cierre_proyecto

        self.duracion_estimada = duracion_estimada
        

    def to_dict(self):
        """Convierte el objeto en un diccionario para guardarlo fácilmente."""
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "ubicacion": self.ubicacion,
            "cliente": self.cliente,

            "dificultad": self.dificultad,
            "estado": self.estado,
            "activo": self.activo,

            "fecha_creacion_objeto": self.fecha_creacion_objeto,
            "fecha_inicio_proyecto": self.fecha_inicio_proyecto,
            "fecha_cierre_proyecto": self.fecha_cierre_proyecto,
            "duracion_estimada": self.duracion_estimada,

        }