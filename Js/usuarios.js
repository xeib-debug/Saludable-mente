// Sistema de gestión de usuarios
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || null;
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Función para registrar nuevo usuario
function registrarUsuario(email, password, nombre, direccion, telefono) {
  // Verificar si el email ya existe
  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    mostrarAlerta("❌ Este email ya está registrado", "error");
    return false;
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id: Date.now(),
    email: email,
    password: password, // En producción esto debería estar encriptado
    nombre: nombre,
    direccion: direccion,
    telefono: telefono,
    fechaRegistro: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  
  mostrarAlerta("✅ Cuenta creada exitosamente", "info");
  return true;
}

// Función para iniciar sesión
function iniciarSesion(email, password) {
  const usuario = usuarios.find(u => u.email === email && u.password === password);
  
  if (usuario) {
    usuarioActual = usuario;
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    mostrarAlerta(`¡Bienvenido ${usuario.nombre}!`, "info");
    return true;
  } else {
    mostrarAlerta("❌ Email o contraseña incorrectos", "error");
    return false;
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  usuarioActual = null;
  localStorage.removeItem("usuarioActual");
  mostrarAlerta("Sesión cerrada", "info");
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1000);
}

// Verificar si hay usuario logueado
function verificarSesion() {
  return usuarioActual !== null;
}

// Obtener usuario actual
function obtenerUsuarioActual() {
  return usuarioActual;
}