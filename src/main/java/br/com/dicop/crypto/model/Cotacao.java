package br.com.dicop.crypto.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Cotacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "negociada_id")
    private Criptomoeda negociada;

    @ManyToOne
    @JoinColumn(name = "dolar_id")
    private Criptomoeda dolar;

    @ManyToOne
    @JoinColumn(name = "exchange_id")
    private Exchange exchange;

    private Double quantidadeDolar;
    private Double precoVenda;
    private Double precoCompra;
    private LocalDateTime criadoEm;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Criptomoeda getNegociada() {
        return negociada;
    }

    public void setNegociada(Criptomoeda negociada) {
        this.negociada = negociada;
    }

    public Criptomoeda getDolar() {
        return dolar;
    }

    public void setDolar(Criptomoeda dolar) {
        this.dolar = dolar;
    }

    public Exchange getExchange() {
        return exchange;
    }

    public void setExchange(Exchange exchange) {
        this.exchange = exchange;
    }

    public Double getQuantidadeDolar() {
        return quantidadeDolar;
    }

    public void setQuantidadeDolar(Double quantidadeDolar) {
        this.quantidadeDolar = quantidadeDolar;
    }

    public Double getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(Double precoVenda) {
        this.precoVenda = precoVenda;
    }

    public Double getPrecoCompra() {
        return precoCompra;
    }

    public void setPrecoCompra(Double precoCompra) {
        this.precoCompra = precoCompra;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
