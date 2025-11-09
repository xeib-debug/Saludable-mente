let cart = JSON.parse(localStorage.getItem("cart")) || [];

function mostrarAlerta(mensaje, tipo = "info") {
  const alerta = document.getElementById("alerta");
  if (!alerta) {
    console.error("Elemento 'alerta' no encontrado en el DOM");
    return;
  }
  alerta.textContent = mensaje;
  alerta.className = `alerta mostrar ${tipo}`;
  setTimeout(() => alerta.classList.remove("mostrar"), 3000);
}

function actualizarCarrito() {
  const lista = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");

  if (!lista || !total) return; // Solo actualiza si estamos en la página del carrito

  lista.innerHTML = "";
  let suma = 0;

  if (cart.length === 0) {
    lista.innerHTML = `<li style="text-align:center;">Tu carrito está vacío 🛒️</li>`;
  } else {
    cart.forEach((item, i) => {
      suma += item.price;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.name}</span>
        <span>$${item.price}</span>
        <button onclick="eliminarDelCarrito(${i})">✖</button>
      `;
      lista.appendChild(li);
    });
  }

  total.textContent = `Total: $${suma}`;
}

// Función separada para guardar en el carrito
function guardarEnCarrito(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("✅ Producto guardado:", name, price);
  console.log("📦 Carrito actual:", cart);
}

// Función separada para mostrar la alerta
function mostrarAlertaProducto(name) {
  console.log("🔔 Intentando mostrar alerta para:", name);
  mostrarAlerta(`${name} agregado al carrito.`, "info");
}

// Función principal que llama a ambas
function agregarAlCarrito(name, price) {
  guardarEnCarrito(name, price);
  actualizarCarrito();
  mostrarAlertaProducto(name);
}

function eliminarDelCarrito(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  actualizarCarrito();
  mostrarAlerta("Producto eliminado.", "error");
}

function vaciarCarrito() {
  cart = [];
  localStorage.removeItem("cart");
  actualizarCarrito();
  mostrarAlerta("Carrito vaciado.", "error");
}

function finalizarCompra() {
  if (cart.length === 0) {
    mostrarAlerta("Tu carrito está vacío.", "error");
    return;
  }
  
  // Verificar si hay usuario logueado
  if (typeof verificarSesion === 'function' && !verificarSesion()) {
    mostrarAlerta("⚠️ Debes iniciar sesión para continuar", "error");
    setTimeout(() => {
      window.location.href = '../Auth/login.html';
    }, 1500);
    return;
  }
  
  // Redirigir al checkout
  window.location.href = 'checkout.html';
}

// Notificación "botón no disponible"
function noDisponible(name) {
  mostrarAlerta(`⚠️ Esta función aún no está disponible.`, "error");
}

// Cargar al iniciar la página
document.addEventListener("DOMContentLoaded", function() {
  actualizarCarrito();
  
  // Mostrar info de usuario si está logueado (solo en página del carrito)
  if (typeof verificarSesion === 'function' && verificarSesion()) {
    const cartHeader = document.querySelector('.cart-header');
    if (cartHeader) {
      const usuario = obtenerUsuarioActual();
      const infoUsuario = document.createElement('div');
      infoUsuario.style.cssText = 'background: #f0fdf4; padding: 10px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;';
      infoUsuario.innerHTML = `
        <strong>🟢 Sesión iniciada:</strong> ${usuario.nombre}
        <button onclick="cerrarSesion()" style="float: right; background: none; border: none; color: #dc2626; cursor: pointer; font-weight: 600; font-size: 13px;">Cerrar sesión</button>
      `;
      cartHeader.after(infoUsuario);
    }
  }
});