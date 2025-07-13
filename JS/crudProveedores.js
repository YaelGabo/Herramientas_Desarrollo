    // Registrar nuevo proveedor
    const btnGuardarProveedor = document.getElementById('btnGuardarProveedor');
    if (btnGuardarProveedor) {
        btnGuardarProveedor.onclick = function() {
            const nombre = document.getElementById('proveedorNombre').value;
            const ruc = document.getElementById('proveedorRuc').value;
            const direccion = document.getElementById('proveedorDireccion').value;
            const telefono = document.getElementById('proveedorTelefono').value;
            if (!nombre || !ruc || !direccion) {
                mostrarToast('Por favor, completa todos los campos obligatorios.');
                return;
            }
            const proveedor = { nombre, ruc, direccion, telefono };
            fetch('../PHP/insertar_proveedor.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proveedor)
            })
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    // Ocultar el modal
                    var modal = bootstrap.Modal.getInstance(document.getElementById('modalProveedor'));
                    if (modal) modal.hide();
                    // Limpiar formulario
                    document.getElementById('formularioProveedor').reset();
                    // Recargar la tabla
                    cargarProveedores();
                    mostrarToast('Proveedor registrado correctamente');
                } else {
                    mostrarToast('Error: ' + (res.error || 'No se pudo registrar.'));
                }
            })
            .catch(() => mostrarToast('Error de conexión al registrar proveedor.'));
        };
    }
document.addEventListener("DOMContentLoaded", function () {
    const btnMostrarProveedores = document.getElementById("btnMostrarProveedores");
    const tablaProveedores = document.getElementById("tablaProveedores");
    const proveedoresBody = document.getElementById("tablaProveedoresBody");

    // Ocultar tabla al cargar
    if (tablaProveedores) {
        tablaProveedores.style.display = "none";
    }

    // Mostrar tabla y cargar proveedores al cargar la página
    if (tablaProveedores) {
        tablaProveedores.style.display = "table";
        cargarProveedores();
    }
    // Mostrar/ocultar tabla con el botón y cambiar ícono
    if (btnMostrarProveedores && tablaProveedores) {
        btnMostrarProveedores.innerHTML = '<i class="fa fa-eye"></i> Mostrar Proveedores';
        btnMostrarProveedores.addEventListener("click", function () {
            if (tablaProveedores.style.display === "none" || tablaProveedores.style.display === "") {
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
                <tr data-id="${proveedor.id_proveedor}">
                    <td>${proveedor.id_proveedor}</td>
                    <td contenteditable="false">${proveedor.nombre}</td>
                    <td contenteditable="false">${proveedor.ruc}</td>
                    <td contenteditable="false">${proveedor.direccion}</td>
                    <td contenteditable="false">${proveedor.telefono}</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn-editar">Editar</button>
                        <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
                    </td>
                </tr>
            `;
            proveedoresBody.innerHTML += row;
        });
        agregarEventosCRUDProveedores();
    }

    function agregarEventosCRUDProveedores() {
        // Eliminar proveedor
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.onclick = function() {
                const fila = this.closest('tr');
                const id = fila.getAttribute('data-id');
                if (confirm('¿Seguro que deseas eliminar este proveedor?')) {
                    fetch('../PHP/eliminar_proveedor.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'id_proveedor=' + encodeURIComponent(id)
                    })
                    .then(r => r.json())
                    .then(res => {
                        if (res.success) fila.remove();
                        else alert('Error: ' + (res.error || 'No se pudo eliminar.'));
                    });
                }
            };
        });

        // Editar proveedor con modal
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.onclick = function() {
                const fila = this.closest('tr');
                const tds = fila.querySelectorAll('td');
                // Rellenar el modal con los datos del proveedor
                document.getElementById('editProveedorId').value = tds[0].textContent;
                document.getElementById('editProveedorNombre').value = tds[1].textContent;
                document.getElementById('editProveedorRuc').value = tds[2].textContent;
                document.getElementById('editProveedorDireccion').value = tds[3].textContent;
                document.getElementById('editProveedorTelefono').value = tds[4].textContent;
                // Mostrar el modal
                var modal = new bootstrap.Modal(document.getElementById('modalEditarProveedor'));
                modal.show();
            };
        });
    }

    // Evento robusto para actualizar proveedor desde el modal
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'btnActualizarProveedor') {
            const id = document.getElementById('editProveedorId').value;
            const nombre = document.getElementById('editProveedorNombre').value.trim();
            const ruc = document.getElementById('editProveedorRuc').value.trim();
            const direccion = document.getElementById('editProveedorDireccion').value.trim();
            const telefono = document.getElementById('editProveedorTelefono').value.trim();
            if (!nombre || !ruc || !direccion) {
                mostrarToast('Por favor, completa todos los campos obligatorios.');
                return;
            }
            const proveedor = { id_proveedor: id, nombre, ruc, direccion, telefono };
            fetch('../PHP/editar_proveedor.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proveedor)
            })
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    // Ocultar el modal
                    var modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarProveedor'));
                    if (modal) modal.hide();
                    // Recargar la tabla
                    cargarProveedores();
                    mostrarToast('Proveedor actualizado correctamente');
                } else {
                    mostrarToast('Error: ' + (res.error || 'No se pudo editar.'));
                }
            })
            .catch(() => mostrarToast('Error de conexión al editar proveedor.'));
        }
    });

    // Toast de notificación
    function mostrarToast(mensaje) {
        const toastEl = document.getElementById('notificationToast');
        if (toastEl) {
            toastEl.querySelector('.toast-body').textContent = mensaje;
            var toast = new bootstrap.Toast(toastEl);
            toast.show();
        } else {
            alert(mensaje);
        }
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
