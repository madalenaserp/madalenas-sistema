// Monitor de erros (Sentry): avisa quando alguma tela dá erro no celular da equipe.
// O DSN não é senha: só diz para qual projeto do Sentry os erros vão.
// Só liga no site publicado; testando no computador (localhost) fica desligado.
(function () {
  if (!window.Sentry) return; // se o Sentry não carregou, o sistema segue normal
  var host = location.hostname;
  if (host === "localhost" || host === "127.0.0.1" || host === "") return;
  window.Sentry.init({
    dsn: "https://5d33391493fc006af4e81f564b442c2f@o4512422103285760.ingest.de.sentry.io/4512422142541904",
    environment: "producao",
    sendDefaultPii: false,
  });
  window.Sentry.setTag("tela", location.pathname.split("/").pop() || "index.html");
})();
