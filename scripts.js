// Variables globales
const productos = document.getElementById("productos");
const totalElement = document.getElementById("total");
let carritoArray = JSON.parse(localStorage.getItem("carrito")) || [];
let totalCompra = 0;

// Productos disponibles
const productosDisponibles = [
  {
    id: 1,
    nombre: "Camiseta Mi Tierra Mujer",
    precio: 45000,
    imagen: "img/catalogo1.jpg",
    tallas: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 2,
    nombre: "Camiseta Pura Sabrosura",
    precio: 12000,
    imagen: "img/catalogo2.jpg",
    tallas: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 3,
    nombre: "Camiseta Tierra Querida",
    precio: 20000,
    imagen: "img/catalogo4.jpg",
    tallas: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 4,
    nombre: "Camisa Los Andinos",
    precio: 140000,
    imagen: "img/catalogo5.jpg",
    tallas: ["XS", "S", "M", "L", "XL"]
  }
];

// Mostrar productos en la tienda
function mostrarProductosTienda() {
  const tienda = document.getElementById("productos");
  let cards = "";

  productosDisponibles.forEach((producto, index) => {
    cards += `
      <div class="productodestacado">
        <div class="imagen-productoX">
          <img src="${producto.imagen}" alt="${producto.nombre}">
        </div>
        <p class="categoria">${producto.nombre}</p>

        ${producto.tallas ? `
          <div class="talla-cantidad-container">
            <label for="talla-${index}">Talla:</label>
            <select id="talla-${index}" class="talla-select">
            ${producto.tallas.map(talla => `<option value="${talla}">${talla}</option>`).join("")}
        </select>
</div>

        ` : ""}

        <label for="cantidad-${index}">Cantidad:</label>
        <input type="number" id="cantidad-${index}" class="cantidad-input" min="1" value="1">

        <p class="precio">$${producto.precio.toLocaleString()}</p>

        <button class="btn-agregar" onclick="addCarrito(${producto.id}, document.getElementById('talla-${index}')?.value, document.getElementById('cantidad-${index}').value)">
          Agregar al carrito
        </button>
      </div>
    `;
  });

  tienda.innerHTML = cards;
}


// Agregar producto al carrito
function addCarrito(id) {
    let producto = productosDisponibles.find(p => p.id === id);
    if (producto) {
        carritoArray.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carritoArray));
        alert("Producto agregado al carrito");
        calcularTotal();
    }
}

function calcularTotal() {
  totalCompra = carritoArray.reduce((total, producto) => total + producto.precio, 0);
  totalElement.innerText = "Total: $" + totalCompra.toLocaleString();

  const totalFactura = document.getElementById('totalFactura');
  if (totalFactura) {
    totalFactura.textContent = `Total: $${totalCompra.toLocaleString()}`;
  }

  return totalCompra;
}

// Mostrar productos en el carrito
function mostrarModalCarrito() {
  const productsSection = document.getElementById('products');
  let cards = "";

  carritoArray.forEach(producto => {
    const subtotal = producto.precio * (producto.cantidad || 1);

    cards += `
      <article id="producto-${producto.id}" class="producto-card" data-id="${producto.id}">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p class="precio">Precio unitario: $${producto.precio.toLocaleString()}</p>
        <p class="detalle">Talla: <strong>${producto.talla || "Única"}</strong></p>
        <p class="detalle">Cantidad: <strong>${producto.cantidad || 1}</strong></p>
        <p class="subtotal">Subtotal: $${subtotal.toLocaleString()}</p>
        <button onclick="deleteProduct(${producto.id})">Eliminar</button>
      </article>
    `;
  });

  productsSection.innerHTML = cards;

  const totalFactura = document.getElementById('totalFactura');
  totalFactura.textContent = `Total: $${totalCompra.toLocaleString()}`;

  document.getElementById('modal_detalle_carrito').style.display = 'block';
}
// Cerrar el modal del carrito
function cerrarModal() {
    document.getElementById('modal_detalle_carrito').style.display = 'none';
}

// Eliminar producto del carrito
function deleteProduct(id) {
  const index = carritoArray.findIndex(p => p.id === id);
  if (index !== -1) {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      
        // Animación de desvanecimiento
      const productoDOM = document.querySelector(`#producto-${id}`);
      
      if (productoDOM) {
        productoDOM.classList.add("fade-out"); // Aplica animación

        setTimeout(() => {
         carritoArray.splice(index, 1);
         localStorage.setItem("carrito", JSON.stringify(carritoArray));

         calcularTotal(); // ya actualiza ambos totales

         mostrarModalCarrito(); // vuelve a renderizar el modal
        }, 800);

      }
    }
  } else {
    mostrarNotificacion("❌ Producto no encontrado");
  }
}


// Vaciar el carrito
function vaciarCarrito() {
    carritoArray = [];
    localStorage.removeItem("carrito");
    totalCompra = 0;
    totalElement.innerText = "Total: $0";
    alert("Carrito vaciado");
}

// Inicializar la tienda al cargar la página
window.onload = function() {
    mostrarProductosTienda();
    calcularTotal();
};
