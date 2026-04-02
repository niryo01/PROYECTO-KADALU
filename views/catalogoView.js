//---------------------VARIABLES GLOBALES

const modalLateralFiltros = document.getElementById("modal-filtros");
const filtroCategorias = document.getElementById("filtro-categoria");
const filtroGeneros = document.getElementById("filtro-genero");

// Función responsable de pintar datos en HTML (Vista Pura)
export function pintarCatalogoSeccion(productos, contenedorHtml) {
  // Limpiamos contenido previo
  contenedorHtml.innerHTML = "";

  productos.forEach((producto) => {
    contenedorHtml.innerHTML += `
          <div class="column is-6-mobile is-4-tablet is-3-desktop">
            <div class="card product-card">
              <div class="card-image">
                <figure class="image is-4by5">
                  <img
                    src="${producto.img}"
                    alt="${producto.nombre}"
                  />
                </figure>
              </div>
              <div class="card-content">
                <h3 class="has-text-weight-semibold">${producto.nombre}</h3>
                <p class="price">${Number(producto.precio).toFixed(2)}</p>
                <button class="button is-kadalu is-fullwidth mt-3" data-id="${producto.id}" data-precio="${producto.precio}">
                  Agregar
                </button>
              </div>
            </div>
          </div>`;
  });
}

export function funcionBotonFiltros() {
  document.addEventListener("click", function (e) {
    const botonAbrirModalFiltros = e.target.closest("#btn-abrir-filtros");
    const botonCerrarModalFiltros = e.target.closest("#btn-cerrar-filtros");
    const backgroundCerrarModalFiltros = e.target.closest("#bg-cerrar-filtros");
    if (botonAbrirModalFiltros) {
      modalLateralFiltros.classList.add("is-active");
    } else if (botonCerrarModalFiltros || backgroundCerrarModalFiltros) {
      modalLateralFiltros.classList.remove("is-active");
    }
  });
}

export function cargarFiltros(categorias, callbackFuncion) {
  categorias.forEach((categoriaActual) => {
    const opciones = document.createElement("option");
    opciones.value = categoriaActual;
    opciones.textContent = categoriaActual;
    filtroCategorias.appendChild(opciones);
  });
  filtroCategorias.addEventListener("change", (e) => {
    const valorSeleccionado = e.target.value;
    if (valorSeleccionado === "") {
      filtroGeneros.disabled = true; //deshabilitamos el elemento select
      filtroGeneros.innerHTML = `<option value="">Selecciona un género...</option>`;
      return; //esto detiene la funcion de inmediato en este punto
      //si no estuviera aqui no habria ningun cambio visual, todo seguiria exactamente igual
      //sin embargo, en memoria aun se estaria ejecutando el codigo de abajo, que seria perdida
      //ya que como visualmente no se esta renderizado, es un proceso que en ese momento no sirve
      //con return ahorramos esos 0.00000000000000001kb de memoria
    }
    filtroGeneros.disabled = false; //deshabilitamos el elemento select

    const generos = callbackFuncion(valorSeleccionado);

    filtroGeneros.innerHTML = `<option value="">Selecciona un género...</option>`;

    generos.forEach((genero) => {
      const opcionesGenero = document.createElement("option");
      opcionesGenero.value = genero;
      opcionesGenero.textContent = genero;
      filtroGeneros.appendChild(opcionesGenero);
    });
  });
}
