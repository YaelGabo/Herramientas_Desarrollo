document.addEventListener("DOMContentLoaded", function () {
    const btnMostrarProveedores = document.getElementById("btnMostrarProveedores");
    const tablaProveedores = document.getElementById("tablaProveedores");
    const proveedoresBody = document.getElementById("tablaProveedoresBody");

    // Ocultar tabla al cargar
    if (tablaProveedores) {
        tablaProveedores.style.display = "none";
    }

    // Mostrar u ocultar tabla al hacer clic
    if (btnMostrarProveedores && tablaProveedores) {
        btnMostrarProveedores.addEventListener("click", function () {
            const estaOculta = tablaProveedores.style.display === "none" || tablaProveedores.style.display === "";

            if (estaOculta) {
                tablaProveedores.style.display = "table";
                cargarProveedores();
                btnMostrarProveedores.innerHTML = '<i class="fa fa-eye-slash"></i> Ocultar Proveedores';
            } else {
                tablaProveedores.style.display = "none";
                btnMostrarProveedores.innerHTML = '<i class="fa fa-eye"></i> Mostrar Proveedores';
            }
        });
    }

    function mostrarProveedores(data) {
        proveedoresBody.innerHTML = "";

        data.forEach((proveedor) => {
            const row = `
                <tr>
                    <td>${proveedor.id_proveedor}</td>
                    <td>${proveedor.nombre}</td>
                    <td>${proveedor.ruc}</td>
                    <td>${proveedor.direccion}</td>
                    <td>${proveedor.telefono}</td>
                </tr>
            `;
            proveedoresBody.innerHTML += row;
        });
    }

    function cargarProveedores() {
        fetch("../PHP/mostrar_provedores.php")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return response.json();
            })
            .then((data) => {
                mostrarProveedores(data);
            })
            .catch((error) => {
                console.error("Error al cargar los proveedores:", error);
            });
    }
});
