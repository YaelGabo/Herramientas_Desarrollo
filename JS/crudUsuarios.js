
// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Referencias a elementos del DOM
    const btnMostrarUsuarios = document.getElementById("btnMostrarUsuarios");
    const tablaUsuarios = document.getElementById("tablaUsuarios");
    const usuariosBody = document.getElementById("tablaUsuariosBody");
    const btnGuardarColaborador = document.getElementById("btnGuardarColaborador");
    const btnActualizarColaborador = document.getElementById("btnActualizarColaborador");
    const notificationToast = document.getElementById('notificationToast');

    // Crear instancia de Toast
    const toast = new bootstrap.Toast(notificationToast);

    // Función para mostrar notificaciones
    function showNotification(message, isError = false) {
        const toastBody = notificationToast.querySelector('.toast-body');
        toastBody.textContent = message;
        notificationToast.classList.toggle('bg-danger', isError);
        notificationToast.classList.toggle('text-white', isError);
        toast.show();
    }

    // Ocultar tabla al cargar
    if (tablaUsuarios) {
        tablaUsuarios.style.display = "none";
    }

    // Mostrar u ocultar tabla al hacer clic
    if (btnMostrarUsuarios && tablaUsuarios) {
        btnMostrarUsuarios.addEventListener("click", function () {
            const estaOculta = tablaUsuarios.style.display === "none" || tablaUsuarios.style.display === "";
            tablaUsuarios.style.display = estaOculta ? "table" : "none";
            if (estaOculta) {
                cargarUsuarios();
                btnMostrarUsuarios.innerHTML = '<i class="fa fa-eye-slash"></i> Ocultar Usuarios';
            } else {
                btnMostrarUsuarios.innerHTML = '<i class="fa fa-eye"></i> Mostrar Usuarios';
            }
        });
    }

    // Función para cargar usuarios
    function cargarUsuarios() {
        fetch("../PHP/obtener_usuarios.php")
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    mostrarUsuarios(data);
                } else {
                    showNotification("Error al cargar usuarios: " + data.error, true);
                }
            })
            .catch(error => {
                showNotification("Error al cargar usuarios: " + error.message, true);
            });
    }

    // Función que construye y muestra la tabla con los usuarios
    function mostrarUsuarios(data) {
        usuariosBody.innerHTML = "";
        data.forEach((usuario) => {
            const row = `
                <tr data-id="${usuario.id}">
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.primerApellido}</td>
                    <td>${usuario.dni}</td>
                    <td>${usuario.direccion}</td>
                    <td>${usuario.numeroTelefonico}</td>
                    <td>${usuario.correoElectronico}</td>
                    <td>${usuario.nombreUsuario}</td>
                    <td>********</td>
                    <td>${usuario.tipoUsuario}</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn-editar">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            usuariosBody.insertAdjacentHTML('beforeend', row);
        });

        // Agregar event listeners para los botones de editar y eliminar
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                abrirModalEditar(row);
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                eliminarUsuario(row.dataset.id);
            });
        });
    }

    // Función para guardar nuevo usuario
    if (btnGuardarColaborador) {
        btnGuardarColaborador.addEventListener('click', function() {
            const formData = new FormData(document.getElementById('formularioColaborador'));
            const data = Object.fromEntries(formData);

            fetch('../PHP/insertar_usuario.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Usuario agregado exitosamente');
                    document.getElementById('formularioColaborador').reset();
                    bootstrap.Modal.getInstance(document.getElementById('modalColaborador')).hide();
                    cargarUsuarios();
                } else {
                    showNotification(data.error || 'Error al agregar usuario', true);
                }
            })
            .catch(error => {
                showNotification('Error al agregar usuario: ' + error.message, true);
            });
        });
    }

    // Función para abrir modal de edición con datos del usuario
    function abrirModalEditar(row) {
        const userId = row.dataset.id;
        const cells = row.cells;

        document.getElementById('editId').value = userId;
        document.getElementById('editNombre').value = cells[1].textContent;
        document.getElementById('editPrimerApellido').value = cells[2].textContent;
        document.getElementById('editDni').value = cells[3].textContent;
        document.getElementById('editDireccion').value = cells[4].textContent;
        document.getElementById('editNumeroTelefonico').value = cells[5].textContent;
        document.getElementById('editCorreoElectronico').value = cells[6].textContent;
        document.getElementById('editNombreUsuario').value = cells[7].textContent;
        document.getElementById('editTipoUsuario').value = cells[9].textContent;
        document.getElementById('editContrasena').value = '';
        document.getElementById('editContrasenaActual').value = '';


        // Mostrar siempre el campo contraseña actual si se quiere cambiar la contraseña
        const rowContrasenaActual = document.getElementById('rowContrasenaActual');
        rowContrasenaActual.style.display = '';
        document.getElementById('editTipoUsuario').onchange = null;

        const modal = new bootstrap.Modal(document.getElementById('modalEditarColaborador'));
        modal.show();
    }

    // Función para actualizar usuario
    if (btnActualizarColaborador) {
        btnActualizarColaborador.addEventListener('click', function() {
            const formData = new FormData(document.getElementById('formularioEditarColaborador'));
            const data = Object.fromEntries(formData);


            // Si se quiere cambiar la contraseña, debe ingresar la actual
            const nuevaContrasena = document.getElementById('editContrasena').value;
            const contrasenaActual = document.getElementById('editContrasenaActual').value;
            if (nuevaContrasena && !contrasenaActual) {
                showNotification('Debes ingresar la contraseña actual para cambiarla', true);
                return;
            }

            fetch('../PHP/editar_usuario.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Usuario actualizado exitosamente');
                    bootstrap.Modal.getInstance(document.getElementById('modalEditarColaborador')).hide();
                    cargarUsuarios();
                } else {
                    showNotification(data.error || 'Error al actualizar usuario', true);
                }
            })
            .catch(error => {
                showNotification('Error al actualizar usuario: ' + error.message, true);
            });
        });
    }

    // Función para eliminar usuario
    function eliminarUsuario(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            fetch('../PHP/eliminar_usuario.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Usuario eliminado exitosamente');
                    cargarUsuarios();
                } else {
                    showNotification(data.error || 'Error al eliminar usuario', true);
                }
            })
            .catch(error => {
                showNotification('Error al eliminar usuario: ' + error.message, true);
            });
        }
    }

    // Implementar búsqueda en tiempo real
    const buscador = document.getElementById('buscador');
    if (buscador) {
        buscador.addEventListener('input', function(e) {
            const searchText = e.target.value.toLowerCase();
            const rows = usuariosBody.getElementsByTagName('tr');
            Array.from(rows).forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchText) ? '' : 'none';
            });
        });
    }

    // Cargar usuarios automáticamente al abrir la página
    if (btnMostrarUsuarios) {
        btnMostrarUsuarios.click();
    }
});

