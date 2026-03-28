// Funcion que asocia el evento del DOM y extrae los datos (Vista Pura)
export function configurarEventoSubmit(callbackControlador) {
  const formulario = document.getElementById("login-form");

  if (!formulario) {
    console.warn("No se encontró el formulario de login en la página.");
    return;
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // Evitamos recarga

    const usuarioIngresado = document.getElementById("username").value;
    const contraseñaIngresada = document.getElementById("password").value;

    // Ejecutamos la función del Controlador que nos hayan pasado
    callbackControlador(usuarioIngresado, contraseñaIngresada);
  });
}
