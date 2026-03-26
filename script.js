// 1. Importamos la DB ya configurada desde nuestro archivo secreto
import { db } from "./config.js";

// 2. Importamos las funciones de Firestore que necesitamos aquí
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

//Variables de interaccion con el DOM
const CatalogoSeccion = document.getElementById("contenedor-productos");

//Función para consumir los datos
async function cargarCatalogo() {
  console.log("Intentando conectar a Firebase...");
  try {
    const productosRef = collection(db, "productos");
    const querySnapshot = await getDocs(productosRef); //querySnapshot es mi contenedor.

    // Si llegamos aquí, ¡ya tenemos los datos!
    const productos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(), //esto le dice que traiga todo lo restante
    }));
    pintarCatalogoSeccion(productos);
  } catch (error) {
    console.error("Error al jalar datos de Firebase:", error);
  }
}

// Ejecutamos para obtener el catalogo de productos.
cargarCatalogo();

function pintarCatalogoSeccion(productos) {
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
