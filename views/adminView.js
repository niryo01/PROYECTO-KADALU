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
  formularioAñadir.addEventListener("submit", async function (e) {
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
    Porque todo producto definitivamente tendra una categoria y como minimo una subcategoria (eso es lo esperado y la idea original)
    pero habra productos que podran tener subsubcategoria extra, es decir , otra categoria dentro
    de esa subcategoria. Por eso existe esta condicional, si no tendra subsubcategoria,
    simplemente crea el objeto por defecto completando sus respectivos y ya.
    Pero en caso si tenga subsubcategoria, añade la variable extra al objeto.
    Esto nos permite evitar errores de null, que aunque pueden ocurrir, no es lo recomendable permitirlo a nivel de noSQL
    y en SQL eso seria fatal.
     */

    if (añadirSubSubcategoriaProducto.value !== "")
      productoAgregar.subsubcategoria = añadirSubSubcategoriaProducto.value;

    //con ayuda de la ia
    Swal.fire({
      title: "Cargando",
      text: "Subiendo producto...",
      allowOutsideClick: false, // Evita que el usuario lo cierre dando clic afuera
      showConfirmButton: false, // Ocultamos el botón porque solo deben esperar
      didOpen: () => {
        Swal.showLoading(); // ¡Esta es la línea mágica que hace aparecer la ruedita!
      },
    });

    //creamos una variable para utilizar el return (true o false) del try catch en los services.
    //como la funcion que tomara el molde de "funcionCallBack" sera de tipo asincrono, la variable
    //tambien debe encerrar una variable await porque no ejecutaremos nada de lo que esta debajo
    //si esta funcion (o variable en este contexto) no obtiene algo
    const OperacionExitosa = await funcionCallback(productoAgregar);
    if (OperacionExitosa === true) {
      //si la operacion fue exitosa y devolvio true (osea que la funcion de productosService logro llevarse a cabo)
      Swal.fire({
        //muestra una alerta con sweet 2alert que es bastante util y moderno
        title: "¡Éxito!",
        text: "El producto ha sido agregado correctamente",
        icon: "success",
        confirmButtonText: "Genial",
      });
      formularioAñadir.reset(); //esto elimina los campos, es una ayudita de JS para cuando usamos forms
      modalAñadir.classList.toggle("is-active");
    } else {
      //caso contrario (obviamente por logica es que si no es true, es false al no decirle explicitamente un escenario)
      Swal.fire({
        title: "Error!",
        text: "No se pudo subir a la nube. Intenta de nuevo",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  });
}
