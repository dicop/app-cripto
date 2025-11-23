const apiCotacoes = "/api/cotacoes";
const apiCriptomoedas = "/api/criptomoedas";
const apiExchanges = "/api/exchanges";
const tabelaCotacoes = document.getElementById('tabela-cotacoes');
const modalCotacao = document.getElementById('modal-cotacao');
const formCotacao = document.getElementById('form-cotacao');
const btnAddCotacao = document.getElementById('btn-add-cotacao');
const modalClose = document.querySelector('.modal-close');
const btnClearForm = document.getElementById('btn-clear-form');

document.addEventListener('DOMContentLoaded', async () => {
  inicializarMenuResponsivo();
  await carregarCriptomoedas();
  await carregarExchanges();
  listarCotacoes();
  inicializarEventos();
});

function inicializarMenuResponsivo() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  if (menuToggle && sidebar && sidebarOverlay) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      sidebarOverlay.classList.toggle('active');
      document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('active');
          sidebarOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

function inicializarEventos() {
  if (btnAddCotacao) {
    btnAddCotacao.addEventListener('click', () => {
      limparFormulario();
      document.querySelector('.modal-header h2').textContent = 'Nova Cotação';
      modalCotacao.style.display = 'flex';
    });
  }
  const btnAtualizarTodos = document.getElementById('btn-atualizar-todos');
  if (btnAtualizarTodos) {
    btnAtualizarTodos.addEventListener('click', atualizarTodos);
  }
  if (modalClose) modalClose.addEventListener('click', fecharModal);
  if (btnClearForm) btnClearForm.addEventListener('click', limparFormulario);
  if (formCotacao) formCotacao.addEventListener('submit', salvarCotacao);
}

function fecharModal() { modalCotacao.style.display = 'none'; }
function limparFormulario() { formCotacao.reset(); document.getElementById('id').value = ''; }

async function listarCotacoes() {
  try {
    const resp = await fetch(apiCotacoes);
    const items = await resp.json();
    const tbody = tabelaCotacoes.querySelector('tbody');
    tbody.innerHTML = '';
    if (items.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="8" style="text-align: center;">Nenhuma cotação encontrada</td>';
      tbody.appendChild(tr);
      return;
    }
    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.negociada ? item.negociada.nome : ''}</td>
        <td>${item.dolar ? item.dolar.nome : ''}</td>
        <td>${(item.quantidadeDolar || 0).toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</td>
        <td>${item.exchange ? item.exchange.nome : ''}</td>
        <td>${(item.precoVenda || 0).toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</td>
        <td>${(item.precoCompra || 0).toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</td>
        <td class="crypto-actions">
          <button class="btn-edit" onclick="editarCotacao(${item.id})" title="Editar"><i class="fas fa-edit"></i></button>
          <button class="btn-delete" onclick="excluirCotacao(${item.id})" title="Excluir"><i class="fas fa-trash"></i></button>
          <button class="btn-refresh" onclick="atualizarPreco(${item.id})" title="Atualizar preço bybit"><i class="fas fa-sync-alt"></i></button>
          <button class="btn-binance" onclick="atualizarPrecoBinance(${item.id})" title="Atualizar preço binance"><i class="fas fa-sync-alt"></i></button>
          <button class="btn-auto-update" onclick="atualizarPrecoAuto(${item.id})" title="Atualizar Preço"><i class="fas fa-sync"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
    Swal.fire({ icon: 'error', title: 'Erro ao listar cotações' });
  }
}

async function carregarCriptomoedas() {
  try {
    const resp = await fetch(apiCriptomoedas);
    const dados = await resp.json();
    popularSelect(document.getElementById('origem'), dados);
    popularSelect(document.getElementById('destino'), dados);
  } catch (e) {
    console.error(e);
  }
}

async function carregarExchanges() {
  try {
    const resp = await fetch(apiExchanges);
    const dados = await resp.json();
    const select = document.getElementById('exchange');
    select.innerHTML = '';
    dados.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.nome || '';
      select.appendChild(opt);
    });
  } catch (e) {
    console.error(e);
  }
}

function popularSelect(select, items) {
  select.innerHTML = '';
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = `${item.nome || ''} (${item.sigla || ''})`;
    select.appendChild(opt);
  });
}

async function editarCotacao(id) {
  try {
    // Como não temos endpoint de busca por ID, vamos pegar da lista (ou implementar endpoint GET /id se necessário)
    // Mas o listar já traz tudo. Vamos simplificar e pegar do DOM ou refazer o fetch se quiser garantir dados frescos.
    // Melhor fazer um fetch da lista novamente ou filtrar se já tivermos em memória.
    // Para simplificar, vamos assumir que o backend suporta GET /api/cotacoes (que retorna lista).
    // Vamos iterar sobre a resposta do listarCotacoes se tivéssemos guardado em variável global, mas não guardamos.
    // Vamos fazer fetch da lista e filtrar.
    const resp = await fetch(apiCotacoes);
    const lista = await resp.json();
    const item = lista.find(i => i.id === id);

    if (!item) return;
    document.getElementById('id').value = item.id;
    document.getElementById('origem').value = item.negociada ? item.negociada.id : '';
    document.getElementById('destino').value = item.dolar ? item.dolar.id : '';
    document.getElementById('exchange').value = item.exchange ? item.exchange.id : '';
    document.getElementById('quantidade').value = item.quantidadeDolar;
    document.querySelector('.modal-header h2').textContent = 'Editar Cotação';
    modalCotacao.style.display = 'flex';
  } catch (e) {
    console.error(e);
  }
}

async function salvarCotacao(e) {
  e.preventDefault();
  const idVal = document.getElementById('id').value;
  const origemId = document.getElementById('origem').value;
  const destinoId = document.getElementById('destino').value;
  const exchangeId = document.getElementById('exchange').value;
  const quantidadeDolar = parseFloat(document.getElementById('quantidade').value || '0');

  const payload = {
    id: idVal ? parseInt(idVal, 10) : null,
    negociada: { id: parseInt(origemId, 10) },
    dolar: { id: parseInt(destinoId, 10) },
    exchange: { id: parseInt(exchangeId, 10) },
    quantidadeDolar
  };

  try {
    const resp = await fetch(apiCotacoes, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (resp.ok) {
      fecharModal();
      listarCotacoes();
      Swal.fire({ icon: 'success', title: 'Cotação salva', timer: 1500, showConfirmButton: false });
    } else {
      Swal.fire({ icon: 'error', title: 'Erro ao salvar' });
    }
  } catch (e) {
    console.error(e);
    Swal.fire({ icon: 'error', title: 'Erro de conexão' });
  }
}

function excluirCotacao(id) {
  Swal.fire({ icon: 'warning', title: 'Excluir cotação?', showCancelButton: true, confirmButtonText: 'Excluir', cancelButtonText: 'Cancelar', confirmButtonColor: '#d33' }).then(async r => {
    if (r.isConfirmed) {
      try {
        const resp = await fetch(`${apiCotacoes}/${id}`, { method: 'DELETE' });
        if (resp.ok) {
          listarCotacoes();
          Swal.fire('Excluído!', '', 'success');
        } else {
          Swal.fire('Erro!', 'Não foi possível excluir.', 'error');
        }
      } catch (e) {
        console.error(e);
        Swal.fire('Erro!', 'Erro de conexão.', 'error');
      }
    }
  });
}

function limparCotacoes() {
  // Não implementado para backend em massa por segurança, mas poderia ser um DELETE /api/cotacoes/all
  Swal.fire({ icon: 'info', title: 'Funcionalidade não disponível no modo servidor' });
}

async function atualizarPreco(id) {
  try {
    Swal.fire({ title: 'Atualizando...', didOpen: () => Swal.showLoading() });
    const resp = await fetch(`${apiCotacoes}/${id}/atualizar-preco`, { method: 'POST' });
    if (resp.ok) {
      await listarCotacoes();
      Swal.fire({ icon: 'success', title: 'Preço atualizado', timer: 1500, showConfirmButton: false });
    } else {
      const err = await resp.json(); // Tentar pegar msg de erro se houver
      Swal.fire({ icon: 'error', title: 'Erro ao atualizar', text: err.message || 'Verifique o console' });
    }
  } catch (e) {
    console.error(e);
    Swal.fire({ icon: 'error', title: 'Erro de conexão' });
  }
}

async function atualizarPrecoBinance(id) {
  try {
    Swal.fire({ title: 'Atualizando Binance...', didOpen: () => Swal.showLoading() });
    const resp = await fetch(`${apiCotacoes}/${id}/atualizar-preco-binance`, { method: 'POST' });
    if (resp.ok) {
      await listarCotacoes();
      Swal.fire({ icon: 'success', title: 'Preço atualizado (Binance)', timer: 1500, showConfirmButton: false });
    } else {
      const err = await resp.json();
      Swal.fire({ icon: 'error', title: 'Erro ao atualizar', text: err.message || 'Verifique o console' });
    }
  } catch (e) {
    console.error(e);
    Swal.fire({ icon: 'error', title: 'Erro de conexão' });
  }
}

async function atualizarPrecoAuto(id) {
  try {
    Swal.fire({ title: 'Atualizando...', didOpen: () => Swal.showLoading() });
    const resp = await fetch(`${apiCotacoes}/${id}/atualizar-preco-auto`, { method: 'POST' });
    if (resp.ok) {
      const data = await resp.json();
      await listarCotacoes();
      const exchangeNome = data.exchange ? data.exchange.nome : 'Exchange desconhecida';
      Swal.fire({ icon: 'success', title: `Preço atualizado (${exchangeNome})`, timer: 1500, showConfirmButton: false });
    } else {
      const err = await resp.json();
      Swal.fire({ icon: 'error', title: 'Erro ao atualizar', text: err.message || 'Verifique o console' });
    }
  } catch (e) {
    console.error(e);
    Swal.fire({ icon: 'error', title: 'Erro de conexão' });
  }
}

async function atualizarTodos() {
  try {
    Swal.fire({ title: 'Atualizando todas as cotações...', didOpen: () => Swal.showLoading() });
    const resp = await fetch(`${apiCotacoes}/atualizar-todos`, { method: 'POST' });
    if (resp.ok) {
      await listarCotacoes();
      Swal.fire({ icon: 'success', title: 'Todas as cotações foram atualizadas!', timer: 2000, showConfirmButton: false });
    } else {
      const err = await resp.json();
      Swal.fire({ icon: 'error', title: 'Erro ao atualizar', text: err.message || 'Verifique o console' });
    }
  } catch (e) {
    console.error(e);
    Swal.fire({ icon: 'error', title: 'Erro de conexão' });
  }
}