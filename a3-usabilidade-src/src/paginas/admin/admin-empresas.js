const BASE_URL = "http://localhost:3000/api/v1";

const el = {
  search: document.getElementById("searchInput"),
  btnNova: document.getElementById("btnNovaEmpresa"),
  lista: document.getElementById("empresasList"),
  modal: document.getElementById("empresaModal"),
  closeModal: document.getElementById("closeModal"),
  saveBtn: document.getElementById("saveEmpresa"),
  inputNome: document.getElementById("empresaNome"),
  inputId: document.getElementById("empresaId"),
  modalTitle: document.getElementById("modalTitle"),
  status: document.getElementById("status")
};

async function buscarEmpresas(termoBusca = "") {
  mostrarStatus("Carregando empresas...");
  
  try {
    const url = termoBusca ? `${BASE_URL}/empresas?nome=${termoBusca}` : `${BASE_URL}/empresas`;
    
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error("Erro na API");
    
    const dados = await resposta.json();
    renderizarEmpresas(dados);
  } catch (erro) {
    mostrarStatus("Não foi possível carregar as empresas. Verifique se o backend está rodando.");
  }
}

function renderizarEmpresas(empresas) {
  el.lista.innerHTML = "";
  
  if (!empresas || empresas.length === 0) {
    mostrarStatus("Nenhuma empresa encontrada.");
    return;
  }
  
  esconderStatus();

  empresas.forEach(empresa => {
    const card = document.createElement("article");
    card.className = "card content";
    card.style.minHeight = "auto";
    
    card.innerHTML = `
      <h3>${empresa.nome}</h3>
      <div class="card-footer" style="margin-top: 15px;">
        <button class="btn-light btn-editar" data-id="${empresa.id}" data-nome="${empresa.nome}">Editar</button>
        <button class="btn-cart btn-excluir" data-id="${empresa.id}" style="background: #ff4d4d; color: white; border: none;">Excluir</button>
      </div>
    `;
    
    el.lista.appendChild(card);
  });
}

function mostrarStatus(msg) {
  el.status.hidden = false;
  el.status.textContent = msg;
}

function esconderStatus() {
  el.status.hidden = true;
  el.status.textContent = "";
}

buscarEmpresas();