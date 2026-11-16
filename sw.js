// Deixa o sistema ser instalado como app. Não guarda nada: sempre busca a versão mais nova na internet
// (os dados vêm do Firebase, que já funciona sem este arquivo).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
