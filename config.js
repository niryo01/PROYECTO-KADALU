// 1. Importamos solo lo necesario para inicializar
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Tu configuración sensible
export const firebaseConfig = {
  apiKey: "AIzaSyC3IaV-chcCbTCbWNvHd_hn7_xMmW3oHMY",
  authDomain: "kadalu-store.firebaseapp.com",
  projectId: "kadalu-store",
  storageBucket: "kadalu-store.firebasestorage.app",
  messagingSenderId: "618731058734",
  appId: "1:618731058734:web:6298e58bab3afeada091bf",
  measurementId: "G-P8EVLF6KBZ",
};

// 3. Inicializamos y exportamos la DB
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
