// Configuração do projeto Firebase "madalenas-sistema".
// Este bloco não é senha: só identifica o projeto. Quem protege os dados são o login e o firestore.rules.
export const firebaseConfig = {
  apiKey: "AIzaSyD2hnM22Jicw-tIlqkF6PVe_Pgu6QsqthU",
  authDomain: "madalenas-sistema.firebaseapp.com",
  projectId: "madalenas-sistema",
  storageBucket: "madalenas-sistema.firebasestorage.app",
  messagingSenderId: "48108956891",
  appId: "1:48108956891:web:f78029b719fd705ad1b0fe",
};

// App Check (reCAPTCHA Enterprise / Fraud Defense): só o nosso site usa a IA. Chave do SITE, pública (não é segredo).
export const appCheck = { tipo: "enterprise", chave: "6LdNhhUuAAAAAC-j3pxvssvN0V6k3gW4A5_gBg7a" };
