// Registrar nuevo proveedor
const btnGuardarProveedor = document.getElementById('btnGuardarProveedor');
if (btnGuardarProveedor) {
    btnGuardarProveedor.onclick = function () {
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
                    var modal = bootstrap.Modal.getInstance(document.getElementById('modalProveedor'));
                    if (modal) modal.hide();
                    document.getElementById('formularioProveedor').reset();
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

    if (tablaProveedores) {
        tablaProveedores.style.display = "none";
    }

    if (tablaProveedores) {
        tablaProveedores.style.display = "table";
        cargarProveedores();
    }

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
                    <td>${proveedor.nombre}</td>
                    <td>${proveedor.ruc}</td>
                    <td>${proveedor.direccion}</td>
                    <td>${proveedor.telefono}</td>
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
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.onclick = function () {
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

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.onclick = function () {
                const fila = this.closest('tr');
                const tds = fila.querySelectorAll('td');
                const valoresOriginales = Array.from(tds).slice(1, 5).map(td => td.textContent);
                fila.dataset.original = JSON.stringify(valoresOriginales);

                for (let i = 1; i <= 4; i++) {
                    const valor = tds[i].textContent;
                    tds[i].innerHTML = `<input type="text" class="form-control form-control-sm" value="${valor}">`;
                }

                tds[5].innerHTML = `
                    <button class="btn btn-success btn-sm btn-guardar">Guardar</button>
                    <button class="btn btn-secondary btn-sm btn-cancelar">Cancelar</button>
                `;
            };
        });

        // Evento delegado para guardar cambios
        proveedoresBody.addEventListener('click', function (e) {
            if (e.target.classList.contains('btn-guardar')) {
                const fila = e.target.closest('tr');
                const id = fila.getAttribute('data-id');
                const inputs = fila.querySelectorAll('input');
                const nombre = inputs[0].value;
                const ruc = inputs[1].value;
                const direccion = inputs[2].value;
                const telefono = inputs[3].value;

                const proveedor = { id_proveedor: id, nombre, ruc, direccion, telefono };

                fetch('../PHP/editar_proveedor.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(proveedor)
                })
                    .then(r => r.json())
                    .then(res => {
                        if (res.success) {
                            cargarProveedores();
                            mostrarToast('Proveedor actualizado correctamente');
                        } else {
                            mostrarToast('Error: ' + (res.error || 'No se pudo editar.'));
                        }
                    })
                    .catch(() => mostrarToast('Error de conexión al editar proveedor.'));
            }

            if (e.target.classList.contains('btn-cancelar')) {
                const fila = e.target.closest('tr');
                const tds = fila.querySelectorAll('td');
                const originales = JSON.parse(fila.dataset.original);
                for (let i = 1; i <= 4; i++) {
                    tds[i].textContent = originales[i - 1];
                }
                tds[5].innerHTML = `
                    <button class="btn btn-warning btn-sm btn-editar">Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
                `;
                agregarEventosCRUDProveedores(); // volver a enganchar los eventos
            }
        });
    }

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
