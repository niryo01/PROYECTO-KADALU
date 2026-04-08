import { auth } from "../config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ADMIN_UID } from "../env.js";
import { logout } from "../services/authService.js";
import {
  añadirProductoBaseDatos,
  editarProductoBaseDatos,
  eliminarProducto,
  obtenerGenerosPorCategoria,
  obtenerProductos,
  obtenerTiposPrendaPorGenero,
} from "../services/productosService.js";
import {
  botonCerrarSesion,
  iniciarModal,
  obtenerCategoriasFormularioAñadir,
  obtenerDatosFormularioAñadir,
  obtenerDatosFormularioEditar,
  PantallaCargaAdmin,
  pintarTablaProductosAdmin,
} from "../views/adminView.js";

// --- GUARDIA DE SEGURIDAD ASÍNCRONO ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    if (user.uid === ADMIN_UID) {
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
  try {
    PantallaCargaAdmin(true);
    const productos = await obtenerProductos();

    // Aquí van todas tus funciones que antes estaban en DOMContentLoaded
    iniciarModal();
    obtenerCategoriasFormularioAñadir(
      obtenerGenerosPorCategoria,
      obtenerTiposPrendaPorGenero,
    );
    obtenerDatosFormularioAñadir(añadirProductoBaseDatos);
    pintarTablaProductosAdmin(productos, eliminarProducto);
    obtenerDatosFormularioEditar(editarProductoBaseDatos);
    botonCerrarSesion(() => {
      logout()
        .then(() => {
          window.location.href = "login.html";
        })
        .catch(console.error);
    });
  } catch (error) {
    console.log(error);
    Swal.fire({
      title: "Error de conexión",
      text: "No se pudieron cargar los productos. Revisa tu internet o intenta más tarde.",
      icon: "error",
    });
  } finally {
    PantallaCargaAdmin(false);
  }
}
