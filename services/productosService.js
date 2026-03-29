// 1. Importamos la DB ya configurada desde nuestro archivo secreto
import { db, storage } from "../config.js";

// 2. Importamos las funciones de Firestore que necesitamos aquí
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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

export async function añadirProductoBaseDatos(producto) {
  try {
    //_______________________PASO 1 : primero debemos guardar la foto fisica en el storage de firebase
    const refImagen = ref(storage, "productos/" + producto.img.name); //referencia para Storage (la carpeta y el nombre del archivo)
    /* Es como decir:
    Prepárate, porque voy a usar mi disco duro (storage), dentro de la carpeta productos/, 
    y el archivo se llamará exactamente igual que en la PC del usuario (producto.img.name)". */

    await uploadBytes(refImagen, producto.img); // Subimos el archivo físico (usamos uploadBytes, NO addDoc)
    /* Agarra el archivo pesado de tu computadora y lo sube físicamente a 
    los servidores de Google en la dirección que escribiste arriba.
    Usamos await porque es interaccion directa con firebase y ademas el proceso tarda, debemos asegurarnos
    que si o si se ejecuta, por eso el await */

    const urlImagen = await getDownloadURL(refImagen); // Obtenemos la URL pasándole la misma referencia
    /* Una vez que el archivo ya está en el servidor de Google, esta función va a esa misma dirección 
    y le dice a Firebase:
     "Genera un link web seguro (https://...) para que cualquier persona en el mundo pueda ver esta foto */

    //____________________PASO 2: ahora si subimos el objeto (que es el producto a añadir) al fire base
    producto.img = urlImagen;

    const referencia = collection(db, "productos");
    const query = await addDoc(referencia, producto);
    console.log("¡Producto guardado con ID: ", query.id);
    return true; // Le devolvemos un "true" al Controlador para que sepa que terminamos bien
  } catch (error) {
    console.log("No se pudo añadir producto a la base de datos", error);
    return false;
  }
}
