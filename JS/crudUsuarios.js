
// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    const btnMostrarUsuarios = document.getElementById("btnMostrarUsuarios");
    const tablaUsuarios = document.getElementById("tablaUsuarios");
// Asegúrate de que la tabla tenga este ID
    const usuariosBody = document.getElementById("tablaUsuariosBody");

    // Ocultar tabla al cargar
    if (tablaUsuarios) {
        tablaUsuarios.style.display = "none";
    }

    // Mostrar u ocultar tabla al hacer clic
    if (btnMostrarUsuarios && tablaUsuarios) {
        btnMostrarUsuarios.addEventListener("click", function () {
            const estaOculta = tablaUsuarios.style.display === "none" || tablaUsuarios.style.display === "";

            if (estaOculta) {
                tablaUsuarios.style.display = "table";
                cargarUsuarios();
                btnMostrarUsuarios.innerHTML = '<i class="fa fa-eye-slash"></i> Ocultar Usuarios';
            } else {
                tablaUsuarios.style.display = "none";
                btnMostrarUsuarios.innerHTML = '<i class="fa fa-eye"></i> Mostrar Usuarios';
            }
        });
    }

    // Función que construye y muestra la tabla con los usuarios
    function mostrarUsuarios(data) {
        usuariosBody.innerHTML = "";

        data.forEach((usuario) => {
            const row = `
                <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.primerApellido}</td>
                    <td>${usuario.dni}</td>
                    <td>${usuario.direccion}</td>
                    <td>${usuario.numeroTelefonico}</td>
                    <td>${usuario.correoElectronico}</td>
                    <td>${usuario.nombreUsuario}</td>
                    <td>${usuario.contrasena}</td>
                    <td>${usuario.tipoUsuario}</td>
                    
                </tr>
            `;
            usuariosBody.innerHTML += row;
        });
    }

    // Función que obtiene los usuarios desde PHP
    function cargarUsuarios() {
        fetch("../PHP/obtener_usuarios.php") // Asegura que la ruta sea correcta desde el HTML
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return response.json();
            })
            .then((data) => {
                mostrarUsuarios(data);
            })
            .catch((error) => {
                console.error("Error al cargar los usuarios:", error);
            });
    }
});



// Asociar el evento al botón después de que el DOM haya cargado
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("btnMostrarUsuarios");
    if (btn) {
        btn.addEventListener("click", cargarUsuarios);
    }
});

