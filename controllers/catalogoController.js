import {
  categorias,
  obtenerGenerosPorCategoria,
  obtenerProductos,
  obtenerProductosFiltrados,
  obtenerTiposPrendaPorGenero,
} from "../services/productosService.js";
import {
  cargarFiltros,
  funcionBotonFiltros,
  inicializarBotonesFiltro,
  modalDetallesProducto,
  pantallaCarga,
  pintarCatalogoSeccion,
} from "../views/catalogoView.js";

document.addEventListener("DOMContentLoaded", async () => {
  const contenedorProductos = document.getElementById("contenedor-productos");

  if (!contenedorProductos) {
    console.error("El contenedor de productos no se encontró en el HTML.");
    return;
  }

  try {
    pantallaCarga(true); //llamamos el metodo de la pantalla de carga, le pasamos como parametro true para que se ejecute
    //  Pedir al modelo los datos crudos desde Firebase
    const productos = await obtenerProductos();

    // Enviar a la vista (UI) los datos para que se rendericen en el contenedor
    pintarCatalogoSeccion(productos, contenedorProductos);
    modalDetallesProducto(productos);
  } catch (error) {
    console.error("No se pudo cargar inicializar el catálogo:", error);
    contenedorProductos.innerHTML = `<p class="has-text-danger">Hubo un error cargando los productos desde el servidor.</p>`;
  } finally {
    /* El finally es el bloque de codigo que se ejecutara si o si , ya sea si se ejecuto el try o el catch */
    pantallaCarga(false);
  }

  inicializarBotonesFiltro(
    obtenerProductosFiltrados,
    contenedorProductos,
    obtenerProductos,
  );
  funcionBotonFiltros();
  cargarFiltros(
    categorias,
    obtenerGenerosPorCategoria,
    obtenerTiposPrendaPorGenero,
  );
});
