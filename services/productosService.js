// 1. Importamos la DB ya configurada desde nuestro archivo secreto
import { db, storage } from "../config.js";
import { CATALOGO } from "../models/categorias.js";

//array con las CATEGORIAS (nivel 1)
export const categorias = Object.keys(CATALOGO);

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
    const nombreUnico = `${Date.now()}-${producto.img.name}`;
const refImagen = ref(storage, "productos/" + nombreUnico);
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
    return true; // Le devolvemos un "true" al Controlador para que sepa que terminamos bien
  } catch (error) {
    return false;
  }
}

export async function editarProductoBaseDatos(idProducto, productoEditado) {
  try {
    //ESTA PARTE ES DE LA IA
    // 1. Preparamos un objeto limpio SOLO con los textos.
    // Lo hacemos así porque Firebase se asusta si intentamos mandarle un archivo físico (File) directo a la base de datos de texto.
    // Como ya no editamos la clasificación, solo enviamos nombre, precio y stock.
    let datosAActualizar = {
      nombre: productoEditado.nombre,
      precio: productoEditado.precio,
      stock: productoEditado.stock,
    };

    //que pasa si el usuario subio una foto nueva?
    if (productoEditado.imgUpd) {
      // Generamos un nombre único para evitar colisiones de archivos al editar (Vulnerabilidad #2)
      const nombreUnico = `${Date.now()}-${productoEditado.imgUpd.name}`;
      const refImagen = ref(
        storage,
        "productos/" + nombreUnico,
      );
      await uploadBytes(refImagen, productoEditado.imgUpd);
      const urlImagen = await getDownloadURL(refImagen);

      datosAActualizar.img = urlImagen;
    }

    //encontramos el producto exacto que vamos a modificar, le pasamos el parametro idProducto
    const refProducto = doc(db, "productos", idProducto);
    //actualiza el firebase
    // updateDoc es mágico: Solo reemplaza los campos que le mandas en 'datosAActualizar'.
    // Los campos de categoría, género y tipo que ya existen en Firebase no se verán afectados.
    // Si NO le mandas el campo 'img' (porque no hubo foto nueva), Firebase deja la foto vieja intacta. ¡Una maravilla!
    await updateDoc(refProducto, datosAActualizar);

    return true;
  } catch (error) {
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
    return false;
  }
}

//FUNCION PARA OBTENER LOS GENEROS DE UNA CATEGORIA DE PRODUCTO
export function obtenerGenerosPorCategoria(categoriaSeleccionada) {
  // si envian un valor vacio no se le envia nada, un array sin nada de contenido
  if (!categoriaSeleccionada || !CATALOGO[categoriaSeleccionada]) {
    return [];
  }

  // Extraemos y retornamos las llaves del nivel 2
  return Object.keys(CATALOGO[categoriaSeleccionada]);
}

export function obtenerTiposPrendaPorGenero(
  categoriaSeleccionada,
  generoSeleccionado,
) {
  //Verificamos que la categoria exista en el catálogo para asi evitar errores
  if (!CATALOGO[categoriaSeleccionada]) {
    return [];
  } //si no existe devuelve un array vacio

  // Buscamos el array de prendas para ese el genero especifico (cada genero tiene distintas prendas)
  const prendas = CATALOGO[categoriaSeleccionada][generoSeleccionado];
  //OJO: DE esta forma se accede a el nivel 3 del catalogo, y como el nivel 3 son arrays, no objetos
  //NO DEBEMOS USAR EN ESTE CASO Object.keys(), porque nos daria los indices de los elementos.

  // Si el género existe dentro de esa categoría, retornamos su array contenido
  // Si no existe, retornamos uno vacio para evitar errores en consola
  if (prendas) {
    return prendas;
  } else {
    return [];
  }
}

export async function obtenerProductosFiltrados(filtros) {
  try {
    const referencia = collection(db, "productos");
    let restricciones = [];

    // 1. Evaluamos qué filtros NO están vacíos y los agregamos a la lista de restricciones
    if (filtros.categoria !== "") {
      restricciones.push(where("categoria", "==", filtros.categoria));
    }

    if (filtros.genero !== "") {
      restricciones.push(where("genero", "==", filtros.genero));
    }

    if (filtros.tipo !== "") {
      restricciones.push(where("tipo", "==", filtros.tipo));
    }

    // 2. Construimos la consulta final.
    // El operador spread (...) desempaqueta el array de restricciones y las mete en la función query()
    const consultaFinal = query(referencia, ...restricciones);

    // 3. Ejecutamos la consulta en Firebase
    const querySnapshot = await getDocs(consultaFinal);

    const productosFiltrados = [];
    querySnapshot.forEach((doc) => {
      productosFiltrados.push({ id: doc.id, ...doc.data() });
    });

    return productosFiltrados; // Devolvemos el array con los resultados
  } catch (error) {
    console.error("Error al filtrar productos:", error);
    return []; // Si hay error, devolvemos un array vacío para que no explote la página
  }
}
