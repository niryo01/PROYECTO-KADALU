//---------------------------------VARIABLES GLOBALES---------------------------------------

const modalLateralFiltros = document.getElementById("modal-filtros");
const filtroCategorias = document.getElementById("filtro-categoria");
const filtroGeneros = document.getElementById("filtro-genero");
const filtroTipos = document.getElementById("filtro-tipo");

export function pantallaCarga(mostrar) {
  //mostrar es el parametro tipo booleano
  const pantallaDeCarga = document.getElementById("pantalla-carga");

  if (mostrar) {
    pantallaDeCarga.classList.remove("is-hidden"); // muestra la pantalla de carga
  } else {
    pantallaDeCarga.classList.add("is-hidden"); // si es false, la pantalla de carga se oculta
  }
}

//-------------------------------FUNCION PARA DIBUJAR LOS PRODUCTOS--------------------------------
export function pintarCatalogoSeccion(productos, contenedorHtml) {
  //CODIGO ACTUALIZADO (para ahorrar recursos)
  //creamos una variable para almacenar el HTML con todos los productos ya obtenidos
  let productosHtml = "";
  //Recorremos el array de productos y por cada producto, creamos una tarjeta para cada uno
  productos.forEach((producto) => {
    productosHtml += `
          <div class="column is-6-mobile is-4-tablet is-3-desktop">
            <div class="card product-card" data-id="${producto.id}">
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
  //Ahora si una vez cargado todos los productos en "productosHtml", recien ahi de frente lo pasamos al contenedor HTML
  contenedorHtml.innerHTML = productosHtml;

  //ahora recien cargados todos los productos, hacemos visible el boton para filtrarlos.
  const filtrosProd = document.querySelector(".contenedor-btn-filtros");
  if (filtrosProd) {
    filtrosProd.classList.remove("is-hidden");
  }
}

export function modalDetallesProducto(productos) {
  const contenedorProductos = document.getElementById("contenedor-productos");
  const contenedorModalDetalleProducto =
    document.querySelector(".modal-content");
  const modalDetalleProducto = document.getElementById(
    "modal-detalle-producto",
  );
  const btnCerrarModalDetalleProducto = document.getElementById(
    "btn-cerrar-detalle-x",
  );
  const backgroundModalDetalleProducto =
    document.getElementById("bg-cerrar-detalle");
  contenedorProductos.addEventListener("click", (e) => {
    const cartaSeleccionada = e.target.closest(".product-card"); //le decimos que encuentre el elemento con clase "product-card" ya que ahi esta el dataid

    // Si no hicieron clic en una tarjeta (ej. clic en un espacio en blanco), detenemos la función
    if (!cartaSeleccionada) return;

    const idProductoCartaSeleccionada = cartaSeleccionada.dataset.id; //extraemos el id del producto seleccionado
    //buscamos en nuestro array de productos el ID del producto (que coincida con el id de la carta del producto seleccionado)
    const producto = productos.find(
      (p) => p.id === idProductoCartaSeleccionada,
    );
    console.log(producto);
    if (producto) {
      //si el producto fue encontrado
      contenedorModalDetalleProducto.innerHTML = `<!-- Agregamos max-width y margin auto para hacer todo el modal más pequeño y centrado -->
      <div class="  box is-radiusless p-4" style="border-radius: 12px !important; max-width: 450px; margin: 0 auto;">
        <div class="columns is-multiline">
          
          <!-- ========================================== -->
          <!--            SECCIÓN DE LA IMAGEN            -->
          <!-- ========================================== -->
          <div class="column is-12-mobile is-5-tablet has-text-centered">
            <!-- Eliminamos la clase is-4by5 que causaba el problema -->
            <figure class="image is-flex is-justify-content-center">
              <img
                src="${producto.img}"
                alt="${producto.nombre}"
                style="max-height: 220px; width: auto; object-fit: contain; border-radius: 8px;"
              />
            </figure>
          </div>

          <!-- ========================================== -->
          <!--           SECCIÓN DE LOS DETALLES          -->
          <!-- ========================================== -->
          <div class="column is-12-mobile is-7-tablet is-flex is-flex-direction-column">
            
            <!-- Título -->
            <h2 class="pt-4 title is-4 mb-2 has-text-weight-bold" style="line-height: 1.2;">
              ${producto.nombre}
            </h2>
            
            <!-- Categoría -->
            <p class="pt-4 subtitle is-7 has-text-grey mb-3">
              ${producto.categoria} > ${producto.genero}
            </p>

            <!-- Precio -->
            <p class="pt-4 title is-5 mb-4" style="color: var(--color-pink-logo)">
              S/ ${Number(producto.precio).toFixed(2)}
            </p>


            <!-- Botón Agregar -->
            <div class="mt-auto">
              <button class="button is-dark is-fullwidth is-rounded has-text-weight-bold is-small" data-id="${producto.id}">
                Agregar al pedido
              </button>
            </div>
            
          </div>
        </div>
      </div>`;
      modalDetalleProducto.classList.add("is-active");
    }
  });

  btnCerrarModalDetalleProducto.addEventListener("click", function () {
    modalDetalleProducto.classList.remove("is-active");
  });
  backgroundModalDetalleProducto.addEventListener("click", function () {
    modalDetalleProducto.classList.remove("is-active");
  });
}

//---------------------------------------------------------------------------------------------

//-----------------------FUNCION PARA ABRIR Y CERRAR EL MODAL DE FILTORS-----------------------
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
//---------------------------------------------------------------------------------------------

//------------------------FUNCION PARA CARGAR LOS FILTROS Y ENVIARLOS---------------------
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

    // ✅ CORRECCIÓN: También evaluamos "ACCESORIOS" si es que aplica la misma regla para no tener género/tipo
    if (
      valorSeleccionado === "" ||
      valorSeleccionado === "ACCESORIOS" ||
      valorSeleccionado === "OUTLET"
    ) {
      filtroGeneros.disabled = true; //deshabilitamos el elemento select
      filtroGeneros.innerHTML = `<option value="">Selecciona un género...</option>`;

      // ✅ CORRECCIÓN: Faltaba limpiar y bloquear también los tipos cuando se borra la categoría
      filtroTipos.disabled = true;
      filtroTipos.innerHTML = `<option value="">Selecciona un tipo...</option>`;

      return; //esto detiene la funcion de inmediato en este punto
      //si no estuviera aqui no habria ningun cambio visual, todo seguiria exactamente igual
      //sin embargo, en memoria aun se estaria ejecutando el codigo de abajo, que seria perdida
      //ya que como visualmente no se esta renderizado, es un proceso que en ese momento no sirve
      //con return ahorramos esos 0.00000000000000001kb de memoria
    }

    filtroGeneros.disabled = false; //habilitamos el elemento select

    // ✅ CORRECCIÓN: Al cambiar categoría, bloqueamos y limpiamos Tipo hasta que seleccione un nuevo género
    filtroTipos.disabled = true;
    filtroTipos.innerHTML = `<option value="">Selecciona un tipo...</option>`;

    //atrapamos el array de la funcion "obtenerGenerosPorCategoria" de productoService y le pasamos
    //valorSeleccionado como su parametro (esto hara que por cada seleccion, nos arroje valores
    //diferentes). Usamos callBackFuncion como nombre clave para permitir que cualquier otra funcion
    //lo utilice en un futuro simplemente modificando la su llamado en el controlador.
    const generos = callbackFuncion(valorSeleccionado);

    //una vez hecho todo eso, limpiamos las opciones de los generos con un innerHTML
    //esto para evitar que se dupliquen los generos obtenidos al cambiar entre opciones.
    filtroGeneros.innerHTML = `<option value="">Selecciona un género...</option>`;

    //ahora recorremos el array de generos, se repite lo mismo que con el array de categorias.
    // ✅ CORRECCIÓN: Programación defensiva (asegurarnos de que es un array válido antes de iterar)
    if (generos && Array.isArray(generos)) {
      generos.forEach((genero) => {
        const opcionesGenero = document.createElement("option");
        opcionesGenero.value = genero;
        opcionesGenero.textContent = genero;
        filtroGeneros.appendChild(opcionesGenero);
      });
    }
  });

  //-------------------------------------------GENEROS----------------------------------------
  filtroGeneros.addEventListener("change", (e) => {
    const generoSeleccionado = e.target.value;
    if (generoSeleccionado === "") {
      filtroTipos.disabled = true;
      // ✅ CORRECCIÓN: Limpiamos los HTML options por si había selecciones previas
      filtroTipos.innerHTML = `<option value="">Selecciona un tipo...</option>`;
      return; // ✅ CORRECCIÓN: Faltaba este return! Sin él, la línea de abajo anulaba el disabled
    }

    filtroTipos.disabled = false;

    const categoriaSeleccionada = filtroCategorias.value;

    const tipos = callbackFuncion2(categoriaSeleccionada, generoSeleccionado);

    filtroTipos.innerHTML = `<option value="">Selecciona un tipo...</option>`;

    // ✅ CORRECCIÓN: Programación defensiva con los Tipos
    if (tipos && Array.isArray(tipos)) {
      tipos.forEach((tipo) => {
        const opcionTipo = document.createElement("option");
        opcionTipo.value = tipo;
        opcionTipo.textContent = tipo;
        filtroTipos.appendChild(opcionTipo);
      });
    }
  });
}

//---------------------------------------------------------------------------------------------

//-------------------FUNCION QUE DA FUNCIONALIDAD A LOS BOTONES DE FILTRADO-------------------
export function inicializarBotonesFiltro(
  funcionCallback,
  contenedorHtml,
  funcionCallback2,
) {
  //------------------------------declaracion de variables para interaccion con el DOM
  const btnAplicarFiltros = document.getElementById("btn-aplicar-filtros");
  const btnLimpiarFiltros = document.getElementById("btn-limpiar-filtros");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const filtroGenero = document.getElementById("filtro-genero");
  const filtroTipo = document.getElementById("filtro-tipo");
  const modalFiltros = document.getElementById("modal-filtros"); //seleccionamos el modal (sera util mas abajo)

  //----------------------EVENTO DEL BOTON PARA APLICAR LOS FILTROS
  btnAplicarFiltros.addEventListener("click", async () => {
    // tenemos el objeto que guarda los filtros (por categoria, genero y tipo)
    const filtrosSeleccionados = {
      categoria: filtroCategoria.value,
      genero: filtroGenero.value,
      tipo: filtroTipo.value,
    };

    //alerta para UX(dejar en claro que los filtros estan en carga)
    Swal.fire({
      title: "Buscando...",
      text: "Aplicando filtros",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    /* Encerramos en una variable el array obtenido por la funcion encargada en productosService
  (la referenciamos como funcionCallback para respetar la estructura MVC) y le pasamos como parametro
  el objeto que contiene los filtros, para que pueda ser convertido en el array que vamos a obtener */
    const productosEncontrados = await funcionCallback(filtrosSeleccionados);

    /* llamamos e iniciamos inmediatamente a la funcion pintarCatalogoSeccion para que muestre los
    productos obtenidos de acuerdo a los filtros (estos estan dentro de productosEncontados), y le 
    pasamos como segundo parametro en que contenedor de la vista se va a dibujar */
    pintarCatalogoSeccion(productosEncontrados, contenedorHtml);

    Swal.close(); //cerrar el modal de sweet alert
    modalFiltros.classList.remove("is-active"); //cerrar el modal de filtros

    //como validacion, si no hay productos encontrados para el filtro especifico, lo dejamos en claro
    if (productosEncontrados.length === 0) {
      contenedorHtml.innerHTML = `<div class="column is-12 has-text-centered mt-5"><p class="is-size-4 has-text-grey">No se encontraron productos con estos filtros.</p></div>`;
    }
  });

  // ----------------------------EVENTO DEL BOTON PARA LIMPIAR LOS FILTROS
  btnLimpiarFiltros.addEventListener("click", async () => {
    //eliminamos los filtros de manera visual
    filtroCategoria.value = "";
    filtroGenero.value = "";
    filtroTipo.value = "";

    // tal como estaban en la funcion por defecto "cargarFiltros" volvemos a deshabilitar los selectores de genero y tipo
    filtroGenero.disabled = true;
    filtroTipo.disabled = true;
    filtroGenero.innerHTML = `<option value="">Selecciona un género...</option>`;
    filtroTipo.innerHTML = `<option value="">Selecciona el tipo...</option>`;

    Swal.fire({
      title: "Limpiando...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    /* obtenemos todos los productos de nuevo (el parametro funcionCallback2 
    sera el slot en donde ira la funcion encargada de eso (desde el controlador) */
    const productos = await funcionCallback2();

    // Volvemos a pintar el catálogo completo(como la funcion espera 2 parametros, le pasamos los productos y el contenedor donde se pintaran)
    pintarCatalogoSeccion(productos, contenedorHtml);

    Swal.close(); //cerramos modal
    modalFiltros.classList.remove("is-active"); //cerramos modal de filtros nuevamente
  });
}
