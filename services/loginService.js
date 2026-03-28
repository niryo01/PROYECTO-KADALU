// 1. Importamos la DB ya configurada desde nuestro archivo secreto
import { db } from "../config.js";

// 2. Importamos las funciones de Firestore que necesitamos aquí
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Servicio que únicamente interactúa con DB y devuelve un booleano (Modelo Puro)
export async function validarCredenciales(usuarioIngresado, contraseñaIngresada) {
  try {
    const usuariosReferencia = collection(db, "usuarios");
    const consulta = query(
      usuariosReferencia,
      where("usuario", "==", usuarioIngresado),
      where("contraseña", "==", contraseñaIngresada),
    );

    const resultados = await getDocs(consulta);

    // Si está vacío, las credenciales son incorrectas
    if (resultados.empty) {
      return false; 
    } else {
      return true; // Credenciales correctas
    }
  } catch (error) {
    console.error("Error al consultar DB para login", error);
    throw error;
  }
}
