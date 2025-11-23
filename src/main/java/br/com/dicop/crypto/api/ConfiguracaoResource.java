package br.com.dicop.crypto.api;

import br.com.dicop.crypto.model.Configuracao;
import br.com.dicop.crypto.service.ConfiguracaoService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/configuracao")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ConfiguracaoResource {
    
    @Inject
    ConfiguracaoService servico;
    
    @GET
    public Response obterConfiguracao() {
        Configuracao configuracao = servico.obterConfiguracao();
        if (configuracao == null) {
            configuracao = new Configuracao();
            configuracao.setId(1L);
        }
        return Response.ok(configuracao).build();
    }
    
    @PUT
    public Response atualizarConfiguracao(Configuracao configuracao) {
        Configuracao configuracaoAtualizada = servico.salvarConfiguracao(configuracao);
        return Response.ok(configuracaoAtualizada).build();
    }
}