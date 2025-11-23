package br.com.dicop.crypto.dto;

public class JupiterQuoteDTO {
    private String entrada;
    private String saidaEstimada;
    private String impactoPreco;
    private String resultadoCotacao;

    public JupiterQuoteDTO() {
    }

    public JupiterQuoteDTO(String entrada, String saidaEstimada, String impactoPreco, String resultadoCotacao) {
        this.entrada = entrada;
        this.saidaEstimada = saidaEstimada;
        this.impactoPreco = impactoPreco;
        this.resultadoCotacao = resultadoCotacao;
    }

    public String getEntrada() {
        return entrada;
    }

    public void setEntrada(String entrada) {
        this.entrada = entrada;
    }

    public String getSaidaEstimada() {
        return saidaEstimada;
    }

    public void setSaidaEstimada(String saidaEstimada) {
        this.saidaEstimada = saidaEstimada;
    }

    public String getImpactoPreco() {
        return impactoPreco;
    }

    public void setImpactoPreco(String impactoPreco) {
        this.impactoPreco = impactoPreco;
    }

    public String getResultadoCotacao() {
        return resultadoCotacao;
    }

    public void setResultadoCotacao(String resultadoCotacao) {
        this.resultadoCotacao = resultadoCotacao;
    }
}
