//Variables de interaccion con el DOM
const CatalogoSeccion = document.getElementById("contenedor-productos");

//estas funciones usan export para que puedan ser usadas y llamadas desde otros archivos
export function pintarCatalogoSeccion(productos) {
  CatalogoSeccion.innerHTML = "";
  productos.forEach((producto) => {
    CatalogoSeccion.innerHTML += `<div class="column is-6-mobile is-4-tablet is-3-desktop">
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
                <button class="button is-kadalu is-fullwidth mt-3"  data-id="${producto.id}" data-precio="${producto.precio}">
                  Agregar
                </button>
              </div>
            </div>
          </div>`;
  });
}

//Funcion que recibe y atrapa los valores de los inputs para iniciar sesion
export function configuracionLogin(funcionFirebase) {
  const formulario = document.getElementById("login-form");

  formulario.addEventListener("submit", (e) => {
    // Detenemos la recarga automática de la página
    e.preventDefault();

    const usuarioIngresado = document.getElementById("username").value;
    const contraseñaIngresada = document.getElementById("password").value;

    // Le pasamos los datos a la función de script.js que llegó como parámetro
    funcionFirebase(usuarioIngresado, contraseñaIngresada);
  });
}
