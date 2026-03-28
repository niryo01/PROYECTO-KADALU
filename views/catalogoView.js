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
