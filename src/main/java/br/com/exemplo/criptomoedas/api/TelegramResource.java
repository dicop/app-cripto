package br.com.exemplo.criptomoedas.api;

import br.com.exemplo.criptomoedas.servico.TelegramServico;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

@Path("/api/telegram")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TelegramResource {
    
    @Inject
    TelegramServico telegramServico;
    
    @POST
    @Path("/enviar-mensagem")
    public Response enviarMensagem(Map<String, String> dados) {
        try {
            String mensagem = dados.get("mensagem");
            
            if (mensagem == null || mensagem.trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(Map.of("erro", "Mensagem não pode estar vazia"))
                        .build();
            }
            
            boolean sucesso = telegramServico.enviarMensagem(mensagem);
            
            if (sucesso) {
                return Response.ok(Map.of("sucesso", true, "mensagem", "Mensagem enviada com sucesso!")).build();
            } else {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity(Map.of("erro", "Falha ao enviar mensagem"))
                        .build();
            }
            
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("erro", e.getMessage()))
                    .build();
        }
    }
}