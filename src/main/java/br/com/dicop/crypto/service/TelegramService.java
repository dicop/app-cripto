package br.com.dicop.crypto.service;
import br.com.dicop.crypto.model.Configuracao;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class TelegramService {

    @Inject
    ConfiguracaoService configuracaoService;

    public boolean enviarMensagem(String mensagem) {
        try {
            Configuracao config = configuracaoService.obterConfiguracao();

            // Valida configuração do Telegram
            if (config == null || config.getTokenChatTelegram() == null || config.getIdChatTelegram() == null) {
                throw new RuntimeException("Configurações do Telegram não encontradas. Configure o token e ID do chat primeiro.");
            }

            String token = config.getTokenChatTelegram().trim();
            String chatId = config.getIdChatTelegram().trim();

            // Valida mensagem
            if (mensagem == null || mensagem.trim().isEmpty()) {
                throw new IllegalArgumentException("A mensagem está vazia. Informe um texto não-vazio.");
            }

            // Monta URL do endpoint Telegram
            String url = "https://api.telegram.org/bot" + token + "/sendMessage";

            // Monta corpo da mensagem
            Map<String, Object> messageData = new HashMap<>();
            messageData.put("chat_id", chatId);
            messageData.put("text", mensagem);
            messageData.put("parse_mode", "HTML");

            // Serializa com Jackson
            ObjectMapper mapper = new ObjectMapper();
            String jsonPayload = mapper.writeValueAsString(messageData);

            System.out.println("Enviando mensagem para Telegram:");
            System.out.println("URL: " + url);
            System.out.println("Payload: " + jsonPayload);

            // Envia requisição HTTP POST
            try (Client client = ClientBuilder.newClient()) {
                try (Response response = client.target(url)
                        .request() // Accept é opcional
                        .header("Content-Type", "application/json; charset=UTF-8")
                        .post(Entity.entity(jsonPayload, MediaType.APPLICATION_JSON_TYPE.withCharset(StandardCharsets.UTF_8.name())))) {

                    String respBody = response.readEntity(String.class);

                    System.out.println("Resposta do Telegram (HTTP " + response.getStatus() + "): " + respBody);

                    if (response.getStatus() != 200) {
                        throw new RuntimeException("Erro ao enviar mensagem: HTTP "
                                + response.getStatus() + " - " + respBody);
                    }
                }
            }

            return true;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar mensagem via Telegram: " + e.getMessage(), e);
        }
    }
}
