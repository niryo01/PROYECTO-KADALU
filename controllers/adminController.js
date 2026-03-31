import {
  añadirProductoBaseDatos,
  editarProductoBaseDatos,
  eliminarProducto,
  obtenerProductos,
} from "../services/productosService.js";
import {
  iniciarModal,
  obtenerDatosFormularioAñadir,
  obtenerDatosFormularioEditar,
  pintarTablaProductosAdmin,
} from "../views/adminView.js";

document.addEventListener("DOMContentLoaded", async () => {
  const productos = await obtenerProductos();
  //funciones
  iniciarModal();
  obtenerDatosFormularioAñadir(añadirProductoBaseDatos);
  pintarTablaProductosAdmin(productos, eliminarProducto);
  obtenerDatosFormularioEditar(editarProductoBaseDatos);
});
