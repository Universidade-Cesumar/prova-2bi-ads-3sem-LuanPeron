// ===========================
// Configuração da API
// ===========================
const API_URL = "https://6a2897384e1e783349a5ac26.mockapi.io/Almoxarifado";

// ===========================
// Elementos do DOM
// ===========================
const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");
const msgFeedback = document.getElementById("msg-feedback");

// ===========================
// Exibir feedback ao usuário
// ===========================
function mostrarFeedback(mensagem, tipo = "success") {
  msgFeedback.textContent = mensagem;
  msgFeedback.className = `feedback ${tipo}`;
  setTimeout(() => {
    msgFeedback.className = "feedback hidden";
  }, 3000);
}

// ===========================
// GET — Carregar materiais
// ===========================
async function carregarMateriais() {
  listaMateriais.innerHTML = `
    <tr class="loading-row">
      <td colspan="3">Carregando materiais...</td>
    </tr>
  `;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const materiais = await response.json();

    if (materiais.length === 0) {
      listaMateriais.innerHTML = `
        <tr class="empty-row">
          <td colspan="3">Nenhum material cadastrado ainda.</td>
        </tr>
      `;
      return;
    }

    listaMateriais.innerHTML = materiais
      .map(
        (material, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${material.nome}</td>
          <td>${material.quantidade}</td>
        </tr>
      `
      )
      .join("");

  } catch (error) {
    console.error("Erro ao carregar materiais:", error);
    listaMateriais.innerHTML = `
      <tr class="empty-row">
        <td colspan="3">Erro ao carregar materiais. Tente novamente.</td>
      </tr>
    `;
  }
}

// ===========================
// POST — Cadastrar material
// ===========================
async function cadastrarMaterial() {
  const nome = inputNome.value.trim();
  const quantidade = inputQuantidade.value.trim();

  // Validação
  if (!nome) {
    mostrarFeedback("Por favor, informe o nome do material.", "error");
    inputNome.focus();
    return;
  }

  if (quantidade === "" || Number(quantidade) < 0) {
    mostrarFeedback("Por favor, informe uma quantidade válida.", "error");
    inputQuantidade.focus();
    return;
  }

  // Desabilita botão durante o envio
  btnCadastrar.disabled = true;
  btnCadastrar.textContent = "Cadastrando...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nome,
        quantidade: Number(quantidade),
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // Limpa os campos
    inputNome.value = "";
    inputQuantidade.value = "";

    mostrarFeedback("Material cadastrado com sucesso! ✔", "success");

    // Recarrega a lista
    await carregarMateriais();

  } catch (error) {
    console.error("Erro ao cadastrar material:", error);
    mostrarFeedback("Erro ao cadastrar material. Verifique a conexão.", "error");
  } finally {
    btnCadastrar.disabled = false;
    btnCadastrar.innerHTML = `<span class="btn-icon">＋</span> Cadastrar Material`;
  }
}

// ===========================
// Eventos
// ===========================
btnCadastrar.addEventListener("click", cadastrarMaterial);

// Permite cadastrar com Enter nos campos
inputNome.addEventListener("keydown", (e) => {
  if (e.key === "Enter") inputQuantidade.focus();
});

inputQuantidade.addEventListener("keydown", (e) => {
  if (e.key === "Enter") cadastrarMaterial();
});

// ===========================
// Inicialização — GET ao carregar
// ===========================
carregarMateriais();