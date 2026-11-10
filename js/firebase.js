// Liga o Firebase uma vez só. Sem firebaseConfig, devolve null (modo teste).
import { firebaseConfig } from "./config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
let pronto = null;

export const modoTeste = !firebaseConfig;

export function firebase() {
  if (modoTeste) return Promise.resolve(null);
  pronto ??= (async () => {
    const { initializeApp } = await import(`${SDK}/firebase-app.js`);
    const fs = await import(`${SDK}/firebase-firestore.js`);
    const auth = await import(`${SDK}/firebase-auth.js`);
    const app = initializeApp(firebaseConfig);
    // Long polling: no iPhone (Safari com proteção avançada e navegador de dentro de apps) a conexão padrão às vezes trava e a tela fica em branco.
    let db;
    try { db = fs.initializeFirestore(app, { experimentalForceLongPolling: true }); } catch { db = fs.getFirestore(app); }
    return { fs, db, auth, conta: auth.getAuth(app) };
  })();
  return pronto;
}
