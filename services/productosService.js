// 1. Importamos la DB ya configurada desde nuestro archivo secreto
import { db, storage } from "../config.js";

// 2. Importamos las funciones de Firestore que necesitamos aquí
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Función para consumir los datos de Firebase (Modelo Puro)
export async function obtenerProductos() {
  try {
    //primero obtenemos la referencia de los productos, le decimos que coleccion queremos acceder y
    //encerramos esa referencia en una variable
    const productosRef = collection(db, "productos");
    //ahora esa referencia la pasamos a otra variable para obtenerla finalmente.
    const querySnapshot = await getDocs(productosRef);

    //ya obtuvimos las variables gracias a la referencia, pero firebase siempre nos da un objeto
    //unico, que a veces es complicado de usar directamente en js, asi que con map lo convertimos
    //y lo pasamos a la variable productos
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

export async function editarProductoBaseDatos(idProducto, productoEditado) {
  try {
    //ESTA PARTE ES DE LA IA
    // 1. Preparamos un objeto limpio SOLO con los textos.
    // Lo hacemos así porque Firebase se asusta si intentamos mandarle un archivo físico (File) directo a la base de datos de texto.
    let datosAActualizar = {
      nombre: productoEditado.nombre,
      precio: productoEditado.precio,
      stock: productoEditado.stock,
      categoria: productoEditado.categoria,
      subcategoria: productoEditado.subcategoria,
      subsubcategoria: productoEditado.subsubcategoria,
    };

    //que pasa si el usuario subio una foto nueva?
    if (productoEditado.imgUpd) {
      const refImagen = ref(
        storage,
        "productos/" + productoEditado.imgUpd.name,
      );
      await uploadBytes(refImagen, productoEditado.imgUpd);
      const urlImagen = await getDownloadURL(refImagen);

      datosAActualizar.img = urlImagen;
    }

    //encontramos el producto exacto que vamos a modificar, le pasamos el parametro idProducto
    const refProducto = doc(db, "productos", idProducto);
    //actualiza el firebase
    // updateDoc es mágico: Solo reemplaza los campos que le mandas en 'datosAActualizar'.
    // Si NO le mandas el campo 'img' (porque no hubo foto nueva), Firebase deja la foto vieja intacta. ¡Una maravilla!
    await updateDoc(refProducto, datosAActualizar);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

//FUNCION PARA ELIMINAR PRODUCTO
export async function eliminarProducto(idProducto) {
  try {
    const refProducto = doc(db, "productos", idProducto);

    await deleteDoc(refProducto);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
