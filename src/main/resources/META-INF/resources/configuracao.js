// API endpoint
const api = "/api/configuracao";

// Elementos DOM
const formConfiguracao = document.getElementById('form-configuracao');
const mensagem = document.getElementById('mensagem');

// Carregar configurações ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarConfiguracao();
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

// Função para carregar configuração existente
async function carregarConfiguracao() {
  try {
    const response = await fetch(api);
    if (response.ok) {
      const data = await response.json();
      // Preencher o formulário com os dados existentes
      document.getElementById('idChatTelegram').value = data.idChatTelegram || '';
      document.getElementById('tokenChatTelegram').value = data.tokenChatTelegram || '';
      document.getElementById('frequenciaRobos').value = data.frequenciaRobos || '';
      // Não preencher a senha por segurança
      document.getElementById('senhaAdministrador').value = '';
    } else {
      console.log('Nenhuma configuração encontrada, formulário em branco');
    }
  } catch (error) {
    console.error('Erro ao carregar configuração:', error);
    mostrarMensagem('Erro ao carregar configuração: ' + error.message, 'erro');
  }
}

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.style.display = 'block';

  // Ocultar mensagem após 5 segundos
  setTimeout(() => {
    mensagem.style.display = 'none';
  }, 5000);
}

// Salvar configuração
formConfiguracao.addEventListener('submit', async (e) => {
  e.preventDefault();

  const configuracao = {
    id: 1, // Sempre será o ID 1, pois só existe um registro
    idChatTelegram: document.getElementById('idChatTelegram').value,
    tokenChatTelegram: document.getElementById('tokenChatTelegram').value,
    frequenciaRobos: document.getElementById('frequenciaRobos').value,
    senhaAdministrador: document.getElementById('senhaAdministrador').value
  };

  try {
    const response = await fetch(api, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(configuracao)
    });

    if (response.ok) {
      const data = await response.json();
      mostrarMensagem('Configuração salva com sucesso!', 'sucesso');
      // Limpar apenas o campo de senha por segurança
      document.getElementById('senhaAdministrador').value = '';
    } else {
      mostrarMensagem('Erro ao salvar configuração', 'erro');
    }
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    mostrarMensagem('Erro ao salvar configuração: ' + error.message, 'erro');
  }
});