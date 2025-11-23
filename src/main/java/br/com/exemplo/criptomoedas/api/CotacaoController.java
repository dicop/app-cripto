package br.com.exemplo.criptomoedas.api;

import br.com.exemplo.criptomoedas.modelo.Cotacao;
import br.com.exemplo.criptomoedas.servico.ServicoCotacao;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/cotacoes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CotacaoController {

    @Inject
    ServicoCotacao servicoCotacao;

    @GET
    public List<Cotacao> listar() {
        return servicoCotacao.listar();
    }

    @POST
    public Cotacao salvar(Cotacao cotacao) {
        return servicoCotacao.salvar(cotacao);
    }

    @DELETE
    @Path("/{id}")
    public void excluir(@PathParam("id") Long id) {
        servicoCotacao.excluir(id);
    }

    @POST
    @Path("/{id}/atualizar-preco")
    public Cotacao atualizarPreco(@PathParam("id") Long id) {
        return servicoCotacao.atualizarPreco(id);
    }
}
