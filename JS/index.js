document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartItemsContainer = cartDropdown.querySelector('.carrito-items');
    const totalElement = cartDropdown.querySelector('.carrito-precio-total');
    const payButton = cartDropdown.querySelector('.btn-pagar');
    const API_URL = 'http://localhost/HD_2025/HD_2025/PHP/guardar_detalle_venta.php';

    // Mostrar/ocultar el carrito
    cartIcon.addEventListener('click', () => {
        cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Manejar clicks en productos
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productCard = event.target.closest('.card-product');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('S/', '').trim());
            const productImage = productCard.querySelector('img').src;
            const productId = parseInt(event.target.dataset.productId);

            const existingItem = [...cartItemsContainer.querySelectorAll('.carrito-item')]
                .find(item => parseInt(item.dataset.productId) === productId);

            if (existingItem) {
                const quantityInput = existingItem.querySelector('.carrito-item-cantidad');
                quantityInput.value = parseInt(quantityInput.value) + 1;
            } else {
                const cartItemHtml = `
                    <div class="carrito-item" data-product-id="${productId}">
                        <img src="${productImage}" width="80px" alt="${productName}">
                        <div class="carrito-item-detalles">
                            <span class="carrito-item-titulo">${productName}</span>
                            <div class="selector-cantidad">
                                <i class="fa-solid fa-minus restar-cantidad"></i>
                                <input type="text" value="1" class="carrito-item-cantidad" disabled>
                                <i class="fa-solid fa-plus sumar-cantidad"></i>
                            </div>
                            <span class="carrito-item-precio">S/${productPrice.toFixed(2)}</span>
                        </div>
                        <span class="btn-eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </span>
                    </div>`;
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHtml);
            }

            updateTotal();
        }
    });

    // Actualizar total
    function updateTotal() {
        let total = 0;
        cartItemsContainer.querySelectorAll('.carrito-item').forEach(item => {
            const quantity = parseInt(item.querySelector('.carrito-item-cantidad').value);
            const price = parseFloat(item.querySelector('.carrito-item-precio').textContent.replace('S/', '').trim());
            total += quantity * price;
        });
        totalElement.textContent = `S/${total.toFixed(2)}`;
    }

    // Eventos dentro del carrito (cantidad y eliminar)
    cartDropdown.addEventListener('click', (event) => {
        const item = event.target.closest('.carrito-item');
        if (!item) return;

        const quantityInput = item.querySelector('.carrito-item-cantidad');

        if (event.target.classList.contains('sumar-cantidad')) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
            updateTotal();
        }

        if (event.target.classList.contains('restar-cantidad')) {
            if (parseInt(quantityInput.value) > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
                updateTotal();
            }
        }

        if (event.target.classList.contains('btn-eliminar') || event.target.classList.contains('fa-trash')) {
            item.remove();
            updateTotal();
        }
    });

    // Obtener datos del carrito
    function getCartData() {
        const items = cartItemsContainer.querySelectorAll('.carrito-item');
        const productos = [];
        let total = 0;

        items.forEach(item => {
            const id_producto = parseInt(item.getAttribute('data-product-id'));
            const nombre = item.querySelector('.carrito-item-titulo').textContent;
            const cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
            const precio = parseFloat(item.querySelector('.carrito-item-precio').textContent.replace('S/', '').trim());
            const subtotal = cantidad * precio;

            productos.push({
                id_producto,
                nombre,
                cantidad,
                precio
            });

            total += subtotal;
        });

        return { productos, total };
    }

    // Procesar pago
    payButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const cartData = getCartData();

        if (cartData.productos.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const ventaData = cartData.productos.map(producto => ({
            id_producto: producto.id_producto,
            cantidad: producto.cantidad,
            precio: producto.precio,
            total: producto.cantidad * producto.precio,
            fecha: new Date().toISOString().split('T')[0]
        }));

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ventaData)
            });

            if (response.ok) {
                alert('¡Gracias por su compra!');
                clearCart();
                cartDropdown.style.display = 'none';
            } else {
                alert('Error en el servidor al guardar la venta.');
                console.error('Respuesta del servidor:', await response.text());
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la compra. Por favor, intente nuevamente.');
        }
    });

    // Vaciar carrito
    function clearCart() {
        cartItemsContainer.innerHTML = '';
        updateTotal();
    }

    // Funciones de navegación
    window.salir = function() {
        window.location.href = "../html/portadacolaborador.html";
    };

    window.EntrarCliente = function() {
        window.location.href = '../html/login-cliente.html';
    };

    window.entrar = function() {
        window.location.href = "../html/colaborador.html";
    };

    updateTotal();
});
