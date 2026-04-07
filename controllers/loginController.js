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
      // Se utiliza SweetAlert2 para una mejor UX al fallar contraseña (Detalle UX/UI)
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'Usuario o contraseña incorrectos. Inténtalo otra vez.',
        background: '#1e293b',
        color: '#ffffff',
        confirmButtonColor: '#ff66b2'
      });
    }
  } catch (error) {
    console.error("Fallo durante el login:", error);
    // Se utiliza SweetAlert2 para mostrar errores de conexión (Detalle UX/UI)
    Swal.fire({
      icon: 'error',
      title: 'Error de Conexión',
      text: 'Hubo un error en la conexión. Inténtalo más tarde.',
      background: '#1e293b',
      color: '#ffffff',
      confirmButtonColor: '#ff66b2'
    });
  }
}

// 2. Le inyectamos la función directamente a la Vista para que escuche el Formulario
configurarEventoSubmit(manejarLogin);
