
let productos = []

const destacadosContainer = document.getElementById("destacados-container")
const productsContainer = document.getElementById("products-container")

function cargarProductos() {
    fetch("../db/productos.json")
        .then(response => response.json())
        .then(data => {
            productos = data
            renderDestacados()
            renderCatalogo()
        })
        .catch(() => {
            Swal.fire("Error", "No se pudieron cargar los productos", "error")
        })
}

function renderDestacados() {
    const container = destacadosContainer
    if (!container) return

    container.innerHTML = ""

    const destacados = productos.slice(0, 2)

    destacados.forEach(producto => {
        const card = document.createElement("div")
        card.className = "card-producto"

        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="card-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="precio">$${producto.precio}</p>
            </div>
            <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        `
        container.appendChild(card)
    })
    
    const botonesAgregar = document.querySelectorAll(".btn-agregar")
    if (botonesAgregar.length > 0) {
        activarBotonesAgregar()
    }
}

function renderCatalogo() {
    const container = productsContainer
    if (!container) return

    container.innerHTML = ""

    productos.forEach(producto => {
        const card = document.createElement("div")
        card.className = "card-producto"

        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="card-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="precio">$${producto.precio}</p>
            </div>
            <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        `
        container.appendChild(card)
    })

    activarBotonesAgregar()
}
cargarProductos()