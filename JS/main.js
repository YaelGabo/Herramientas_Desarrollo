document.addEventListener("DOMContentLoaded", function () {
    const btnMostrarProductos = document.getElementById("btnMostrarProductos");
    const formNuevoProducto = document.getElementById("formProducto");
    const productosBody = document.getElementById("productosBody");
    const btnGuardarProducto = document.getElementById("btnGuardarProducto");
    const btnSave = document.getElementById("btn-save");
    const btnMostrarVentas = document.getElementById("btnMostrarVentas");
    const tablaVentas = document.querySelector(".table"); // Asegúrate de que tu tabla tiene la clase 'table'
    const btnBuscarPorFechas = document.getElementById("btnBuscarPorFechas");
    
    if (btnMostrarProductos) {
        btnMostrarProductos.addEventListener("click", function () {
            cargarProductos();
        });
    }
    // 🔍 BÚSQUEDA DE PRODUCTO POR NOMBRE AL PRESIONAR ENTER
    const inputBuscar = document.getElementById("buscarProducto");
    if (inputBuscar) {
        inputBuscar.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                const termino = this.value.trim();
                if (termino !== "") {
                    buscarProductoPorNombre(termino);
                }
            }
        });
    }

    function buscarProductoPorNombre(nombre) {
        fetch("buscar_producto.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre: nombre })
        })
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => {
            console.error('Error al buscar producto:', error);
        });
    }

    function mostrarProductos(data) {
        productosBody.innerHTML = "";

        data.forEach((producto) => {
            const estadoActivo = producto.estado == 1 || producto.estado === "Activo";
            const estadoTexto = estadoActivo ? "Activo" : "Inactivo";

            const row = `
                <tr data-id="${producto.id_producto}">
                    <td>${producto.id_producto}</td>
                    <td>${producto.nombre_producto}</td>
                    <td>S/. ${producto.precio}</td>
                    <td id="stock-${producto.id_producto}">${producto.stock}</td>
                    <td>${producto.id_proveedor}</td>
                    <td>${estadoTexto}</td>
                    <td><img src="../Imagenes/${producto.imagen}" alt="${producto.nombre_producto}" style="width: 80px;"></td>
                    <td>
                        <button class="btn btn-${estadoActivo ? "warning" : "secondary"}" 
                            onclick="toggleEstadoProducto(${producto.id_producto}, ${estadoActivo ? 0 : 1})">
                            ${estadoActivo ? "Desactivar" : "Activar"}
                        </button>
                        ${estadoActivo ? `
                            <button class="btn btn-warning" onclick="editarProducto(${producto.id_producto})">Editar</button>
                            <button class="btn btn-danger" onclick="eliminarProducto(${producto.id_producto})">Eliminar</button>
                        ` : ""}
                    </td>
                </tr>
            `;
            productosBody.innerHTML += row;
        });
    }
        function cargarProductos() {
        fetch("../PHP/mostrar_productos.php")
            .then((response) => response.json())
            .then((data) => {
                mostrarProductos(data);
            })
            .catch((error) => {
                console.error("Error al cargar los productos:", error);
            });
    }
// 👉 Función para mostrar/ocultar la tabla de ventas al hacer clic en el botón
    if (btnMostrarVentas) {
        tablaVentas.style.display = "none"; // Oculta la tabla al inicio

        btnMostrarVentas.addEventListener("click", function () {
            if (tablaVentas.style.display === "none" || tablaVentas.style.display === "") {
                tablaVentas.style.display = "table"; // Muestra la tabla
                cargarVentas();
                btnMostrarVentas.innerHTML = '<i class="fa fa-eye-slash"></i> Ocultar Ventas';
            } else {
                tablaVentas.style.display = "none"; // Oculta la tabla
                btnMostrarVentas.innerHTML = '<i class="fa fa-eye"></i> Mostrar Ventas';
            }
        });
    }
    
    window.cargarVentas = function() {
        fetch("../PHP/obtener_ventas.php")
            .then((response) => response.json())
            .then((data) => {
                const tabla = document.getElementById("tablaVentasBody");
                if (!tabla) {
                    console.error("No se encontró el elemento con id 'tablaVentasBody'.");
                    return;
                }

                tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas

                data.forEach((venta) => {
                    const row = `
                        <tr>
                            <td>${venta.id_venta}</td>
                            <td>${venta.id_producto}</td>
                            <td>${venta.cantidad}</td>
                            <td>S/. ${venta.precio}</td>
                            <td>S/. ${venta.total}</td>
                            <td>${venta.fecha}</td>
                            <td>${venta.id_usuario}</td>
                        </tr>
                    `;
                    tabla.innerHTML += row;
                });
            })
            .catch((error) => {
                console.error("Error al cargar las ventas:", error);
            });
    };


    window.toggleEstadoProducto = function (idProducto, nuevoEstado) {
        const datos = {
            id_producto: idProducto,
            nuevo_estado: nuevoEstado
        };

        fetch("../PHP/toggle_estado_producto.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        })
        .then(res => res.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    alert(`Producto ${nuevoEstado === 1 ? "activado" : "desactivado"} correctamente`);
                    cargarProductos();
                } else {
                    alert("Error al cambiar el estado: " + data.error);
                }
            } catch (e) {
                console.error("Respuesta no es JSON válida:", text);
                alert("Respuesta del servidor no válida.");
            }
        })
        .catch(err => {
            console.error("Error al cambiar estado:", err);
            alert("Ocurrió un error en la comunicación con el servidor.");
        });
    };

    window.editarProducto = function (idProducto) {
        const fila = document.querySelector(`tr[data-id='${idProducto}']`);
        const celdas = fila.querySelectorAll("td");

        const nombre = celdas[1].innerText;
        const precio = celdas[2].innerText.replace("S/. ", "");
        const stock = celdas[3].innerText;

        celdas[1].innerHTML = `<input type="text" class="form-control" value="${nombre}">`;
        celdas[2].innerHTML = `<input type="number" class="form-control" value="${precio}">`;
        celdas[3].innerHTML = `<input type="number" class="form-control" value="${stock}">`;

        celdas[7].innerHTML = `
            <button class="btn btn-success" onclick="guardarEdicion(${idProducto})">Guardar</button>
            <button class="btn btn-secondary" onclick="cargarProductos()">Cancelar</button>
        `;
    };

    window.guardarEdicion = function (idProducto) {
        const fila = document.querySelector(`tr[data-id='${idProducto}']`);
        const celdas = fila.querySelectorAll("td");

        const nuevoNombre = celdas[1].querySelector("input").value;
        const nuevoPrecio = celdas[2].querySelector("input").value;
        const nuevoStock = celdas[3].querySelector("input").value;

        fetch("../PHP/editar_producto.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_producto: idProducto,
                nombre_producto: nuevoNombre,
                precio: nuevoPrecio,
                stock: nuevoStock,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert("Producto actualizado correctamente");
                cargarProductos();
            } else {
                alert("Error al actualizar: " + data.error);
            }
        })
        .catch((err) => {
            console.error("Error al guardar edición:", err);
        });
    };

    window.eliminarProducto = function (idProducto) {
        if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

        fetch("../PHP/eliminar_producto.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_producto: idProducto }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert("Producto eliminado correctamente");
                cargarProductos();
            } else {
                alert("Error al eliminar: " + data.error);
            }
        })
        .catch((err) => {
            console.error("Error al eliminar:", err);
        });
    };

    // ✅ GUARDAR NUEVO PRODUCTO
    if (btnGuardarProducto) {
        btnGuardarProducto.addEventListener("click", function () {
            if (!formNuevoProducto.checkValidity()) {
                formNuevoProducto.classList.add("was-validated");
                return;
            }

            const formData = new FormData(formNuevoProducto);

            fetch("../PHP/insertar_producto.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Producto guardado exitosamente");
                    formNuevoProducto.reset();
                    formNuevoProducto.classList.remove("was-validated");
                    const modal = bootstrap.Modal.getInstance(document.getElementById("myModal"));
                    if (modal) modal.hide();
                    cargarProductos();
                } else {
                    alert("Error al guardar el producto: " + (data.message || "Respuesta desconocida"));
                }
            })
            .catch(error => {
                console.error("Error al guardar producto:", error);
                alert("Error al guardar el producto.");
            });
        });
    }
    if (btnSave) {
    btnSave.addEventListener("click", function (e) {
        e.preventDefault(); // ✅ Evita que se recargue la página

        const barcode = document.getElementById("barcode").value.trim();
        const stockNuevo = parseInt(document.getElementById("stock").value.trim());

        if (!barcode || isNaN(stockNuevo)) {
            alert("Por favor ingresa un ID y un valor de stock válido.");
            return;
        }

        fetch("../PHP/actualizar_stock.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_producto: barcode,
                stock_nuevo: stockNuevo
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Stock actualizado correctamente");
                document.getElementById("stock").value = ""; // limpiar campo stock
                cargarProductos(); // recarga la tabla sin recargar la página
            } else {
                alert("Error al actualizar el stock: " + (data.error || "Error desconocido"));
            }
        })
        .catch(error => {
            console.error("Error al actualizar stock:", error);
            alert("Error al enviar los datos al servidor.");
        });
     });
    }
    if (btnBuscarPorFechas) {
        btnBuscarPorFechas.addEventListener("click", mostrarFechas);
    }

    function mostrarFechas() {
    const fechaDesde = document.getElementById('fechaDe').value;
    const fechaHasta = document.getElementById('fechaHasta').value;
    const btnGenerar = document.getElementById('btnGenerarReporte');

    // Ocultar el botón de reporte por defecto
    btnGenerar.style.display = 'none';

    if (!fechaDesde || !fechaHasta) {
        alert("Por favor, selecciona ambas fechas.");
        return;
    }

    fetch('../PHP/filtrarVentas.php', {
        method: 'POST',
        body: JSON.stringify({ fechaDesde, fechaHasta }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const tablaBody = document.getElementById('tablaVentasBody');

        if (!tablaBody) {
            console.error("No se encontró el elemento con id 'tablaVentasBody'.");
            return;
        }

        tablaBody.innerHTML = '';

        if (data.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="7" class="text-center">No se encontraron ventas en el rango de fechas.</td></tr>`;
            return;
        }

        data.forEach(venta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${venta.id_venta}</td>
                <td>${venta.id_producto}</td>
                <td>${venta.cantidad}</td>
                <td>S/. ${venta.precio}</td>
                <td>S/. ${venta.total}</td>
                <td>${venta.fecha}</td>
                <td>${venta.id_usuario}</td>
            `;
            tablaBody.appendChild(row);
        });

        // Guardar las ventas filtradas en localStorage
        localStorage.setItem('ventas', JSON.stringify(data));

        // Mostrar el botón de generar reporte
        btnGenerar.style.display = 'inline-block';
    })
        .catch(error => {
            console.error('Error al filtrar ventas:', error);
        });
    }

});
