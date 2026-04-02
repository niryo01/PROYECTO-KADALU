import {
  categorias,
  obtenerGenerosPorCategoria,
  obtenerProductos,
} from "../services/productosService.js";
import {
  cargarFiltros,
  funcionBotonFiltros,
  pintarCatalogoSeccion,
} from "../views/catalogoView.js";

document.addEventListener("DOMContentLoaded", async () => {
  const contenedorProductos = document.getElementById("contenedor-productos");

  if (!contenedorProductos) {
    console.error("El contenedor de productos no se encontró en el HTML.");
    return;
  }

  try {
    // 1. Pedir al modelo los datos crudos desde Firebase
    const productos = await obtenerProductos();

    // 2. Enviar a la vista (UI) los datos para que se rendericen en el contenedor
    pintarCatalogoSeccion(productos, contenedorProductos);
  } catch (error) {
    console.error("No se pudo cargar inicializar el catálogo:", error);
    contenedorProductos.innerHTML = `<p class="has-text-danger">Hubo un error cargando los productos desde el servidor.</p>`;
  }

  funcionBotonFiltros();
  cargarFiltros(categorias, obtenerGenerosPorCategoria);
});
