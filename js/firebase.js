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
    // Detecta sozinho quando a rede do celular precisa de long polling (mais rápido que forçar sempre).
    let db;
    try { db = fs.initializeFirestore(app, { experimentalAutoDetectLongPolling: true }); } catch { db = fs.getFirestore(app); }
    return { fs, db, auth, conta: auth.getAuth(app) };
  })();
  return pronto;
}
