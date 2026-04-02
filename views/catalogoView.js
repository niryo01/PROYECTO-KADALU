//---------------------VARIABLES GLOBALES

const modalLateralFiltros = document.getElementById("modal-filtros");
const filtroCategorias = document.getElementById("filtro-categoria");
const filtroGeneros = document.getElementById("filtro-genero");
const filtroTipos = document.getElementById("filtro-tipo");

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

export function cargarFiltros(categorias, callbackFuncion, callbackFuncion2) {
  //recorremos el array de categorias que se encuentra en productos.Service
  categorias.forEach((categoriaActual) => {
    //por cada categoria encontrada, se crea un elemento, se le asigna valor y contenido textual
    const opciones = document.createElement("option");
    opciones.value = categoriaActual;
    opciones.textContent = categoriaActual;
    filtroCategorias.appendChild(opciones); //el appendChild mete un elemento dentro de otro como si fuera un nodo
    //como resultado, filtroCategorias (el select) ahora tendra adentro a opciones (los options)
  });
  //-------------------------------------------CATEGORIAS------------------------------------------
  filtroCategorias.addEventListener("change", (e) => {
    //capturamos el valor seleccionado en una variable
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

    //atrapamos el array de la funcion "obtenerGenerosPorCategoria" de productoService y le pasamos
    //valorSeleccionado como su parametro (esto hara que por cada seleccion, nos arroje valores
    //diferentes). Usamos callBackFuncion como nombre clave para permitir que cualquier otra funcion
    //lo utilice en un futuro simplemente modificando la su llamado en el controlador.
    const generos = callbackFuncion(valorSeleccionado);

    //una vez hecho todo eso, limpiamos las opciones de los generos con un innerHTML
    //esto para evitar que se dupliquen los generos obtenidos al cambiar entre opciones.
    filtroGeneros.innerHTML = `<option value="">Selecciona un género...</option>`;

    //ahora recorremos el array de generos, se repite lo mismo que con el array de categorias.

    generos.forEach((genero) => {
      const opcionesGenero = document.createElement("option");
      opcionesGenero.value = genero;
      opcionesGenero.textContent = genero;
      filtroGeneros.appendChild(opcionesGenero);
    });
  });

  //-------------------------------------------GENEROS----------------------------------------
  filtroGeneros.addEventListener("change", (e) => {
    const generoSeleccionado = e.target.value;
    console.log(generoSeleccionado);
    if (generoSeleccionado === "") {
      filtroTipos.disabled = true;
    }
    filtroTipos.disabled = false;

    const categoriaSeleccionada = filtroCategorias.value;

    const tipos = callbackFuncion2(categoriaSeleccionada, generoSeleccionado);

    filtroTipos.innerHTML = `<option value="">Selecciona un tipo...</option>`;

    tipos.forEach((tipo) => {
      const opcionTipo = document.createElement("option");
      opcionTipo.value = tipo;
      opcionTipo.textContent = tipo;
      filtroTipos.appendChild(opcionTipo);
    });
  });
}
