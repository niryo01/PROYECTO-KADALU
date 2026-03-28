const botonAbrirModalAñadir = document.getElementById("btn-open-add");
const modalAñadir = document.getElementById("modal-add-product");
const formularioAñadir = document.getElementById("form-add");
const botonCerrarModalAñadir = document.getElementById("btn-close-add");
const botonCancelarModalAñadir = document.getElementById("btn-cancel-add");

const añadirImagenProducto = document.getElementById("añadir-imagen-producto");
const añadirNombreProducto = document.getElementById("añadir-nombre-producto");
const añadirPrecioProducto = document.getElementById("añadir-precio-producto");
const añadirStockProducto = document.getElementById("añadir-stock-producto");
const añadirCategoriaProducto = document.getElementById(
  "añadir-categoria-producto",
);
const añadirSubcategoriaProducto = document.getElementById(
  "añadir-subcategoria-producto",
);
const añadirSubSubcategoriaProducto = document.getElementById(
  "añadir-sub-subcategoria-producto",
);

//funcion que abre o cierra el modal
export function iniciarModal() {
  botonAbrirModalAñadir.addEventListener("click", function () {
    modalAñadir.classList.add("is-active");
  });

  botonCerrarModalAñadir.addEventListener("click", function () {
    modalAñadir.classList.toggle("is-active"); //recordar que toggle hace lo contrario a la situacion actual de la calse
    //si esta, la quita, si no, la pone, xd
  });

  botonCancelarModalAñadir.addEventListener("click", function () {
    modalAñadir.classList.toggle("is-active");
  });
}

//funcion para atrapar el formulario y añadir un producto
export function obtenerDatosFormularioAñadir(funcionCallback) {
  formularioAñadir.addEventListener("submit", function (e) {
    e.preventDefault(); //este metodo de aqui es interesante, evita que la pagina se recarge, obligatorio usarlo
    //aca creamos un objeto llamado productoAgregar, esto sera lo que se subira al firebase y pasaremos pro su service
    const productoAgregar = {
      img: añadirImagenProducto.files[0], //usamos files porque cuando se trata de imagenes es un array, como se pueden subir multiples, obtenemos siempre la primera seleccionada
      nombre: añadirNombreProducto.value,
      precio: Number(añadirPrecioProducto.value),
      categoria: añadirCategoriaProducto.value,
      stock: Number(añadirStockProducto.value),
      subcategoria: añadirSubcategoriaProducto.value,
    };

    /* PORQUE TENEMOS ESTA CONDICIONAL?
    Porque hay productos que definitivamente tendran todos los elementos de la primera condicional 
    todo producto definitivamente tendra una categoria y como minimo una subcategoria
    pero habra productos que podran tener subsubcategoria extra, es decir , otra categoria dentro
    de esa subcategoria. Por eso existe esta condicional, si no tendra subsubcategoria,
    simplemente crea el objeto por defecto y ya.
    Pero en caso si tenga subsubcategoria, añade la variable extra al objeto
     */

    if (añadirSubSubcategoriaProducto.value !== "")
      productoAgregar.subsubcategoria = añadirSubSubcategoriaProducto.value;

    funcionCallback(productoAgregar);
  });
}
