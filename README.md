[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/72Bdl6Wn)

# 📦 Controle de Almoxarifado

> 🔗 **Acesse o projeto em produção:** [https://universidade-cesumar.github.io/prova-2bi-ads-3sem-LuanPeron/](https://universidade-cesumar.github.io/prova-2bi-ads-3sem-LuanPeron/)

Sistema web simples para gestão de materiais em estoque, com cadastro, listagem, retirada (baixa) e exclusão de itens, integrado a uma API REST (MockAPI).

## Sobre o projeto

A aplicação permite:

- **Cadastrar** novos materiais, informando nome e quantidade inicial em estoque.
- **Listar** em tempo real todos os materiais cadastrados, consultando a API.
- **Retirar (dar baixa)** uma quantidade de um material, com validação de regras de negócio (não permite retirar valores negativos, zero ou maiores que o estoque disponível).
- **Excluir** um material da base de dados.
- **Pesquisar** materiais pelo nome em tempo real, sem nova requisição à API.
- **Visualizar o total** de itens cadastrados no dashboard.
- **Identificar visualmente** itens com estoque crítico (menos de 10 unidades), destacados em amarelo.

O projeto foi desenvolvido em três sprints:

- **Sprint 1** – Cadastro e listagem de materiais (POST e GET).
- **Sprint 2** – Regras de negócio para saída de estoque: retirada com validação (PUT) e exclusão (DELETE).
- **Sprint 3** – Dashboard, barra de pesquisa, alertas de estoque crítico, tratamento de erros e deploy.

## Tecnologias utilizadas

- **HTML5** – estrutura da página.
- **CSS3** – estilização (variáveis CSS, layout responsivo, flexbox).
- **JavaScript (Vanilla JS / ES6+)** – lógica da aplicação, manipulação do DOM e consumo da API.
- **Fetch API** – comunicação assíncrona com o backend (GET, POST, PUT, DELETE).
- **MockAPI** – API REST utilizada como backend para persistência dos dados.
- **GitHub Pages** – hospedagem e deploy do projeto.

## Estrutura do projeto

```
.
├── index.html      # Estrutura da página (formulário, dashboard, tabela, toolbar de retirada)
├── style.css       # Estilos visuais da aplicação
├── main.js         # Lógica da aplicação e integração com a API
└── README.md       # Este arquivo
```

## Funcionalidades em detalhe

### Cadastro (POST)
Formulário no topo da página com os campos "Nome do Material" e "Quantidade". Ao clicar em **Cadastrar Material**, os dados são validados e enviados à API.

### Listagem (GET)
A tabela "Materiais Cadastrados" é carregada automaticamente ao abrir a página e atualizada após qualquer cadastro, retirada ou exclusão.

### Retirada / Baixa de estoque (PUT)
1. Informe a quantidade desejada no campo **Quantidade a retirar** (acima da tabela).
2. Clique no botão **⬇ Baixar** na linha do material desejado.
3. A função `validarRetirada(estoqueAtual, quantidadeRetirada)` verifica se a operação é permitida:
   - Retorna `false` se a quantidade for negativa, zero, não numérica ou maior que o estoque atual.
   - Retorna `true` caso contrário.
4. Se válida, o novo estoque é calculado (`estoqueAtual - quantidadeRetirada`) e atualizado na API via `PUT`.
5. Se inválida, uma mensagem de erro é exibida e nenhuma requisição é feita.

### Exclusão (DELETE)
Ao clicar em **🗑 Excluir**, é solicitada uma confirmação e, em seguida, o material é removido da API e a tabela é atualizada.

### Pesquisa (Sprint 3)
O campo **Pesquisar** filtra os materiais exibidos na tabela em tempo real, com base no nome, sem realizar uma nova requisição à API.

### Dashboard — Total de itens (Sprint 3)
O contador **Total de itens** exibe quantos materiais estão atualmente listados na tabela, atualizando automaticamente após qualquer operação ou filtro de busca.

### Alerta de estoque crítico (Sprint 3)
Itens com quantidade inferior a 10 unidades recebem automaticamente a classe `estoque-critico` via JavaScript, sendo destacados visualmente em amarelo na tabela.

### Tratamento de erros (Sprint 3)
Todas as requisições à API utilizam blocos `try/catch`, garantindo que erros de rede ou respostas inesperadas sejam tratados e exibidos ao usuário sem quebrar a aplicação.

## Como executar o projeto

Por se tratar de uma aplicação 100% front-end (HTML, CSS e JS puros, sem build), basta:

1. Clonar este repositório:
   ```bash
   git clone https://github.com/Universidade-Cesumar/prova-2bi-ads-3sem-LuanPeron.git
   ```
2. Abrir o arquivo `index.html` diretamente no navegador,

   **ou** (recomendado, para evitar bloqueios de CORS em alguns navegadores) servir a pasta com um servidor local, por exemplo:
   ```bash
   # Usando Python
   python3 -m http.server 8000
   ```
   e acessar `http://localhost:8000` no navegador.

> A aplicação já está configurada para consumir o endpoint do MockAPI definido em `API_URL`, no início do arquivo `main.js`. Não é necessário nenhum backend adicional.

## Testes da lógica de validação

A função `validarRetirada` possui um conjunto de testes lógicos (`testarValidarRetirada`) executado automaticamente ao carregar a página, com os resultados exibidos no console do navegador (F12), cobrindo os cenários:

- Retirada válida (menor que o estoque).
- Retirada maior que o estoque (inválida).
- Retirada negativa (inválida).
- Retirada igual a zero (inválida).
- Retirada igual ao estoque total (válida).
- Valor não numérico (inválida).

## Histórico de desenvolvimento

O histórico de commits documenta a evolução do projeto sprint a sprint, com mensagens semânticas (`feat:`, `fix:`, `docs:`, `chore:`), refletindo o progresso real do desenvolvimento.
