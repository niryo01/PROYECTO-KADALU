// 1. Importamos la DB ya configurada desde nuestro archivo secreto
import { db } from "../config.js";

// 2. Importamos las funciones de Firestore que necesitamos aquí
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Función para consumir los datos de Firebase (Modelo Puro)
export async function obtenerProductos() {
  console.log("Intentando conectar a Firebase para obtener productos...");
  try {
    const productosRef = collection(db, "productos");
    const querySnapshot = await getDocs(productosRef); 

    const productos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(), 
    }));
    return productos; // Retornamos los datos al Controlador
  } catch (error) {
    console.error("Error al jalar datos de Firebase:", error);
    throw error; // Propagamos el error al controlador
  }
}
