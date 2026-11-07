# Madalena's · Sistema da loja

Telas simples para a equipe preencher o dia e a Daiane ver o retorno. Cada tela é um arquivo HTML separado.

- `index.html`: a pessoa escolhe o nome (login de verdade vem depois).
- `turno.html`: Meu turno, com as seções.
- `presenca.html`: presença de toda a equipe, com hora de chegada (líderes e dona).
- `firestore.rules`: permissões no servidor. `firebase.json`: hospedagem.
- `painel.html`: Painel da Daiane.

Dados: `presenca` (um doc por pessoa por dia, ex. `2026-11-07_Natália`), `presenca_historico` (só acrescenta), `usuarios/{uid}` com nome, setor, papel (dona, gestor, lider, equipe) e ativo.
Sem `firebaseConfig` em `js/config.js`, roda em modo teste e guarda só no aparelho.

Para testar: `python3 -m http.server` nesta pasta e abrir http://localhost:8000.
