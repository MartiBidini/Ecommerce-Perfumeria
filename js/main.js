
let Perfumes = [];

async function cargarProductos() {
    const productos = await fetch("js/productos.json");
    
    Perfumes = await productos.json();
    
    MostrarPerfumes(Perfumes);
    AñadirAlCarrito();
    mostrarCarrito();
}

cargarProductos();

//Cards de Perfumes
const ContenedorPerfumes = document.getElementById("contenedor_perfumes");
const flechaIzquierda = document.getElementById("flecha-izquierda");
const flechaDerecha = document.getElementById("flecha-derecha");

const moverSlider = (direccion) => {
    
    const anchoVisibles = document.querySelector('.slider').clientWidth;

    if (window.innerWidth < 768) {
        
        if (direccion === "derecha") {
            document.querySelector('.slider').scrollBy({ left: anchoVisibles, behavior: 'smooth' });
        } else {
            document.querySelector('.slider').scrollBy({ left: -anchoVisibles, behavior: 'smooth' });
        }
    } else {
    
        if (direccion === "derecha") {
            document.querySelector('.slider').scrollLeft += 600;
        } else {
            document.querySelector('.slider').scrollLeft -= 600;
        }
    }
};


flechaIzquierda.addEventListener("click", () => moverSlider("izquierda"));
flechaDerecha.addEventListener("click", () => moverSlider("derecha"));

function MostrarPerfumes(Perfumes) {
        Perfumes.forEach((perfume, i) => {
        const div = document.createElement("div");
        div.classList.add("card");
        
        div.setAttribute('data-aos', 'fade-up');
        div.setAttribute('data-aos-delay', i * 100);

        div.innerHTML = `
            <img src="${perfume.imagen}" alt="${perfume.Nombre}">
            <h3>${perfume.Nombre}</h3>
            <p class="info">${perfume.Categoria}</p>
            <p class="precio">$${perfume.Precio.toLocaleString()}</p>
            <button class="btn-agregar" id="agregar-${perfume.id}">Añadir al carrito</button>
        `;
        ContenedorPerfumes.appendChild(div);
    });
}
AOS.refresh();

//Panel de carrito
const botonAbrirCarrito = document.getElementById("abrir-carrito");
const botonCerrarCarrito = document.getElementById("cerrar-carrito");
const panelCarrito = document.getElementById("panel_carrito");

botonAbrirCarrito.addEventListener("click", (evento) => {
    evento.preventDefault();
    panelCarrito.classList.add("activo");
});

botonCerrarCarrito.addEventListener("click", () => {
    panelCarrito.classList.remove("activo");
});

//Funcion de boton de las cards "Añadir al carrito"
let Carrito = JSON.parse(localStorage.getItem("MiCarrito")) || [];

function AñadirAlCarrito() {
    const BotonAñadirCarrito = document.querySelectorAll(".btn-agregar");
    BotonAñadirCarrito.forEach(boton => {
        boton.addEventListener("click", function() {  
            const idBoton = parseInt(boton.id.split("-")[1]);
            const PerfumeElegido = Perfumes.find(perfume => perfume.id === idBoton);
            const productosencarrito = Carrito.find(producto => producto.id === idBoton);

            if(productosencarrito) {
                productosencarrito.cantidad++;
            } else {
                PerfumeElegido.cantidad = 1;
                Carrito.push(PerfumeElegido);
            }
            
            localStorage.setItem("MiCarrito", JSON.stringify(Carrito));
            mostrarCarrito();

            Swal.fire({
                title: "¡Agregado al carrito!",
                text: PerfumeElegido.Nombre,
                icon: "success",
                toast: true, 
                position: "bottom-end", 
                showConfirmButton: false, 
                timer: 2000, 
                timerProgressBar: true, 
                background: "#0F0F0F",
                color: "#D4AF37"
            });
        });
    });
}

//Items en el carrito
const contenedorCarritoItems = document.getElementById("contenedor_items_carrito");

function mostrarCarrito() {
    contenedorCarritoItems.innerHTML = "";
    if (Carrito.length === 0) {
        contenedorCarritoItems.innerHTML = `
            <p style="text-align: center; color: #bfa76a; margin-top: 40px; font-style: italic;font-size:20px;">
                Tu carrito está vacío. ¡Descubrí nuestras fragancias!
            </p>
        `;
    }

    Carrito.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto_en_carrito"); 
        div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.Nombre}" class="img-carrito-mini">
            <p class="nombre-item">${producto.Nombre}</p>
            <div class="controles-cantidad">
                <button class="btn-restar" id="restar-${producto.id}">-</button>
                <p class="cantidad-item">${producto.cantidad}</p>
                <button class="btn-sumar" id="sumar-${producto.id}">+</button>
            </div>
            <p class="precio-item">$${(producto.Precio * producto.cantidad).toLocaleString()}</p>
            <button class="boton-eliminar" id="eliminar-${producto.id}"> 
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        contenedorCarritoItems.appendChild(div);
    });

    const precioTotal = document.getElementById("precio-total");
    const totalCalculado = Carrito.reduce((acumulador, producto) => acumulador + (producto.Precio * producto.cantidad), 0);
    precioTotal.innerText = totalCalculado.toLocaleString();

    const botonesTachoBasura = document.querySelectorAll(".boton-eliminar");
    botonesTachoBasura.forEach(botonBasura => {
        botonBasura.addEventListener("click", () => {
            const idBoton = botonBasura.id.split("-")[1];
            eliminarDelCarrito(idBoton);
        }); 
    });

    const botonesSumar = document.querySelectorAll(".btn-sumar");
    botonesSumar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idBoton = parseInt(boton.id.split("-")[1]);
            const productoElegido = Carrito.find(producto => producto.id == idBoton);
            productoElegido.cantidad++; 
            localStorage.setItem("MiCarrito", JSON.stringify(Carrito));
            mostrarCarrito(); 
        });
    });

    const botonesRestar = document.querySelectorAll(".btn-restar");
    botonesRestar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idBoton = parseInt(boton.id.split("-")[1]);
            const productoElegido = Carrito.find(producto => producto.id == idBoton);
            if (productoElegido.cantidad > 1) {
                productoElegido.cantidad--; 
                localStorage.setItem("MiCarrito", JSON.stringify(Carrito));
                mostrarCarrito();
            } else {
                eliminarDelCarrito(idBoton); 
            }
        });
    });

    const contadorCarrito = document.getElementById("contador-carrito");
    const totalItems = Carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    contadorCarrito.innerText = totalItems;
}

function eliminarDelCarrito(idQueQuieroBorrar) {
    Carrito = Carrito.filter(producto => producto.id != idQueQuieroBorrar);
    localStorage.setItem("MiCarrito", JSON.stringify(Carrito));
    mostrarCarrito();
}

//Boton vaciar compra
const botonVaciar = document.getElementById("vaciar-carrito");

botonVaciar.addEventListener("click", () => {
    Carrito = []; 
    localStorage.setItem("MiCarrito", JSON.stringify(Carrito)); 
    mostrarCarrito(); 
});

//Boton Finalizar Compra y Formulario

const botonFinalizar = document.getElementById("finalizar-compra");
const CheckoutModal = document.getElementById("checkout");
const CheckoutContent = document.querySelector(".checkout-modal-wrap"); 
const btnCerrarModal = document.getElementById("cerrar-modal");
const formCheckout = document.getElementById("formulario");

const contenedorResumenItems = document.getElementById("resumen-compra-items");
const totalPagoResumen = document.getElementById("resumen-total-pago");

botonFinalizar.addEventListener("click", () => {
    if(Carrito.length === 0){
        Swal.fire({
            title: "El carrito está vacío",
            text: "Agregá algún perfume antes de comprar.",
            icon: "error",
            confirmButtonColor: "#D4AF37",
            background: "#0F0F0F",
            color: "#FFF"
        });
        return; 
    }

    contenedorResumenItems.innerHTML = "";
    
    Carrito.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("resumen-item");
        div.innerHTML = `
        <img src="${producto.imagen}" class="img-mini-checkout" alt="${producto.Nombre}">
            <div class="item-info-resumen">
            <p class="item-nombre">${producto.Nombre}</p>
            <p class="item-detalles">Cantidad: ${producto.cantidad} x $${producto.Precio.toLocaleString()}</p>
        </div>
        `;
        contenedorResumenItems.appendChild(div);
    });

    const totalCalculado = Carrito.reduce((acumulador, producto) => acumulador + (producto.Precio * producto.cantidad), 0);
    totalPagoResumen.innerText = totalCalculado.toLocaleString();

    panelCarrito.classList.remove("activo");
    CheckoutModal.classList.add("modal-activo");
    CheckoutContent.classList.remove("modal-oculto"); 
});

btnCerrarModal.addEventListener("click", () => {
    CheckoutModal.classList.remove("modal-activo");
});

function soloNumeros(evento) {
    if (evento.key === "Backspace" || evento.key === "Tab") {
        return; 
    }
    if (evento.key < "0" || evento.key > "9") {
        evento.preventDefault(); 
    }
}

//confirmar compra

formCheckout.addEventListener("submit", (evento) => {
    evento.preventDefault(); 
    
    Swal.fire({
        title: "¿Desea confirmar el pago?",
        text: "Una vez confirmado, el monto será cobrado de su tarjeta.",
        icon: "warning",
        showCancelButton: true, 
        confirmButtonText: "Sí, confirmar pago",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#D4AF37", 
        cancelButtonColor: "#c94c4c", 
        background: "#0F0F0F",
        color: "#FFF"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "¡Pago exitoso!",
                text: "Tu compra está siendo procesada. ¡Gracias por elegir Olfate-E Perfumeria!",
                icon: "success",
                confirmButtonColor: "#D4AF37",
                background: "#0F0F0F",
                color: "#FFF"
            });
            Carrito = [];
            localStorage.setItem("MiCarrito", JSON.stringify(Carrito));
            mostrarCarrito();
            formCheckout.reset(); 
            CheckoutModal.classList.remove("modal-activo");
        }
    });
});