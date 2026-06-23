const API_URL = "https://6a2897384e1e783349a5ac26.mockapi.io/Almoxarifado";

const inputNome = document.getElementById("input-nome");
const inputQuantidade = document.getElementById("input-quantidade");
const btnCadastrar = document.getElementById("btn-cadastrar");
const listaMateriais = document.getElementById("lista-materiais");
const msgFeedback = document.getElementById("msg-feedback");
const inputRetirada = document.getElementById("input-retirada");
const inputBusca = document.getElementById("input-busca"); // SPRINT 3
const totalItens = document.getElementById("total-itens"); // SPRINT 3

// SPRINT 3: cache dos materiais para filtro local (sem nova requisição)
let todosMateriais = [];


function mostrarFeedback(mensagem, tipo = "success") {
  msgFeedback.textContent = mensagem;
  msgFeedback.className = `feedback ${tipo}`;
  setTimeout(() => {
    msgFeedback.className = "feedback hidden";
  }, 3000);
}


// SPRINT 3: renderiza a lista (recebe array já filtrado ou completo)
function renderizarMateriais(materiais) {
  // Atualiza o total de itens
  totalItens.textContent = materiais.length;

  if (materiais.length === 0) {
    listaMateriais.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">Nenhum material encontrado.</td>
      </tr>
    `;
    return;
  }

  listaMateriais.innerHTML = materiais
    .map(
      (material, index) => `
      <tr class="${material.quantidade < 10 ? "estoque-critico" : ""}">
        <td>${index + 1}</td>
        <td>${material.nome}</td>
        <td>${material.quantidade}</td>
        <td class="actions-cell">
          <button
            class="btn-baixar"
            data-id="${material.id}"
            data-estoque="${material.quantidade}"
            data-nome="${material.nome}"
          >⬇ Baixar</button>
          <button
            class="btn-excluir"
            data-id="${material.id}"
            data-nome="${material.nome}"
          >🗑 Excluir</button>
        </td>
      </tr>
    `
    )
    .join("");
}


async function carregarMateriais() {
  listaMateriais.innerHTML = `
    <tr class="loading-row">
      <td colspan="4">Carregando materiais...</td>
    </tr>
  `;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    todosMateriais = await response.json(); // SPRINT 3: salva no cache

    // Aplica filtro atual ao carregar (mantém busca ativa se houver)
    filtrarMateriais();

  } catch (error) {
    console.error("Erro ao carregar materiais:", error);
    listaMateriais.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">Erro ao carregar materiais. Verifique sua conexão e tente novamente.</td>
      </tr>
    `;
    totalItens.textContent = 0; // SPRINT 3
  }
}


// SPRINT 3: filtra localmente com base no input-busca
function filtrarMateriais() {
  const termo = inputBusca ? inputBusca.value.trim().toLowerCase() : "";

  const materiaisFiltrados = todosMateriais.filter((m) =>
    m.nome.toLowerCase().includes(termo)
  );

  renderizarMateriais(materiaisFiltrados);
}


async function cadastrarMaterial() {
  const nome = inputNome.value.trim();
  const quantidade = inputQuantidade.value.trim();

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

    inputNome.value = "";
    inputQuantidade.value = "";

    mostrarFeedback("Material cadastrado com sucesso! ✔", "success");

    await carregarMateriais();

  } catch (error) {
    console.error("Erro ao cadastrar material:", error);
    mostrarFeedback("Erro ao cadastrar material. Verifique a conexão.", "error");
  } finally {
    btnCadastrar.disabled = false;
    btnCadastrar.innerHTML = `<span class="btn-icon">＋</span> Cadastrar Material`;
  }
}

btnCadastrar.addEventListener("click", cadastrarMaterial);

inputNome.addEventListener("keydown", (e) => {
  if (e.key === "Enter") inputQuantidade.focus();
});

inputQuantidade.addEventListener("keydown", (e) => {
  if (e.key === "Enter") cadastrarMaterial();
});

// SPRINT 3: listener do campo de busca
if (inputBusca) {
  inputBusca.addEventListener("input", filtrarMateriais);
}


function validarRetirada(estoqueAtual, quantidadeRetirada) {
  if (typeof quantidadeRetirada !== "number" || Number.isNaN(quantidadeRetirada)) {
    return false;
  }

  if (quantidadeRetirada <= 0) {
    return false;
  }

  if (quantidadeRetirada > estoqueAtual) {
    return false;
  }

  return true;
}

function testarValidarRetirada() {
  const testes = [
    { estoque: 10, retirada: 5,   esperado: true,  desc: "retirada válida menor que o estoque" },
    { estoque: 5,  retirada: 10,  esperado: false,  desc: "retirada maior que o estoque" },
    { estoque: 5,  retirada: -3,  esperado: false,  desc: "retirada negativa" },
    { estoque: 5,  retirada: 0,   esperado: false,  desc: "retirada zero" },
    { estoque: 5,  retirada: 5,   esperado: true,  desc: "retirada igual ao estoque total" },
    { estoque: 5,  retirada: NaN, esperado: false,  desc: "retirada não numérica" },
  ];

  testes.forEach((teste) => {
    const resultado = validarRetirada(teste.estoque, teste.retirada);
    const passou = resultado === teste.esperado;
    console.assert(passou, `[validarRetirada] FALHOU: ${teste.desc} (estoque=${teste.estoque}, retirada=${teste.retirada})`);
    if (passou) {
      console.log(`[validarRetirada] OK: ${teste.desc}`);
    }
  });
}

async function baixarEstoque(id, estoqueAtual, nome) {
  const quantidadeRetirada = Number(inputRetirada.value);

  if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
    mostrarFeedback(
      `Quantidade inválida. Informe um valor entre 1 e ${estoqueAtual} para retirar de "${nome}".`,
      "error"
    );
    inputRetirada.focus();
    return;
  }

  const novoEstoque = estoqueAtual - quantidadeRetirada;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nome,
        quantidade: novoEstoque,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    inputRetirada.value = "";
    mostrarFeedback(`Baixa de ${quantidadeRetirada} un. em "${nome}" realizada com sucesso! ✔`, "success");

    await carregarMateriais();

  } catch (error) {
    console.error("Erro ao retirar material:", error);
    mostrarFeedback("Erro ao retirar material. Verifique a conexão.", "error");
  }
}

async function excluirMaterial(id, nome) {
  const confirmar = confirm(`Tem certeza que deseja excluir "${nome}"? Essa ação não pode ser desfeita.`);
  if (!confirmar) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    mostrarFeedback(`Material "${nome}" excluído com sucesso! ✔`, "success");

    await carregarMateriais();

  } catch (error) {
    console.error("Erro ao excluir material:", error);
    mostrarFeedback("Erro ao excluir material. Verifique a conexão.", "error");
  }
}

listaMateriais.addEventListener("click", (e) => {
  const btnBaixar = e.target.closest(".btn-baixar");
  if (btnBaixar) {
    const id = btnBaixar.dataset.id;
    const estoqueAtual = Number(btnBaixar.dataset.estoque);
    const nome = btnBaixar.dataset.nome;
    baixarEstoque(id, estoqueAtual, nome);
    return;
  }

  const btnExcluir = e.target.closest(".btn-excluir");
  if (btnExcluir) {
    const id = btnExcluir.dataset.id;
    const nome = btnExcluir.dataset.nome;
    excluirMaterial(id, nome);
  }
});

testarValidarRetirada();
carregarMateriais();
