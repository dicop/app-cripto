package br.com.exemplo.criptomoedas.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "configuracao")
public class Configuracao {

    @Id
    private Long id;

    private String idChatTelegram;
    private String tokenChatTelegram;
    private String senhaAdministrador;

    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String frequenciaRobos;

    public Configuracao() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdChatTelegram() {
        return idChatTelegram;
    }

    public void setIdChatTelegram(String idChatTelegram) {
        this.idChatTelegram = idChatTelegram;
    }

    public String getTokenChatTelegram() {
        return tokenChatTelegram;
    }

    public void setTokenChatTelegram(String tokenChatTelegram) {
        this.tokenChatTelegram = tokenChatTelegram;
    }

    public String getSenhaAdministrador() {
        return senhaAdministrador;
    }

    public void setSenhaAdministrador(String senhaAdministrador) {
        this.senhaAdministrador = senhaAdministrador;
    }

    public String getFrequenciaRobos() {
        return frequenciaRobos;
    }

    public void setFrequenciaRobos(String frequenciaRobos) {
        this.frequenciaRobos = frequenciaRobos;
    }
}