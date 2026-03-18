let productos = []
let categoriaActual = "todos"

const productsContainer = document.getElementById("products-container")
const botonesFiltro = document.querySelectorAll(".btn-filtro")
const inputBusqueda = document.getElementById("input-busqueda")

function cargarProductos() {
    fetch("../db/productos.json")
        .then(response => response.json())
        .then(data => {
            productos = data
            aplicarFiltros()   
        })
        .catch(() => {
            Swal.fire("Error", "No se pudieron cargar los productos", "error")
        })
}

function renderProductos(lista) {
    productsContainer.innerHTML = ""

    lista.forEach(producto => {
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

        productsContainer.appendChild(card)
    })

    activarBotonesAgregar() 
}

function aplicarFiltros() {
    const texto = inputBusqueda.value.toLowerCase()

    let filtrados = productos

    
    if (categoriaActual !== "todos") {
        filtrados = filtrados.filter(prod => prod.categoria === categoriaActual)
    }

   
    if (texto.trim() !== "") {
        filtrados = filtrados.filter(prod =>
            prod.nombre.toLowerCase().includes(texto)
        )
    }

    renderProductos(filtrados)
}

botonesFiltro.forEach(boton => {
    boton.onclick = () => {
        botonesFiltro.forEach(b => b.classList.remove("activo"))
        boton.classList.add("activo")

        categoriaActual = boton.dataset.categoria
        aplicarFiltros()
    }
})

inputBusqueda.oninput = () => aplicarFiltros()

cargarProductos()