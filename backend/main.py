from app.servicios import registrar_proyecto, estimar_tiempo, seguimiento_proyecto, dashboard_activo


def menu():
    print("\n=== GESTOR DE PROYECTOS ===")
    print("1. Registrar nuevo proyecto")
    print("2. Seguimiento de un proyecto")
    print("3. Estimar tiempo de proyecto")
    print("4. Dashboard de Proyecto Activos")
    print("5. Salir")
    return input("Seleccione una opción: ")

def main():
    while True:
        opcion = menu()
        if opcion == "1":
            registrar_proyecto()
        elif opcion == "2":
            seguimiento_proyecto()
        elif opcion == "3":
            estimar_tiempo()
        elif opcion == "4":
            dashboard_activo()
        elif opcion == "5":
            print("Saliendo del sistema...")
            break
        else:
            print("Opción inválida, intente de nuevo.")

if __name__ == "__main__":
    main()