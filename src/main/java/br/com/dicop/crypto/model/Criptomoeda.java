package br.com.dicop.crypto.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Criptomoeda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String sigla;
    private Double valor;

    // Nova relação: a criptomoeda pertence a uma Rede
    @NotNull
    @ManyToOne
    @JoinColumn(name = "rede_id")
    private Rede rede;

    @ManyToOne
    @JoinColumn(name = "exchange_id")
    private Exchange exchange;

    // Novo campo: contrato da criptomoeda na rede (alfanumérico)
    @NotBlank
    @Column(name = "contrato", length = 100)
    private String contrato;

    @Column(name = "quantidade_casas_decimais")
    private Integer quantidadeCasasDecimais;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Rede getRede() {
        return rede;
    }

    public void setRede(Rede rede) {
        this.rede = rede;
    }

    public Exchange getExchange() {
        return exchange;
    }

    public void setExchange(Exchange exchange) {
        this.exchange = exchange;
    }

    public String getContrato() {
        return contrato;
    }

    public void setContrato(String contrato) {
        this.contrato = contrato;
    }

    public Integer getQuantidadeCasasDecimais() {
        return quantidadeCasasDecimais;
    }

    public void setQuantidadeCasasDecimais(Integer quantidadeCasasDecimais) {
        this.quantidadeCasasDecimais = quantidadeCasasDecimais;
    }
}
