// c:\desenvolvimento\projetos\app-cripto\src\main\resources\META-INF\resources\exchanges.js
const api = "/api/exchanges";
const tabelaExchanges = document.getElementById('tabela-exchanges');
const modalExchange = document.getElementById('modal-exchange');
const formExchange = document.getElementById('form-exchange');
const btnAddExchange = document.getElementById('btn-add-exchange');
const btnCancel = document.getElementById('btn-cancel');
const btnLimpar = document.getElementById('btn-limpar');
const modalClose = document.querySelector('.modal-close');

document.addEventListener('DOMContentLoaded', () => {
  listarExchanges();
  inicializarMenuResponsivo();
});

function inicializarMenuResponsivo() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  if (!menuToggle || !sidebar || !sidebarOverlay) return;
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
  sidebar.querySelectorAll('a').forEach(link => {
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

async function listarExchanges() {
  try {
    const response = await fetch(api);
    const data = await response.json();
    montarTabelaExchanges(data);
  } catch (error) {
    console.error('Erro ao carregar exchanges:', error);
  }
}

function montarTabelaExchanges(items) {
  const tbody = tabelaExchanges.querySelector('tbody');
  tbody.innerHTML = '';
  if (!items || items.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="6" style="text-align: center;">Nenhuma exchange encontrada</td>';
    tbody.appendChild(tr);
    return;
  }
  items.forEach(item => {
    const taxa = typeof item.taxaNegociacao === 'number' ? item.taxaNegociacao.toFixed(2) : '';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id || ''}</td>
      <td>${item.nome || ''}</td>
      <td><a href="${item.url || '#'}" target="_blank">${item.url || ''}</a></td>
      <td>${item.tokenSeguranca || ''}</td>
      <td>${taxa}</td>
      <td class="crypto-actions">
        <button class="btn-edit" onclick="editarExchange(${item.id})"><i class="fas fa-edit"></i></button>
        <button class="btn-delete" onclick="excluirExchange(${item.id})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

btnAddExchange.addEventListener('click', () => {
  limparFormulario();
  document.querySelector('.modal-header h2').textContent = 'Nova Exchange';
  modalExchange.style.display = 'flex';
});

btnCancel.addEventListener('click', fecharModal);
modalClose.addEventListener('click', fecharModal);
btnLimpar.addEventListener('click', limparFormulario);

formExchange.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id').value || null;
  const payload = {
    nome: document.getElementById('nome').value.trim(),
    url: document.getElementById('url').value.trim(),
    tokenSeguranca: document.getElementById('tokenSeguranca').value.trim(),
    taxaNegociacao: parseFloat(document.getElementById('taxaNegociacao').value)
  };
  if (Number.isNaN(payload.taxaNegociacao)) {
    Swal.fire({ icon: 'error', title: 'Erro', text: 'Taxa de negociação inválida', confirmButtonColor: '#3085d6' });
    return;
  }
  try {
    const resp = await fetch(id ? `${api}/${id}` : api, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!resp.ok && resp.status !== 201) throw new Error('Falha na operação');
    Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Dados salvos com sucesso!', confirmButtonColor: '#3085d6' });
    fecharModal();
    listarExchanges();
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Erro', text: 'Não foi possível salvar', confirmButtonColor: '#3085d6' });
  }
});

function fecharModal() {
  modalExchange.style.display = 'none';
}

function limparFormulario() {
  formExchange.reset();
  document.getElementById('id').value = '';
}

window.editarExchange = async function(id) {
  try {
    const response = await fetch(`${api}/${id}`);
    if (!response.ok) {
      Swal.fire({ icon: 'error', title: 'Erro', text: 'Erro ao buscar exchange', confirmButtonColor: '#3085d6' });
      return;
    }
    const data = await response.json();
    document.getElementById('id').value = data.id || '';
    document.getElementById('nome').value = data.nome || '';
    document.getElementById('url').value = data.url || '';
    document.getElementById('tokenSeguranca').value = data.tokenSeguranca || '';
    document.getElementById('taxaNegociacao').value = data.taxaNegociacao ?? '';
    document.querySelector('.modal-header h2').textContent = 'Editar Exchange';
    modalExchange.style.display = 'flex';
  } catch (error) {
    console.error('Erro ao editar exchange:', error);
  }
};

window.excluirExchange = async function(id) {
  const result = await Swal.fire({
    title: 'Confirmação',
    text: 'Tem certeza que deseja excluir esta exchange?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  });
  if (!result.isConfirmed) return;
  try {
    const response = await fetch(`${api}/${id}`, { method: 'DELETE' });
    if (response.status === 204) {
      Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Exchange excluída com sucesso!', confirmButtonColor: '#3085d6' });
      listarExchanges();
    } else {
      throw new Error('Falha ao excluir');
    }
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Erro', text: 'Não foi possível excluir', confirmButtonColor: '#3085d6' });
  }
};