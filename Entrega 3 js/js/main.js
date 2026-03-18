let cartProducts = []

try {
    const data = JSON.parse(localStorage.getItem("cartProducts"))
    if (Array.isArray(data)) {
        cartProducts = data
    } else {
        cartProducts = []
    }
} catch (err) {
    Swal.fire("Error", "Hubo un problema al leer el carrito", "error")
}

const cartContainer = document.getElementById("cart-section")
const btnFinalizar = document.getElementById("btn-finalizar")

function activarBotonesAgregar() {
    const botones = document.querySelectorAll(".btn-agregar")

    botones.forEach(boton => {
        boton.onclick = () => {
            const id = boton.dataset.id
            const producto = productos.find(p => p.id == id)

            cartProducts.push(producto)
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts))

            renderCarrito()

            Toastify({
                text: "Producto agregado",
                duration: 1500,
                gravity: "top",
                position: "right",
                style: { background: "#2a2a2a" }
            }).showToast()
        }
    })
}

function activarBotonesEliminar() {
    const botones = document.querySelectorAll(".btn-eliminar")

    botones.forEach(boton => {
        boton.onclick = () => {
            const index = boton.dataset.index
            cartProducts.splice(index, 1)

            if (cartProducts.length === 0) {
                localStorage.removeItem("cartProducts")
            } else {
                localStorage.setItem("cartProducts", JSON.stringify(cartProducts))
            }

            renderCarrito()
        }
    })
}

function activarBotonFinalizar() {
    if (!btnFinalizar) return

    btnFinalizar.onclick = () => {
        if (cartProducts.length === 0) {
            Swal.fire("Carrito vacío", "Agregá productos antes de comprar", "info")
            return
        }

        pedirDatosEnvio()
    }
}

function renderCarrito() {
    if (!cartContainer) return

    cartContainer.innerHTML = ""

    if (cartProducts.length === 0) {
        cartContainer.innerHTML = "<p>Tu carrito está vacío.</p>"
        activarBotonFinalizar()
        return
    }

    cartProducts.forEach((producto, index) => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-nombre">${producto.nombre}</span>
                </div>
                <div class="cart-item-precio">$${producto.precio}</div>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            </div>
        `
    })

    const total = cartProducts.reduce((acc, p) => acc + p.precio, 0)

    cartContainer.innerHTML += `
        <div class="cart-total">
            <p>Productos en carrito: ${cartProducts.length}</p>
            <p>Total: $${total}</p>
            <button id="btn-vaciar-carrito">Vaciar carrito</button>
        </div>
    `

    document.getElementById("btn-vaciar-carrito").onclick = () => {
        cartProducts = []
        localStorage.removeItem("cartProducts")
        renderCarrito()
    }

    activarBotonesEliminar()
    activarBotonFinalizar()
}

function pedirDatosEnvio() {
    Swal.fire({
        title: "Datos de envío",
        html: `
            <input id="swal-nombre" class="swal2-input" placeholder="Nombre">
            <input id="swal-apellido" class="swal2-input" placeholder="Apellido">
            <input id="swal-direccion" class="swal2-input" placeholder="Dirección">
            <input id="swal-ciudad" class="swal2-input" placeholder="Ciudad">
            <textarea id="swal-info" class="swal2-textarea" placeholder="Información adicional"></textarea>
        `,
        confirmButtonText: "Continuar",
        preConfirm: () => {
            const nombre = document.getElementById("swal-nombre").value.trim()
            const apellido = document.getElementById("swal-apellido").value.trim()
            const direccion = document.getElementById("swal-direccion").value.trim()
            const ciudad = document.getElementById("swal-ciudad").value.trim()
            const info = document.getElementById("swal-info").value.trim()

            if (!nombre || !apellido || !direccion || !ciudad) {
                Swal.showValidationMessage("Completá todos los campos obligatorios")
                return false
            }

            return { nombre, apellido, direccion, ciudad, info }
        }
    }).then(result => {
        if (!result.isConfirmed) return
        pedirMedioPago(result.value)
    })
}

function pedirMedioPago(datosEnvio) {
    Swal.fire({
        title: "¿Cómo querés pagar?",
        input: "select",
        inputOptions: {
            tarjeta: "Tarjeta de crédito/débito",
            transferencia: "Transferencia bancaria",
            efectivo: "Efectivo"
        },
        inputPlaceholder: "Seleccioná un método",
        confirmButtonText: "Continuar"
    }).then(result => {
        if (!result.isConfirmed) return
        confirmarCompra(datosEnvio, result.value)
    })
}

function confirmarCompra(datosEnvio, medioPago) {
    Swal.fire({
        title: "Confirmar compra",
        html: `
            <p><strong>Nombre:</strong> ${datosEnvio.nombre} ${datosEnvio.apellido}</p>
            <p><strong>Dirección:</strong> ${datosEnvio.direccion}</p>
            <p><strong>Ciudad:</strong> ${datosEnvio.ciudad}</p>
            <p><strong>Información adicional:</strong> ${datosEnvio.info || "—"}</p>
            <p><strong>Pago:</strong> ${medioPago}</p>
        `,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            finalizarCompra(datosEnvio, medioPago)
        }
    })
}

function finalizarCompra(datosEnvio, medioPago) {
    const total = cartProducts.reduce((acc, p) => acc + p.precio, 0)

    Swal.fire({
        title: "¡Compra realizada!",
        html: `
            <h3>Comprobante</h3>
            <p><strong>Cliente:</strong> ${datosEnvio.nombre} ${datosEnvio.apellido}</p>
            <p><strong>Total:</strong> $${total}</p>
            <p><strong>Envío a:</strong> ${datosEnvio.direccion}, ${datosEnvio.ciudad}</p>
            <p><strong>Información adicional:</strong> ${datosEnvio.info || "—"}</p>
            <p><strong>Pago con:</strong> ${medioPago}</p>
        `,
        icon: "success"
    })

    cartProducts = []
    localStorage.removeItem("cartProducts")
    renderCarrito()
}
renderCarrito()