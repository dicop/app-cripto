package br.com.dicop.crypto.api;

import br.com.dicop.crypto.model.Cotacao;
import br.com.dicop.crypto.service.ServicoCotacao;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
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

    @POST
    @Path("/{id}/atualizar-preco-binance")
    public Cotacao atualizarPrecoBinance(@PathParam("id") Long id) {
        return servicoCotacao.atualizarPrecoBinance(id);
    }

    @POST
    @Path("/{id}/atualizar-preco-auto")
    public Cotacao atualizarPrecoAuto(@PathParam("id") Long id) {
        return servicoCotacao.atualizarPrecoAuto(id);
    }

    @POST
    @Path("/{id}/atualizar-preco-bitget")
    public Cotacao atualizarPrecoBitget(@PathParam("id") Long id) {
        return servicoCotacao.atualizarPrecoBitget(id);
    }

    @POST
    @Path("/atualizar-todos")
    public List<Cotacao> atualizarTodos() {
        return servicoCotacao.atualizarTodos();
    }
}
