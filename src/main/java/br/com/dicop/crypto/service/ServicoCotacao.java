package br.com.dicop.crypto.service;

import br.com.dicop.crypto.model.Cotacao;
import br.com.dicop.crypto.repository.CotacaoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class ServicoCotacao {

    @Inject
    CotacaoRepository cotacaoRepository;

    @Inject
    @RestClient
    BybitClient bybitClient;

    public List<Cotacao> listar() {
        return cotacaoRepository.listAll();
    }

    @Transactional
    public Cotacao salvar(Cotacao cotacao) {
        if (cotacao.getId() == null) {
            cotacao.setCriadoEm(LocalDateTime.now());
            cotacaoRepository.persist(cotacao);
        } else {
            cotacaoRepository.getEntityManager().merge(cotacao);
        }
        return cotacao;
    }

    @Transactional
    public void excluir(Long id) {
        cotacaoRepository.deleteById(id);
    }

    @Inject
    @RestClient
    BinanceClient binanceClient;

    @Inject
    @RestClient
    BitgetClient bitgetClient;

    @Transactional
    public Cotacao atualizarPreco(Long id) {
        Cotacao cotacao = cotacaoRepository.findById(id);
        if (cotacao == null) {
            throw new IllegalArgumentException("Cotação não encontrada");
        }

        String symbol = cotacao.getNegociada().getSigla() + cotacao.getDolar().getSigla();
        BybitClient.BybitResponse response = bybitClient.getOrderbook("spot", symbol, 50);

        if (response.retCode != 0 || response.result == null) {
            throw new RuntimeException("Erro ao consultar Bybit: " + response.retMsg);
        }

        double quantidadeDolar = cotacao.getQuantidadeDolar();

        // Calcular compra (usando asks)
        double precoCompra = calcularPrecoMedio(quantidadeDolar, response.result.a);

        // Calcular venda (usando bids)
        double precoVenda = calcularPrecoMedio(quantidadeDolar, response.result.b);

        cotacao.setPrecoCompra(precoCompra);
        cotacao.setPrecoVenda(precoVenda);
        cotacao.setAtualizadoEm(LocalDateTime.now());
        cotacaoRepository.getEntityManager().merge(cotacao);
        cotacaoRepository.flush();

        return cotacao;
    }

    @Transactional
    public Cotacao atualizarPrecoBinance(Long id) {
        Cotacao cotacao = cotacaoRepository.findById(id);
        if (cotacao == null) {
            throw new IllegalArgumentException("Cotação não encontrada");
        }

        String symbol = cotacao.getNegociada().getSigla() + cotacao.getDolar().getSigla();
        BinanceClient.BinanceResponse response = binanceClient.getOrderbook(symbol, 50);

        if (response == null || response.bids == null || response.asks == null) {
            throw new RuntimeException("Erro ao consultar Binance");
        }

        double quantidadeDolar = cotacao.getQuantidadeDolar();

        // Calcular compra (usando asks)
        double precoCompra = calcularPrecoMedio(quantidadeDolar, response.asks);

        // Calcular venda (usando bids)
        double precoVenda = calcularPrecoMedio(quantidadeDolar, response.bids);

        cotacao.setPrecoCompra(precoCompra);
        cotacao.setPrecoVenda(precoVenda);
        cotacao.setAtualizadoEm(LocalDateTime.now());
        cotacaoRepository.getEntityManager().merge(cotacao);
        cotacaoRepository.flush();

        return cotacao;
    }

    @Transactional
    public Cotacao atualizarPrecoBitget(Long id) {
        Cotacao cotacao = cotacaoRepository.findById(id);
        if (cotacao == null) {
            throw new IllegalArgumentException("Cotação não encontrada");
        }

        String symbol = cotacao.getNegociada().getSigla() + cotacao.getDolar().getSigla();
        BitgetClient.BitgetResponse response = bitgetClient.getOrderbook(symbol, "step0", 50);

        if (response == null || response.data == null || response.data.bids == null || response.data.asks == null) {
            throw new RuntimeException("Erro ao consultar Bitget");
        }

        double quantidadeDolar = cotacao.getQuantidadeDolar();

        double precoCompra = calcularPrecoMedio(quantidadeDolar, response.data.asks);
        double precoVenda = calcularPrecoMedio(quantidadeDolar, response.data.bids);

        cotacao.setPrecoCompra(precoCompra);
        cotacao.setPrecoVenda(precoVenda);
        cotacao.setAtualizadoEm(LocalDateTime.now());
        cotacaoRepository.getEntityManager().merge(cotacao);
        cotacaoRepository.flush();

        return cotacao;
    }

    private double calcularPrecoMedio(double usdtAmount, List<List<String>> orders) {
        double restante = usdtAmount;
        double tokens = 0;
        double financeiro = 0;

        for (List<String> order : orders) {
            if (restante <= 0)
                break;
            double preco = Double.parseDouble(order.get(0));
            double qtd = Double.parseDouble(order.get(1));

            // Para compra/venda baseada em USDT, precisamos converter
            // Se estamos comprando com USDT, queremos saber quantos tokens conseguimos
            // Se estamos vendendo para obter USDT, a lógica é um pouco diferente mas
            // o requisito diz "baseado na moeda negociada, moeda dolar e quantidade que
            // consta para o registro"
            // Assumindo que a quantidade é sempre em Dolar (USDT) para avaliar quanto
            // conseguimos comprar ou vender.

            // A lógica do bybit.js calcula:
            // Compra: quantos tokens recebo com X USDT (usando Asks)
            // Venda: quantos tokens preciso vender para receber X USDT (usando Bids) ->
            // ESPERA, o JS faz:
            // JS Venda: "vender X tokens base" ou "obter X USDT"?
            // O JS diz: calcularVendaPorUSDT(usdt, bids) -> "Venda: vender Y tokens base a
            // preço médio Z"
            // Parece que a entrada é sempre USDT.

            // Vamos replicar a lógica exata do JS para manter consistência.

            // Lógica do JS para Compra (Asks):
            // maxTokensNoNivel = restante / p;
            // tokensNoNivel = Math.min(q, maxTokensNoNivel);
            // gastoNoNivel = tokensNoNivel * p;

            // Lógica do JS para Venda (Bids):
            // tokensNecessarios = restante / p; (restante é USDT alvo)
            // tokensNoNivel = Math.min(q, tokensNecessarios);
            // recebidoNoNivel = tokensNoNivel * p;

            // Ambas as lógicas parecem iterar sobre o valor financeiro (USDT).

            double tokensNoNivel;
            double valorNoNivel;

            double tokensPossiveis = restante / preco;
            if (qtd >= tokensPossiveis) {
                tokensNoNivel = tokensPossiveis;
                valorNoNivel = restante; // ou tokensNoNivel * preco
                restante = 0;
            } else {
                tokensNoNivel = qtd;
                valorNoNivel = tokensNoNivel * preco;
                restante -= valorNoNivel;
            }

            tokens += tokensNoNivel;
            financeiro += valorNoNivel;
        }

        if (tokens == 0)
            return 0;
        return financeiro / tokens;
    }

    @Transactional
    public Cotacao atualizarPrecoAuto(Long id) {
        Cotacao cotacao = cotacaoRepository.findById(id);
        if (cotacao == null) {
            throw new IllegalArgumentException("Cotação não encontrada");
        }

        if (cotacao.getExchange() == null) {
            throw new IllegalArgumentException("Cotação sem exchange definida");
        }

        String exchangeNome = cotacao.getExchange().getNome().toLowerCase();

        if (exchangeNome.contains("bybit")) {
            return atualizarPreco(id);
        } else if (exchangeNome.contains("binance")) {
            return atualizarPrecoBinance(id);
        } else {
            throw new RuntimeException(
                    "Atualização automática não suportada para a exchange: " + cotacao.getExchange().getNome());
        }
    }

    @Transactional
    public List<Cotacao> atualizarTodos() {
        List<Cotacao> cotacoes = cotacaoRepository.listAll();
        for (Cotacao cotacao : cotacoes) {
            try {
                Cotacao atualizado = atualizarPrecoAuto(cotacao.getId());
                cotacaoRepository.getEntityManager().merge(atualizado);
            } catch (Exception e) {
                // Log the error but continue with other quotations
                System.err.println("Erro ao atualizar cotação " + cotacao.getId() + ": " + e.getMessage());
            }
        }
        cotacaoRepository.flush();
        return cotacaoRepository.listAll();
    }
}
