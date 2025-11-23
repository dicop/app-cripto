package br.com.dicop.crypto.api;

import br.com.dicop.crypto.service.TelegramService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/api/telegram")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TelegramResource {
    
    @Inject
    TelegramService telegramService;
    
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
            
            boolean sucesso = telegramService.enviarMensagem(mensagem);
            
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