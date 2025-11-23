package br.com.dicop.crypto.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Exchange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String url;
    private String tokenSeguranca;
    private Double taxaNegociacao;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getTokenSeguranca() { return tokenSeguranca; }
    public void setTokenSeguranca(String tokenSeguranca) { this.tokenSeguranca = tokenSeguranca; }
    public Double getTaxaNegociacao() { return taxaNegociacao; }
    public void setTaxaNegociacao(Double taxaNegociacao) { this.taxaNegociacao = taxaNegociacao; }
}