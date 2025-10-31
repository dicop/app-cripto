// Dashboard.js - Script para a página principal (dashboard)

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar dados do dashboard
  inicializarDashboard();
  
  // Inicializar menu responsivo
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

// Função para inicializar os dados do dashboard
async function inicializarDashboard() {
  try {
    // Carregar dados das criptomoedas para o dashboard
    const response = await fetch('/api/criptomoedas');
    const criptomoedas = await response.json();
    
    // Atualizar contadores
    atualizarContadores(criptomoedas);
    
    // Carregar transações recentes (simulado)
    carregarTransacoesRecentes();
    
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
  }
}

// Atualizar contadores com dados reais
function atualizarContadores(criptomoedas) {
  // Calcular valor total do portfólio (simulado)
  let valorTotal = 0;
  criptomoedas.forEach(crypto => {
    // Simulando uma quantidade aleatória para cada criptomoeda
    const quantidade = Math.random() * 10;
    valorTotal += crypto.valor * quantidade;
  });
  
  // Atualizar cards com dados reais
  document.querySelector('.dashboard-cards .card:nth-child(1) .card-value').textContent = 
    '$' + valorTotal.toFixed(2);
  
  document.querySelector('.dashboard-cards .card:nth-child(2) .card-value').textContent = 
    criptomoedas.length;
}

// Carregar transações recentes (simulado)
function carregarTransacoesRecentes() {
  // Dados simulados - em um app real, estes viriam da API
  const transacoes = [
    { crypto: 'Bitcoin', tipo: 'Compra', quantidade: '0.05 BTC', valor: '$2,150.75', data: 'Hoje, 14:30' },
    { crypto: 'Ethereum', tipo: 'Venda', quantidade: '1.2 ETH', valor: '$3,540.20', data: 'Ontem, 09:15' },
    { crypto: 'Cardano', tipo: 'Compra', quantidade: '150 ADA', valor: '$187.50', data: '22/06/2024' }
  ];
  
  const tbody = document.querySelector('.recent-transactions table tbody');
  tbody.innerHTML = '';
  
  transacoes.forEach(tx => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><i class="fab fa-${tx.crypto.toLowerCase()}"></i> ${tx.crypto}</td>
      <td class="transaction-${tx.tipo.toLowerCase()}">${tx.tipo}</td>
      <td>${tx.quantidade}</td>
      <td>${tx.valor}</td>
      <td>${tx.data}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Funcionalidade de pesquisa global
document.querySelector('.header-search button').addEventListener('click', () => {
  const termo = document.querySelector('.header-search input').value.trim();
  if (termo) {
    Swal.fire({
      icon: 'info',
      title: 'Pesquisa',
      text: `Pesquisando por: ${termo}`,
      confirmButtonColor: '#3085d6',
      timer: 2000,
      timerProgressBar: true
    });
    // Implementar lógica de pesquisa real
  }
});

// Navegação responsiva para dispositivos móveis
document.addEventListener('DOMContentLoaded', () => {
  // Adicionar classe para controle de menu em dispositivos móveis
  const menuItems = document.querySelectorAll('.sidebar-nav ul li a');
  
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remover classe active de todos os itens
      menuItems.forEach(i => i.parentElement.classList.remove('active'));
      
      // Adicionar classe active ao item clicado
      this.parentElement.classList.add('active');
      
      // Em dispositivos móveis, fechar o menu após clicar (se implementado)
    });
  });
});
