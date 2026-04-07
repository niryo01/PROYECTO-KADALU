import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "../config.js";

export const logout = () => signOut(auth);
