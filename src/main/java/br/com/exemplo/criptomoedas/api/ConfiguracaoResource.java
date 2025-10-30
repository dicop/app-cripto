package br.com.exemplo.criptomoedas.api;

import br.com.exemplo.criptomoedas.modelo.Configuracao;
import br.com.exemplo.criptomoedas.servico.ServicoConfiguracao;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/configuracao")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ConfiguracaoResource {
    
    @Inject
    ServicoConfiguracao servico;
    
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