const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let feedbacks = [];

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Enviar feedback
app.post("/feedbacks/enviar", (req, res) => {
  const { nome, comentario } = req.body;

  feedbacks.push({
    nome,
    comentario
  });

  res.redirect("/feedbacks/lista");
});

// Listar feedbacks
app.get("/feedbacks/lista", (req, res) => {

  let listaHTML = "";

  feedbacks.forEach((feedback, index) => {
    listaHTML += `
      <div class="feedback">
        <h3>${feedback.nome}</h3>
        <p>${feedback.comentario}</p>

        <form action="/feedbacks/remover" method="POST">
          <input type="hidden" name="index" value="${index}">
          <button type="submit">Remover</button>
        </form>
      </div>
    `;
  });

  const pagina = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Lista de Feedbacks</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>

      <div class="container">
        <h1>Feedbacks dos Alunos</h1>

        ${listaHTML || "<p>Nenhum feedback enviado.</p>"}

        <a href="/">Voltar</a>
      </div>

    </body>
    </html>
  `;

  res.send(pagina);
});

// Remover feedback
app.post("/feedbacks/remover", (req, res) => {

  const index = req.body.index;

  feedbacks.splice(index, 1);

  res.redirect("/feedbacks/lista");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});