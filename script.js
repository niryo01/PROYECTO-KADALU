// 1. Importamos la DB ya configurada desde nuestro archivo secreto
import { db } from "./config.js";

import { pintarCatalogoSeccion, configuracionLogin } from "./ui.js";

// 2. Importamos las funciones de Firestore que necesitamos aquí
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

async function loginValidacion(usuarioIngresado, contraseñaIngresada) {
  try {
    //armamos la referencia y le decimos donde queremos buscar
    const usuariosReferencia = collection(db, "usuarios");
    // Armamos la consulta: "Busca en la colección usuarios donde el campo 'usuario' sea igual a lo ingresado Y 'contraseña' sea igual a lo ingresado"
    const consulta = query(
      usuariosReferencia,
      where("usuario", "==", usuarioIngresado),
      where("contraseña", "==", contraseñaIngresada),
    );

    //disparamos la accion en una variable
    const resultados = await getDocs(consulta);

    if (resultados.empty) {
      console.log("epic fail");
    } else {
      console.log("Bienvenido");
      window.location.href = "admin.html";
    }
  } catch (error) {
    console.log("error fatal");
  }
}

configuracionLogin(loginValidacion);
