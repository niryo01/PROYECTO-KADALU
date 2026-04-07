// 1. Importamos 'auth' en lugar de (o además de) 'db'
import { auth } from "../config.js";

// 2. Importamos la función de logueo de Auth
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

export async function validarCredenciales(emailIngresado, contraseñaIngresada) {
  try {
    // Intentamos loguear directamente en los servidores de Google
    const userCredential = await signInWithEmailAndPassword(
      auth,
      emailIngresado,
      contraseñaIngresada,
    );

    // Si llegamos aquí, es porque los datos son correctos
    console.log("Usuario autenticado:", userCredential.user.uid);
    return true;
  } catch (error) {
    // Si falla (contraseña mal, usuario no existe), Firebase lanza un error
    console.error("Error de autenticación:", error.code);
    return false; // Retornamos false para que el controlador lo maneje
  }
}
