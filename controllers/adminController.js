import { auth } from "../config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ADMIN_UID } from "../env.js";
import {
  añadirProductoBaseDatos,
  editarProductoBaseDatos,
  eliminarProducto,
  obtenerGenerosPorCategoria,
  obtenerProductos,
  obtenerTiposPrendaPorGenero,
} from "../services/productosService.js";
import {
  iniciarModal,
  obtenerCategoriasFormularioAñadir,
  obtenerDatosFormularioAñadir,
  obtenerDatosFormularioEditar,
  pantallaCargaProductos,
  pintarTabla,
  pintarTablaProductosAdmin,
} from "../views/adminView.js";

// --- GUARDIA DE SEGURIDAD ASÍNCRONO ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    if (user.uid === ADMIN_UID) {
      console.log("Acceso autorizado. Inicializando panel...");

      // SOLO si es el admin, ejecutamos toda la lógica de carga
      await inicializarPanel();
    } else {
      // Usuario logueado pero no es el admin
      window.location.href = "index.html";
    }
  } else {
    // No hay usuario logueado
    window.location.href = "login.html";
  }
});

// --- FUNCIÓN QUE ARRANCA TODO EL PANEL ---
async function inicializarPanel() {
  pantallaCargaProductos();

  try {
    const productos = await obtenerProductos();

    // Aquí van todas tus funciones que antes estaban en DOMContentLoaded
    pintarTabla();
    iniciarModal();
    obtenerCategoriasFormularioAñadir(
      obtenerGenerosPorCategoria,
      obtenerTiposPrendaPorGenero,
    );
    obtenerDatosFormularioAñadir(añadirProductoBaseDatos);
    pintarTablaProductosAdmin(productos, eliminarProducto);
    obtenerDatosFormularioEditar(editarProductoBaseDatos);
  } catch (error) {
    console.error("Error al cargar datos del panel:", error);
  }
}
