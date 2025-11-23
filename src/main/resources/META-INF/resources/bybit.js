let orderbookAsks = [];
let orderbookBids = [];

document.addEventListener('DOMContentLoaded', () => {
  inicializarMenuResponsivo();
  const baseEl = document.getElementById('baseSymbol');
  const quoteEl = document.getElementById('quoteSymbol');
  if (baseEl && !baseEl.value) baseEl.value = 'CRCLX';
  if (quoteEl && !quoteEl.value) quoteEl.value = 'USDT';
  if (baseEl) baseEl.addEventListener('change', carregarOrderbook);
  if (quoteEl) quoteEl.addEventListener('change', carregarOrderbook);
  carregarOrderbook();
  const btn = document.getElementById('btn-refresh');
  if (btn) btn.addEventListener('click', carregarOrderbook);
  const evalBtn = document.getElementById('btn-evaluate');
  if (evalBtn) evalBtn.addEventListener('click', avaliarPreco);
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

function obterSimbolos() {
  const baseEl = document.getElementById('baseSymbol');
  const quoteEl = document.getElementById('quoteSymbol');
  const base = (baseEl && baseEl.value ? baseEl.value : 'CRCLX').trim().toUpperCase();
  const quote = (quoteEl && quoteEl.value ? quoteEl.value : 'USDT').trim().toUpperCase();
  return { base, quote, symbol: base + quote };
}

async function carregarOrderbook() {
  const { base, quote, symbol } = obterSimbolos();
  const url = `https://api.bybit.com/v5/market/orderbook?category=spot&symbol=${symbol}&limit=50`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao consultar a API da Bybit');
    const data = await res.json();
    if (data.retCode !== 0 || !data.result) throw new Error('Resposta inválida da API');
    const asks = data.result.a || [];
    const bids = data.result.b || [];
    orderbookAsks = asks;
    orderbookBids = bids;
    preencherTabela('#tabela-asks', asks);
    preencherTabela('#tabela-bids', bids);
    const ts = data.result.ts || Date.now();
    const dt = new Date(ts);
    const el = document.getElementById('last-update');
    if (el) el.innerHTML = `<p>Par: ${base}/${quote} — Atualizado em: ${dt.toLocaleString()}</p>`;
    const title = document.getElementById('page-title');
    if (title) title.textContent = `Bybit - Livro de Ofertas ${base}/${quote}`;
    const priceHeaders = document.querySelectorAll('#tabela-asks thead th:first-child, #tabela-bids thead th:first-child');
    priceHeaders.forEach(th => th.textContent = `Preço (${quote})`);
    const totalHeaders = document.querySelectorAll('#tabela-asks thead th:nth-child(3), #tabela-bids thead th:nth-child(3)');
    totalHeaders.forEach(th => th.textContent = `Valor Total (${quote})`);
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: e.message,
      confirmButtonColor: '#3085d6'
    });
  }
}

function preencherTabela(selector, linhas) {
  const tbody = document.querySelector(`${selector} tbody`);
  if (!tbody) return;
  tbody.innerHTML = '';
  linhas.forEach(([preco, qtd]) => {
    const tr = document.createElement('tr');
    const tdPreco = document.createElement('td');
    const tdQtd = document.createElement('td');
    const tdTotal = document.createElement('td');
    tdPreco.textContent = formatarNumero(preco);
    tdQtd.textContent = formatarNumero(qtd);
    const p = typeof preco === 'string' ? parseFloat(preco) : preco;
    const q = typeof qtd === 'string' ? parseFloat(qtd) : qtd;
    tdTotal.textContent = formatarNumero(p * q);
    tr.appendChild(tdPreco);
    tr.appendChild(tdQtd);
    tr.appendChild(tdTotal);
    tbody.appendChild(tr);
  });
}

function formatarNumero(n) {
  const v = typeof n === 'string' ? parseFloat(n) : n;
  if (!isFinite(v)) return String(n);
  return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
}

function avaliarPreco() {
  const { base, quote } = obterSimbolos();
  const input = document.getElementById('usdtAmount');
  const val = input ? parseFloat(input.value) : NaN;
  if (!isFinite(val) || val <= 0) {
    Swal.fire({ icon: 'warning', title: 'Valor inválido', text: `Informe a quantidade de ${quote}`, confirmButtonColor: '#3085d6' });
    return;
  }
  const compra = calcularCompraPorUSDT(val, orderbookAsks);
  const venda = calcularVendaPorUSDT(val, orderbookBids);
  const el = document.getElementById('evaluation-result');
  if (el) {
    const ct = compra.liquidezSuficiente
      ? `Compra: ${formatarNumero(compra.tokens)} ${base} a preço médio ${formatarNumero(compra.precoMedio)} ${quote}`
      : `Compra: liquidez insuficiente, disponível ${formatarNumero(compra.tokens)} ${base} a preço médio ${formatarNumero(compra.precoMedio)} ${quote}`;
    const vt = venda.liquidezSuficiente
      ? `Venda: vender ${formatarNumero(venda.tokens)} ${base} a preço médio ${formatarNumero(venda.precoMedio)} ${quote}`
      : `Venda: liquidez insuficiente, seria necessário vender ${formatarNumero(venda.tokens)} ${base} (preço médio ${formatarNumero(venda.precoMedio)} ${quote})`;
    el.innerHTML = `<p>${ct}</p><p>${vt}</p>`;
  }
}

function calcularCompraPorUSDT(usdt, asks) {
  let restante = usdt;
  let tokens = 0;
  let gasto = 0;
  const ord = [...asks].map(([p, q]) => [parseFloat(p), parseFloat(q)]).sort((a, b) => a[0] - b[0]);
  for (const [p, q] of ord) {
    if (restante <= 0) break;
    const maxTokensNoNivel = restante / p;
    const tokensNoNivel = Math.min(q, maxTokensNoNivel);
    const gastoNoNivel = tokensNoNivel * p;
    tokens += tokensNoNivel;
    gasto += gastoNoNivel;
    restante -= gastoNoNivel;
  }
  const precoMedio = tokens > 0 ? gasto / tokens : 0;
  return { tokens, precoMedio, liquidezSuficiente: restante <= 1e-9 };
}

function calcularVendaPorUSDT(usdt, bids) {
  let restante = usdt;
  let tokens = 0;
  let recebido = 0;
  const ord = [...bids].map(([p, q]) => [parseFloat(p), parseFloat(q)]).sort((a, b) => b[0] - a[0]);
  for (const [p, q] of ord) {
    if (restante <= 0) break;
    const tokensNecessarios = restante / p;
    const tokensNoNivel = Math.min(q, tokensNecessarios);
    const recebidoNoNivel = tokensNoNivel * p;
    tokens += tokensNoNivel;
    recebido += recebidoNoNivel;
    restante -= recebidoNoNivel;
  }
  const precoMedio = tokens > 0 ? recebido / tokens : 0;
  return { tokens, precoMedio, liquidezSuficiente: restante <= 1e-9 };
}