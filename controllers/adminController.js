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
  pantallaCargaProductos,
  pintarTabla,
  pintarTablaProductosAdmin,
} from "../views/adminView.js";

document.addEventListener("DOMContentLoaded", async () => {
  pantallaCargaProductos();
  const productos = await obtenerProductos();
  pintarTabla();
  //funciones
  iniciarModal();
  obtenerDatosFormularioAñadir(añadirProductoBaseDatos);
  pintarTablaProductosAdmin(productos, eliminarProducto);
  obtenerDatosFormularioEditar(editarProductoBaseDatos);
});
