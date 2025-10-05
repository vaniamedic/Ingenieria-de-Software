#ESTE ARCHIVO PEGA LOS PROYECTOS EN LA BASE DE DATOS

import json
from pathlib import Path
import os

DATA_PATH = Path("data/proyectos.json")

 
def cargar_proyectos():
    if not os.path.exists(DATA_PATH):
        return []  # Si no existe, devolvemos lista vacía

    with open(DATA_PATH, "r") as f:
        try:
            contenido = f.read().strip()
            if not contenido:  # Si está vacío
                return []
            return json.loads(contenido)
        except json.JSONDecodeError:
            return []  # Si está dañado o malformado

def guardar_proyecto(proyecto):
    """Guarda un nuevo proyecto en el archivo JSON."""
    proyectos = cargar_proyectos()
    proyectos.append(proyecto.to_dict())
    DATA_PATH.parent.mkdir(exist_ok=True)  # Asegura que la carpeta exista
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(proyectos, f, indent=4, ensure_ascii=False)