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

document.addEventListener("DOMContentLoaded", async () => {
  pantallaCargaProductos();
  const productos = await obtenerProductos();
  pintarTabla();
  //funciones
  iniciarModal();
  obtenerCategoriasFormularioAñadir(
    obtenerGenerosPorCategoria,
    obtenerTiposPrendaPorGenero,
  );
  obtenerDatosFormularioAñadir(añadirProductoBaseDatos);
  pintarTablaProductosAdmin(productos, eliminarProducto);
  obtenerDatosFormularioEditar(editarProductoBaseDatos);
});
