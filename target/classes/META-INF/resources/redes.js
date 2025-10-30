// API endpoint
const api = "/api/redes";

// Elementos DOM
const tabelaRedes = document.getElementById('tabela-redes');
const modalRede = document.getElementById('modal-rede');
const formRede = document.getElementById('form-rede');
const btnAddRede = document.getElementById('btn-add-rede');
const btnCancel = document.getElementById('btn-cancel');
const modalClose = document.querySelector('.modal-close');

// Carregar redes ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
  listarRedes();
});

// Listar todas as redes
async function listarRedes() {
  try {
    const response = await fetch(api);
    const data = await response.json();
    montarTabelaRedes(data);
  } catch (error) {
    console.error('Erro ao carregar redes:', error);
  }
}

// Montar tabela com os dados
function montarTabelaRedes(items) {
  const tbody = tabelaRedes.querySelector('tbody');
  tbody.innerHTML = '';
  
  if (items.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="4" style="text-align: center;">Nenhuma rede encontrada</td>';
    tbody.appendChild(tr);
    return;
  }
  
  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id || ''}</td>
      <td>${item.nome || ''}</td>
      <td><a href="${item.linkExplorer}" target="_blank">${item.linkExplorer || ''}</a></td>
      <td class="crypto-actions">
        <button class="btn-edit" onclick="editarRede(${item.id})"><i class="fas fa-edit"></i></button>
        <button class="btn-delete" onclick="excluirRede(${item.id})"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Abrir modal para adicionar nova rede
btnAddRede.addEventListener('click', () => {
  limparFormulario();
  document.querySelector('.modal-header h2').textContent = 'Nova Rede';
  modalRede.style.display = 'flex';
});

// Fechar modal
function fecharModal() {
  modalRede.style.display = 'none';
}

btnCancel.addEventListener('click', fecharModal);
modalClose.addEventListener('click', fecharModal);

// Limpar formulário
function limparFormulario() {
  formRede.reset();
  document.getElementById('id').value = '';
}

// Editar rede
window.editarRede = async function(id) {
  try {
    const response = await fetch(`${api}/${id}`);
    if (!response.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao buscar rede',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    const data = await response.json();
    document.getElementById('id').value = data.id || '';
    document.getElementById('nome').value = data.nome || '';
    document.getElementById('linkExplorer').value = data.linkExplorer || '';
    
    document.querySelector('.modal-header h2').textContent = 'Editar Rede';
    modalRede.style.display = 'flex';
  } catch (error) {
    console.error('Erro ao editar rede:', error);
  }
};

// Excluir rede
window.excluirRede = async function(id) {
  const result = await Swal.fire({
    title: 'Confirmação',
    text: 'Tem certeza que deseja excluir esta rede?',
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
        text: 'Rede excluída com sucesso!',
        confirmButtonColor: '#3085d6'
      });
      listarRedes();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao excluir rede',
        confirmButtonColor: '#3085d6'
      });
    }
  } catch (error) {
    console.error('Erro ao excluir rede:', error);
  }
};

// Salvar rede (criar ou atualizar)
formRede.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('id').value;
  const payload = {
    nome: document.getElementById('nome').value,
    linkExplorer: document.getElementById('linkExplorer').value
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
        text: id ? 'Rede atualizada com sucesso!' : 'Rede criada com sucesso!',
        confirmButtonColor: '#3085d6'
      });
      fecharModal();
      listarRedes();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao salvar rede',
        confirmButtonColor: '#3085d6'
      });
    }
  } catch (error) {
    console.error('Erro ao salvar rede:', error);
  }
});