// Sistema de gestión de pedidos
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

// Crear nuevo pedido
function crearPedido(usuario, carrito, metodoPago, direccionEnvio) {
  const total = carrito.reduce((sum, item) => sum + item.price, 0);
  
  const nuevoPedido = {
    id: Date.now(),
    numeroOrden: `ORD-${Date.now().toString().slice(-8)}`,
    fecha: new Date().toISOString(),
    fechaFormateada: new Date().toLocaleString('es-AR'),
    
    // Datos del cliente
    cliente: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono
    },
    
    // Datos de envío
    direccionEnvio: direccionEnvio,
    
    // Productos
    productos: carrito.map(item => ({
      nombre: item.name,
      precio: item.price
    })),
    
    // Totales
    subtotal: total,
    envio: total > 2000 ? 0 : 500, // Envío gratis si supera $2000
    total: total + (total > 2000 ? 0 : 500),
    
    // Método de pago
    metodoPago: metodoPago,
    
    // Estado
    estado: "Pendiente", // Pendiente, Procesando, Enviado, Entregado, Cancelado
    pagado: false,
    cancelado: false
  };
  
  pedidos.push(nuevoPedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  
  return nuevoPedido;
}

// Obtener todos los pedidos (para el admin)
function obtenerTodosPedidos() {
  return pedidos.sort((a, b) => b.id - a.id); // Más recientes primero
}

// Obtener pedidos de un usuario específico
function obtenerPedidosUsuario(usuarioId) {
  return pedidos.filter(p => p.cliente.id === usuarioId)
                 .sort((a, b) => b.id - a.id);
}

// Actualizar estado de pedido (para el admin)
function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  const pedido = pedidos.find(p => p.id === pedidoId);
  if (pedido) {
    pedido.estado = nuevoEstado;
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    return true;
  }
  return false;
}

// Marcar pedido como pagado
function marcarComoPagado(pedidoId) {
  const pedido = pedidos.find(p => p.id === pedidoId);
  if (pedido) {
    pedido.pagado = true;
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    return true;
  }
  return false;
}

// Cancelar pedido (usuario o admin)
function cancelarPedido(pedidoId, motivo = "Cancelado por el usuario") {
  const pedido = pedidos.find(p => p.id === pedidoId);
  
  if (!pedido) {
    return { exito: false, mensaje: "Pedido no encontrado" };
  }
  
  // Solo se pueden cancelar pedidos pendientes o procesando
  if (pedido.estado === "Enviado" || pedido.estado === "Entregado") {
    return { 
      exito: false, 
      mensaje: "No se puede cancelar un pedido que ya fue enviado o entregado" 
    };
  }
  
  if (pedido.cancelado) {
    return { exito: false, mensaje: "Este pedido ya está cancelado" };
  }
  
  pedido.estado = "Cancelado";
  pedido.cancelado = true;
  pedido.motivoCancelacion = motivo;
  pedido.fechaCancelacion = new Date().toISOString();
  
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  
  return { exito: true, mensaje: "Pedido cancelado exitosamente" };
}

// Verificar si un pedido puede ser cancelado
function puedeCancelar(pedido) {
  return !pedido.cancelado && 
         pedido.estado !== "Enviado" && 
         pedido.estado !== "Entregado" &&
         pedido.estado !== "Cancelado";
}

// Estadísticas para el admin
function obtenerEstadisticas() {
  const totalVentas = pedidos
    .filter(p => !p.cancelado)
    .reduce((sum, p) => sum + p.total, 0);
  
  const totalPedidos = pedidos.filter(p => !p.cancelado).length;
  const pedidosPendientes = pedidos.filter(p => p.estado === "Pendiente").length;
  const pedidosCancelados = pedidos.filter(p => p.cancelado).length;
  
  return {
    totalVentas,
    totalPedidos,
    pedidosPendientes,
    pedidosCancelados,
    ventaPromedio: totalPedidos > 0 ? (totalVentas / totalPedidos).toFixed(2) : 0
  };
}