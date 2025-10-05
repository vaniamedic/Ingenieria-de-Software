from app.servicios import registrar_proyecto, estimar_tiempo


def menu():
    print("\n=== GESTOR DE PROYECTOS ===")
    print("1. Registrar nuevo proyecto")
    print("2. Estimar tiempo de proyecto")
    print("3. Salir")
    return input("Seleccione una opción: ")

def main():
    while True:
        opcion = menu()
        if opcion == "1":
            registrar_proyecto()
        elif opcion == "2":
            estimar_tiempo()
        elif opcion == "3":
            print("Saliendo del sistema...")
            break
        else:
            print("Opción inválida, intente de nuevo.")

if __name__ == "__main__":
    main()