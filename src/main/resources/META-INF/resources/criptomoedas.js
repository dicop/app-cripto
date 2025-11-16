// API endpoint
const api = "/api/criptomoedas";
const apiRedes = "/api/redes";

// Elementos DOM
const tabelaCriptomoedas = document.getElementById('tabela-criptomoedas');
const modalCriptomoeda = document.getElementById('modal-criptomoeda');
const formCriptomoeda = document.getElementById('form-criptomoeda');
const btnAddCrypto = document.getElementById('btn-add-crypto');
const btnCancel = document.getElementById('btn-cancel');
const modalClose = document.querySelector('.modal-close');
const selectRede = document.getElementById('rede');

// Carregar criptomoedas ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
  listarCriptomoedas();
  carregarRedes();
  inicializarMenuResponsivo();
});

// Função para inicializar o menu responsivo
function inicializarMenuResponsivo() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  if (menuToggle && sidebar && sidebarOverlay) {
    // Toggle do menu
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      sidebarOverlay.classList.toggle('active');
      document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fechar menu ao clicar no overlay
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Fechar menu ao clicar em um link (para navegação mobile)
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
    
    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

// Listar todas as criptomoedas
async function listarCriptomoedas() {
  try {
    const response = await fetch(api);
    const data = await response.json();
    montarTabelaCriptomoedas(data);
  } catch (error) {
    console.error('Erro ao carregar criptomoedas:', error);
  }
}

// Montar tabela com os dados
function montarTabelaCriptomoedas(items) {
  const tbody = tabelaCriptomoedas.querySelector('tbody');
  tbody.innerHTML = '';
  
  if (items.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="7" style="text-align: center;">Nenhuma criptomoeda encontrada</td>';
    tbody.appendChild(tr);
    return;
  }
  
  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id || ''}</td>
      <td>${item.nome || ''}</td>
      <td>${item.sigla || ''}</td>
      <td>$${item.valor ? item.valor.toLocaleString('pt-BR', {minimumFractionDigits: 4, maximumFractionDigits: 4}) : ''}</td>
      <td>${item.rede && item.rede.nome ? item.rede.nome : ''}</td>
      <td>${item.contrato || ''}</td>
      <td class="crypto-actions">
        <button class="btn-edit" onclick="editarCriptomoeda(${item.id})"><i class="fas fa-edit"></i></button>
        <button class="btn-delete" onclick="excluirCriptomoeda(${item.id})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Abrir modal para adicionar nova criptomoeda
btnAddCrypto.addEventListener('click', () => {
  limparFormulario();
  document.querySelector('.modal-header h2').textContent = 'Nova Criptomoeda';
  modalCriptomoeda.style.display = 'flex';
});

// Fechar modal
function fecharModal() {
  modalCriptomoeda.style.display = 'none';
}

btnCancel.addEventListener('click', fecharModal);
modalClose.addEventListener('click', fecharModal);

// Limpar formulário
function limparFormulario() {
  formCriptomoeda.reset();
  document.getElementById('id').value = '';
  if (selectRede) {
    selectRede.value = '';
  }
}

// Editar criptomoeda
window.editarCriptomoeda = async function(id) {
  try {
    const response = await fetch(`${api}/${id}`);
    if (!response.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao buscar criptomoeda',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    const data = await response.json();
    document.getElementById('id').value = data.id || '';
    document.getElementById('nome').value = data.nome || '';
    document.getElementById('sigla').value = data.sigla || '';
    document.getElementById('valor').value = data.valor || '';
    document.getElementById('contrato').value = data.contrato || '';
    if (data.rede && data.rede.id) {
      selectRede.value = String(data.rede.id);
    }
    
    document.querySelector('.modal-header h2').textContent = 'Editar Criptomoeda';
    modalCriptomoeda.style.display = 'flex';
  } catch (error) {
    console.error('Erro ao editar criptomoeda:', error);
  }
};

// Excluir criptomoeda
window.excluirCriptomoeda = async function(id) {
  const result = await Swal.fire({
    title: 'Confirmação',
    text: 'Tem certeza que deseja excluir esta criptomoeda?',
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
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Criptomoeda excluída com sucesso!',
        confirmButtonColor: '#3085d6'
      });
      listarCriptomoedas();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao excluir criptomoeda',
        confirmButtonColor: '#3085d6'
      });
    }
  } catch (error) {
    console.error('Erro ao excluir criptomoeda:', error);
  }
};

// Salvar criptomoeda (criar ou atualizar)
formCriptomoeda.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('id').value;
  const payload = {
    nome: document.getElementById('nome').value,
    sigla: document.getElementById('sigla').value,
    valor: parseFloat(document.getElementById('valor').value),
    contrato: document.getElementById('contrato').value,
    rede: { id: parseInt(selectRede.value) }
  };
  
  try {
    let url = api;
    let method = 'POST';
    
    if (id) {
      url = `${api}/${id}`;
      method = 'PUT';
      payload.id = parseInt(id);
    }
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: id ? 'Criptomoeda atualizada com sucesso!' : 'Criptomoeda criada com sucesso!',
        confirmButtonColor: '#3085d6'
      });
      fecharModal();
      listarCriptomoedas();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao salvar criptomoeda',
        confirmButtonColor: '#3085d6'
      });
    }
  } catch (error) {
    console.error('Erro ao salvar criptomoeda:', error);
  }
});

// Carregar redes para o select
async function carregarRedes() {
  if (!selectRede) return;
  try {
    const response = await fetch(apiRedes);
    const redes = await response.json();
    selectRede.innerHTML = '<option value="" disabled selected>Selecione uma rede...</option>';
    redes.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.nome;
      selectRede.appendChild(opt);
    });
  } catch (error) {
    console.error('Erro ao carregar redes:', error);
  }
}