# Madalena's · Sistema da loja

Telas simples para a equipe preencher o dia e a Daiane ver o retorno. Cada tela é um arquivo HTML separado.

- `index.html`: a pessoa escolhe o nome (login de verdade vem depois).
- `turno.html`: Meu turno, com as seções.
- `presenca.html`: presença e apresentação (só quem tem `marcaPresenca` em `js/equipe.js`).
- `painel.html`: Painel da Daiane.

Dados: coleção `presenca` no Firestore, um documento por pessoa por dia (`2026-11-07_Natália`).
Sem `firebaseConfig` em `js/config.js`, roda em modo teste e guarda só no aparelho.

Para testar: `python3 -m http.server` nesta pasta e abrir http://localhost:8000.
