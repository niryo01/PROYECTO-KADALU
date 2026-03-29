import { añadirProductoBaseDatos } from "../services/productosService.js";
import {
  iniciarModal,
  obtenerDatosFormularioAñadir,
} from "../views/adminView.js";

document.addEventListener("DOMContentLoaded", () => {
  //funciones
  iniciarModal();
  obtenerDatosFormularioAñadir(añadirProductoBaseDatos);
});
