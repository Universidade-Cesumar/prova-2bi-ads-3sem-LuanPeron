
const API_URL = "https://6a2897384e1e783349a5ac26.mockapi.io/Almoxarifado";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");
const msgFeedback = document.getElementById("msg-feedback");
const inputRetirada = document.getElementById("input-retirada");


function mostrarFeedback(mensagem, tipo = "success") {
  msgFeedback.textContent = mensagem;
  msgFeedback.className = `feedback ${tipo}`;
  setTimeout(() => {
    msgFeedback.className = "feedback hidden";
  }, 3000);
}

