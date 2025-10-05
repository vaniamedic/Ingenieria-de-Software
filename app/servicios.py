from app.objetos import Proyecto
from app.database import guardar_proyecto

#Servicios proyecto 
def registrar_proyecto():
    print("\n=== REGISTRO DE NUEVO PROYECTO ===")
    nombre = input("Nombre del proyecto: ")
    descripcion = input("Descripción breve: ")
    ubicacion=input("Ubicacion: ")
    cliente=input("Cliente: ")

    dificultad = input("Dificultad (1:baja / 2:media / 3:alta):")
    estado =input("Estado (1:inicio, 2:revision, 3:correccion, 4:resolucion, 5:cerrado:aprobado, 6:cerrado:rechazado):")
    activo =input("Proyecto Activo: 0:No 1:Si")

    fecha_creacion_objeto=[]
    fecha_inicio_proyecto=input("Fecha de inicio del proyecto:")
    fecha_cierre_proyecto=input("Fecha de cierre del proyecto (0 si es que sigue pendiente):")
    duracion_estimada = input("Duracion estimada") #este tengo que ver como sacarlo porque se debe hacer automatico

    nuevo_proyecto = Proyecto(nombre, descripcion, ubicacion, cliente,dificultad,estado, activo,fecha_creacion_objeto,fecha_inicio_proyecto, fecha_cierre_proyecto, duracion_estimada)
    guardar_proyecto(nuevo_proyecto)
    print(f"\n✅ Proyecto '{nuevo_proyecto.nombre}' guardado exitosamente.\n")

def actualizar_proyecto():
    ()

def ver_proyecto():
    ()

def seguimiento_proyecto():
    print("\n====== FALTA HACER ==========")

def dashboard_activo(): #dashboard de proyectos activos
    print("\n====== FALTA HACER ==========")


#Servicios estimar tiempo

def estimar_tiempo():

    print("\n====== FALTA HACER ==========")