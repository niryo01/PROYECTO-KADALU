import { categorias } from "../services/productosService.js";

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
const añadirGeneroProducto = document.getElementById("añadir-genero-producto");
const añadirTipoProducto = document.getElementById("añadir-tipo-producto");

const editarImagenProducto = document.getElementById("editar-imagen-producto");
const editarNombreProducto = document.getElementById("editar-nombre-producto");
const editarPrecioProducto = document.getElementById("editar-precio-producto");
const editarStockProducto = document.getElementById("editar-stock-producto");

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

//Funcion para cargar las categorias , genero y tipo de los productos en el formulario de añadir producto
export function obtenerCategoriasFormularioAñadir(
  funcionCallback,
  funcionCallback2,
) {
  // Cargar categorías iniciales
  categorias.forEach((categoria) => {
    const categoriaOpcion = document.createElement("option");
    categoriaOpcion.value = categoria;
    categoriaOpcion.textContent = categoria;
    añadirCategoriaProducto.appendChild(categoriaOpcion);
  });

  // EVENTO 1: CAMBIO DE CATEGORÍA
  añadirCategoriaProducto.addEventListener("change", function (e) {
    const categoriaElegida = e.target.value;

    if (
      categoriaElegida === "" ||
      categoriaElegida === "ACCESORIOS" ||
      categoriaElegida === "OUTLET"
    ) {
      añadirGeneroProducto.disabled = true;
      añadirTipoProducto.disabled = true;

      //  reseteamos completamente el HTML interno, no solo el value
      añadirGeneroProducto.innerHTML = `<option value="">Selecciona el genero</option>`;
      añadirTipoProducto.innerHTML = `<option value="">Selecciona el tipo de producto</option>`;
    } else {
      //habilitamos genero, pero el campo de tipo aun sigue bloqueado
      añadirGeneroProducto.disabled = false;
      añadirTipoProducto.disabled = true;

      // Reseteamos el Tipo por si había datos de una selección anterior
      añadirTipoProducto.innerHTML = `<option value="">Selecciona el tipo de producto</option>`;
      añadirGeneroProducto.innerHTML = `<option value="">Selecciona el genero de la categoria</option>`;

      const generosProducto = funcionCallback(categoriaElegida);

      // CORRECCIÓN: Validamos que realmente devuelva un array antes de iterar
      if (generosProducto && Array.isArray(generosProducto)) {
        generosProducto.forEach((generoProducto) => {
          const generoProductoOpcion = document.createElement("option");
          generoProductoOpcion.value = generoProducto;
          generoProductoOpcion.textContent = generoProducto;
          añadirGeneroProducto.appendChild(generoProductoOpcion);
        });
      }
    }
  });

  // EVENTO 2: CAMBIO DE GÉNERO
  añadirGeneroProducto.addEventListener("change", function (e) {
    const generoElegido = e.target.value;

    if (generoElegido === "") {
      añadirTipoProducto.disabled = true;
      añadirTipoProducto.innerHTML = `<option value="">Selecciona el tipo de producto</option>`;
    } else {
      añadirTipoProducto.disabled = false;

      const tiposProducto = funcionCallback2(
        añadirCategoriaProducto.value,
        generoElegido,
      );

      añadirTipoProducto.innerHTML = `<option value="">Selecciona el tipo de producto</option>`;

      // CORRECCIÓN: Validamos el array antes de iterar
      if (tiposProducto && Array.isArray(tiposProducto)) {
        tiposProducto.forEach((tipoProducto) => {
          const tipoProductoOpcion = document.createElement("option");
          tipoProductoOpcion.value = tipoProducto;
          tipoProductoOpcion.textContent = tipoProducto;
          añadirTipoProducto.appendChild(tipoProductoOpcion);
        });
      }
    }
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
    };

    // 2. Condicionas el género y el tipo
    // Si el input NO está vacío, entonces sí le creas la propiedad al objeto
    if (añadirGeneroProducto.value !== "") {
      productoAgregar.genero = añadirGeneroProducto.value;
    }

    if (añadirTipoProducto.value !== "") {
      productoAgregar.tipo = añadirTipoProducto.value;
    }

    //con ayuda de la ia (ALERTA MIENTRAS SE SUBE EL PRODUCTO)
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

export function botonCerrarSesion(funcionCallBack) {
  const botonCerrarSesion = document.getElementById("btn-logout");
  botonCerrarSesion.addEventListener("click", function () {
    funcionCallBack();
  });
}

//funcion identifca que a la de catalogoView.js
export function PantallaCargaAdmin(mostrar) {
  const loader = document.getElementById("pantalla-carga-admin");
  const tabla = document.getElementById("tabla-admin");

  if (mostrar) {
    //si es true , mostrara la pantalla de carga y ocultara la tabla
    loader.classList.remove("is-hidden");
    tabla.classList.add("is-hidden");
  } else {
    //si es false, oculta la pantalla de carga y mostrara la tabla
    loader.classList.add("is-hidden");
    tabla.classList.remove("is-hidden");
  }
}

export function pintarTablaProductosAdmin(listaProductos, funcionEliminar) {
  let tablaProductos = document.getElementById("product-table-body");

  let filasTablaProductos = "";
  //pintamos el HTML de la tabla
  listaProductos.forEach((producto) => {
    // CORRECCIÓN: Actualizamos subcategoria a genero y subsubcategoria a tipo
    filasTablaProductos += `<tr> 
      <td>${producto.id}</td> 
      <td><img src="${producto.img}" alt="${producto.nombre}" width="100"></td> 
      <td>${producto.nombre}</td> 
      <td>${producto.precio}</td> 
      <td>${producto.stock}</td> 
      <td>${producto.categoria}</td> 
      <td>${producto.genero || "N/A"}</td> 
      <td>${producto.tipo || "N/A"}</td> 
      <td class="acciones-seccion"> 
        <button class="button btn-editar is-primary is-small" data-id="${producto.id}">Editar</button> 
        <button class="button btn-eliminar is-danger is-small" data-id="${producto.id}">Eliminar</button> 
      </td>
    </tr>`;
  });

  tablaProductos.innerHTML = filasTablaProductos;

  // ______Explicación de tu clonado______
  // Tu lógica del cloneNode está perfecta para limpiar eventos y que no se dupliquen
  // los clics al volver a pintar la tabla. La mantenemos tal cual.
  const tablaLimpia = tablaProductos.cloneNode(true);
  tablaProductos.parentNode.replaceChild(tablaLimpia, tablaProductos);
  tablaProductos = tablaLimpia;
  // _____________________________________

  // Le ponemos la oreja nueva a la tabla limpia
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
      formularioEditar.dataset.id = idProdSeleccionado;
      //el modal aparece al final para que salga con todos los datos ya cargados
      modalEditar.classList.add("is-active");
    } else if (botonEliminar) {
      const idProdSeleccionado = botonEliminar.dataset.id;
      const ProductoSeleccionadoEliminar = listaProductos.find(
        (p) => p.id == idProdSeleccionado,
      );

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
    // Como decidiste que no se puede editar la categoría, género ni tipo,
    // NO los incluimos aquí. El service.js (que actualizaremos a continuación)
    // solo actualizará estos 3 campos.
    const productoEditado = {
      nombre: editarNombreProducto.value,
      precio: Number(editarPrecioProducto.value),
      stock: Number(editarStockProducto.value),
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
