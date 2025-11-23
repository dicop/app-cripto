package br.com.dicop.crypto.api;

import br.com.dicop.crypto.model.Cotacao;
import br.com.dicop.crypto.service.CotacaoService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/cotacoes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CotacaoResource {

    @Inject
    CotacaoService cotacaoService;

    @GET
    public List<Cotacao> listar() {
        return cotacaoService.listar();
    }

    @POST
    public Cotacao salvar(Cotacao cotacao) {
        return cotacaoService.salvar(cotacao);
    }

    @DELETE
    @Path("/{id}")
    public void excluir(@PathParam("id") Long id) {
        cotacaoService.excluir(id);
    }

    @POST
    @Path("/{id}/atualizar-preco")
    public Cotacao atualizarPreco(@PathParam("id") Long id) {
        return cotacaoService.atualizarPreco(id);
    }

    @POST
    @Path("/{id}/atualizar-preco-binance")
    public Cotacao atualizarPrecoBinance(@PathParam("id") Long id) {
        return cotacaoService.atualizarPrecoBinance(id);
    }

    @POST
    @Path("/{id}/atualizar-preco-auto")
    public Cotacao atualizarPrecoAuto(@PathParam("id") Long id) {
        return cotacaoService.atualizarPrecoAuto(id);
    }

    @POST
    @Path("/{id}/atualizar-preco-bitget")
    public Cotacao atualizarPrecoBitget(@PathParam("id") Long id) {
        return cotacaoService.atualizarPrecoBitget(id);
    }

    @POST
    @Path("/atualizar-todos")
    public List<Cotacao> atualizarTodos() {
        return cotacaoService.atualizarTodos();
    }
}
