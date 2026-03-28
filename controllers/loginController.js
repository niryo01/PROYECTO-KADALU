import { validarCredenciales } from "../services/loginService.js";
import { configurarEventoSubmit } from "../views/loginView.js";

// 1. Creamos la lógica que dictará cómo debe comportarse el login
async function manejarLogin(usuario, contraseña) {
  try {
    // Pedimos al servicio (Modelo) que chequee Firebase (Nos retorna True o False)
    const accesoValido = await validarCredenciales(usuario, contraseña);

    if (accesoValido) {
      // Si es True, redirigimos
      console.log("Credenciales correctas. Redirigiendo a panel...");
      window.location.href = "admin.html";
    } else {
      // Si es False, avisamos al usuario a través de la UI
      console.log("Credenciales inválidas");
      alert("Usuario o contraseña incorrectos. Inténtalo otra vez.");
    }
  } catch (error) {
    console.error("Fallo durante el login:", error);
    alert("Hubo un error en la conexión. Inténtalo más tarde.");
  }
}

// 2. Le inyectamos la función directamente a la Vista para que escuche el Formulario
configurarEventoSubmit(manejarLogin);
