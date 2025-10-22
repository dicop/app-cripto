const api = "/api/criptomoedas";

async function listar() {
  const res = await fetch(api);
  const data = await res.json();
  montarTabela(data);
}

function montarTabela(items) {
  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";
  items.forEach(it => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${it.id || ''}</td>
                    <td>${it.nome || ''}</td>
                    <td>${it.sigla || ''}</td>
                    <td>${it.valor != null ? it.valor : ''}</td>
                    <td>
                      <button onclick="editar(${it.id})">Editar</button>
                      <button onclick="excluir(${it.id})">Excluir</button>
                    </td>`;
    tbody.appendChild(tr);
  });
}

window.editar = async function(id) {
  const res = await fetch(api + "/" + id);
  if (!res.ok) { alert("Não encontrado"); return; }
  const data = await res.json();
  document.getElementById("id").value = data.id || "";
  document.getElementById("nome").value = data.nome || "";
  document.getElementById("sigla").value = data.sigla || "";
  document.getElementById("valor").value = data.valor || "";
};

window.excluir = async function(id) {
  if (!confirm("Confirma exclusão?")) return;
  const res = await fetch(api + "/" + id, { method: "DELETE" });
  if (res.status === 204) {
    alert("Excluído");
    listar();
  } else {
    alert("Erro ao excluir");
  }
};

document.getElementById("form-criptomoeda").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("id").value;
  const payload = {
    nome: document.getElementById("nome").value,
    sigla: document.getElementById("sigla").value,
    valor: parseFloat(document.getElementById("valor").value)
  };
  let res;
  if (id) {
    res = await fetch(api + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } else {
    res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
  if (res.ok) {
    alert("Salvo com sucesso");
    limpar();
    listar();
  } else {
    alert("Erro ao salvar");
  }
});

document.getElementById("limpar").addEventListener("click", limpar);

function limpar() {
  document.getElementById("id").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("sigla").value = "";
  document.getElementById("valor").value = "";
}

document.getElementById("btn-buscar").addEventListener("click", async () => {
  const q = document.getElementById("buscar").value.trim().toLowerCase();
  if (!q) { listar(); return; }
  const res = await fetch(api);
  const items = await res.json();
  const filtrados = items.filter(i => (i.nome || '').toLowerCase().includes(q) || (i.sigla || '').toLowerCase().includes(q));
  montarTabela(filtrados);
});

// Inicial
listar();
