//----------------------------------------VARIABLES DEL DOM-------------------------------------------

const botonAbrirModalAñadir = document.getElementById("btn-open-add");
const modalAñadir = document.getElementById("modal-add-product");
const formularioAñadir = document.getElementById("form-add");
const botonCerrarModalAñadir = document.getElementById("btn-close-add");
const botonCancelarModalAñadir = document.getElementById("btn-cancel-add");

let tablaProductos = document.getElementById("product-table-body");
const modalEditar = document.getElementById("modal-edit-product");
const botonCerrarModalEditar = document.getElementById("btn-close-edit");
const formularioEditar = document.getElementById("form-edit");
const botonCancelarModalEditar = document.getElementById("btn-cancel-edit");

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

const editarImagenProducto = document.getElementById("editar-imagen-producto");
const editarNombreProducto = document.getElementById("editar-nombre-producto");
const editarPrecioProducto = document.getElementById("editar-precio-producto");
const editarStockProducto = document.getElementById("editar-stock-producto");
const editarCategoriaProducto = document.getElementById(
  "editar-categoria-producto",
);
const editarSubcategoriaProducto = document.getElementById(
  "editar-subcategoria-producto",
);
const editarSubSubcategoriaProducto = document.getElementById(
  "editar-subsubcategoria-producto",
);

//----------------------------------------------FUNCIONES-----------------------------------------------

//funcion que abre o cierra el modal
export function iniciarModal() {
  botonAbrirModalAñadir.addEventListener("click", function () {
    modalAñadir.classList.add("is-active");
  });

  botonCerrarModalAñadir.addEventListener("click", function () {
    modalAñadir.classList.toggle("is-active"); //recordar que toggle hace lo contrario a la situacion actual de la calse
    //si esta, la quita, si no, la pone, xd
  });

  botonCerrarModalEditar.addEventListener("click", function () {
    modalEditar.classList.toggle("is-active");
  });

  botonCancelarModalAñadir.addEventListener("click", function () {
    modalAñadir.classList.toggle("is-active");
  });

  botonCancelarModalEditar.addEventListener("click", function () {
    modalEditar.classList.toggle("is-active");
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
        // Recarga la página automáticamente
      }).then(() => {
        // Todo lo que esté aquí adentro ocurrirá CUANDO el usuario haga clic en "Okay"
        window.location.reload(); // Recarga la página automáticamente
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

export function pantallaCargaProductos() {
  const contenedor = document.querySelector(".table-container");
  contenedor.innerHTML = `
    <div class="has-text-centered p-5">
      <i class="fas fa-spinner fa-spin is-size-2"></i> 
      <p class="mt-3 is-size-5">Cargando catálogo de productos...</p>
    </div>
  `;
  contenedor.classList.add("animate__animated", "animate__fadeInUp");
}

export function pintarTabla() {
  const tablaContenedor = document.querySelector(".table-container");
  tablaContenedor.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio (S/)</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Sub-categoría</th>
                <th>Sub-subcategoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="product-table-body"></tbody>
          </table>`;
}
export function pintarTablaProductosAdmin(listaProductos, funcionEliminar) {
  tablaProductos = document.getElementById("product-table-body");
  //vaciamos la el html para que se vuelva a pintar correctamente
  tablaProductos.innerHTML = "";
  //pintamos el HTML de la tabla
  listaProductos.forEach((producto) => {
    tablaProductos.innerHTML += `<tr> <td>${producto.id}</td> <td><img src="${producto.img}" 
    alt="${producto.nombre}" width="100"></td> <td>${producto.nombre}</td> 
    <td>${producto.precio}</td> <td>${producto.stock}</td> 
    <td>${producto.categoria}</td> <td>${producto.subcategoria}</td> 
    <td>${producto.subsubcategoria || "N/A"}</td> 
    <td class="acciones-seccion"> <button class="button btn-editar is-primary is-small" data-id="${producto.id}">Editar</button> <button class="button btn-eliminar is-danger is-small" data-id="${producto.id}">Eliminar</button> </td>
    </tr>`;
  });

  //______requiere explicacion
  const tablaLimpia = tablaProductos.cloneNode(true);
  tablaProductos.parentNode.replaceChild(tablaLimpia, tablaProductos);
  tablaProductos = tablaLimpia; // <-- ¡AÑADE ESTA LÍNEA!
  //____________________________

  // 3. Le ponemos la oreja nueva a la tabla limpia
  tablaLimpia.addEventListener("click", function (e) {
    const botonEditar = e.target.closest(".btn-editar");
    const botonEliminar = e.target.closest(".btn-eliminar");

    if (botonEditar) {
      const idProdSeleccionado = botonEditar.dataset.id;
      const ProductoSeleccionadoEditar = listaProductos.find(
        (producto) => producto.id == idProdSeleccionado,
      );
      //ahora hacemos que en el modal carguen todos los datos del producto a editar (para justamente proceder a editarlos y reemplazarlos)
      editarNombreProducto.value = ProductoSeleccionadoEditar.nombre;
      editarPrecioProducto.value = ProductoSeleccionadoEditar.precio;
      editarStockProducto.value = ProductoSeleccionadoEditar.stock;
      editarCategoriaProducto.value = ProductoSeleccionadoEditar.categoria;
      editarSubcategoriaProducto.value =
        ProductoSeleccionadoEditar.subcategoria;
      editarSubSubcategoriaProducto.value =
        ProductoSeleccionadoEditar.subsubcategoria || ""; //si no tiene subsubcategoria, que deje el campo vacio
      /* Ahora le asignamos el id tambien al formulario, esto porque al ejecutar el evento "submit", el formulario
      debe saber exactamente que producto esta editando para no confundirse, y para que eso ocurra, debemos
      asegurarnos que el formulario conoce el ID del producto que esta editando, asi que le asignamos el id
      con el dataset */
      formularioEditar.dataset.id = idProdSeleccionado;
      //el modal aparece al final para que salga con todos los datos ya cargados
      modalEditar.classList.add("is-active");
    } else if (botonEliminar) {
      const idProdSeleccionado = botonEliminar.dataset.id;
      const ProductoSeleccionadoEliminar = listaProductos.find(
        (p) => p.id == idProdSeleccionado,
      );

      console.log("A punto de eliminar:", ProductoSeleccionadoEliminar);
      Swal.fire({
        title: "Estas seguro?",
        text: "Una vez eliminado el producto no podras deshacer este cambio!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar producto",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Estas 100% seguro?",
            text: "Queremos asegurarnos que realmente querias eliminarlo!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, quiero eliminarlo definitivamente!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Cargando",
                text: "Eliminando producto...",
                allowOutsideClick: false, // Evita que el usuario lo cierre dando clic afuera
                showConfirmButton: false, // Ocultamos el botón porque solo deben esperar
                didOpen: () => {
                  Swal.showLoading(); // ¡Esta es la línea mágica que hace aparecer la ruedita!
                },
              });
              const huboExito = await funcionEliminar(idProdSeleccionado);
              if (huboExito === true) {
                Swal.fire({
                  title: "Producto Eliminado!",
                  text: "El producto ha sido eliminado correctamente",
                  icon: "success",
                  confirmButtonText: "Okay",
                }).then(() => {
                  // Todo lo que esté aquí adentro ocurrirá CUANDO el usuario haga clic en "Okay"
                  window.location.reload(); // Recarga la página automáticamente
                });
              } else {
                Swal.fire({
                  title: "Error!",
                  text: "No se pudo eliminar el producto. Intenta de nuevo",
                  icon: "error",
                  confirmButtonText: "Okay",
                });
              }
            }
          });
        }
      });
    }
  });
}

export function obtenerDatosFormularioEditar(funcionCallBack) {
  formularioEditar.addEventListener("submit", async function (e) {
    e.preventDefault();

    // de nuevo atrapamos el ID
    const idProductoEditar = formularioEditar.dataset.id;

    // creamos el nuevo producto esta vez editado, pero que conserva su ID
    const productoEditado = {
      nombre: editarNombreProducto.value,
      precio: Number(editarPrecioProducto.value),
      stock: Number(editarStockProducto.value),
      categoria: editarCategoriaProducto.value,
      subcategoria: editarSubcategoriaProducto.value,
      subsubcategoria: editarSubSubcategoriaProducto.value || "",
    };

    //esta condicional es obligatoria para manejar si es que se subio una nueva imagen
    if (editarImagenProducto.files.length > 0) {
      //recordemos que los inputs para imagenes funcionan como array, asi que si reconoce que el array
      //es diferente de 0 (osea se agrego al nuevo) se le añade como nuevo atributo al objeto
      productoEditado.imgUpd = editarImagenProducto.files[0];
    } else {
      //si no hay nada seleccionado simplemente no se sube nada, le decimos que no hay nada nuevo
      productoEditado.imgUpd = null;
    }

    Swal.fire({
      title: "Cargando",
      text: "Editando producto...",
      allowOutsideClick: false, // Evita que el usuario lo cierre dando clic afuera
      showConfirmButton: false, // Ocultamos el botón porque solo deben esperar
      didOpen: () => {
        Swal.showLoading(); // ¡Esta es la línea mágica que hace aparecer la ruedita!
      },
    });

    const huboExito = await funcionCallBack(idProductoEditar, productoEditado);
    if (huboExito === true) {
      Swal.fire({
        title: "Producto Editado!",
        text: "La informacion se actualizo correctamente",
        icon: "success",
        confirmButtonText: "Okay",
      }).then(() => {
        // Todo lo que esté aquí adentro ocurrirá CUANDO el usuario haga clic en "Okay"
        window.location.reload(); // Recarga la página automáticamente
      });
      formularioEditar.reset();
      modalEditar.classList.toggle("is-active");
    } else {
      Swal.fire({
        title: "Error!",
        text: "No se pudo actualizar el producto. Intenta de nuevo",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  });
}
