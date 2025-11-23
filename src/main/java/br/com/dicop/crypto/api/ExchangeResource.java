package br.com.dicop.crypto.api;

import br.com.dicop.crypto.model.Exchange;
import br.com.dicop.crypto.service.ServicoExchange;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/exchanges")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ExchangeResource {

    @Inject
    ServicoExchange servico;

    @GET
    public List<Exchange> listar() { return servico.listar(); }

    @GET
    @Path("/{id}")
    public Exchange buscar(@PathParam("id") Long id) { return servico.buscarPorId(id); }

    @POST
    public Response adicionar(Exchange e) {
        servico.salvar(e);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Exchange e) {
        servico.atualizar(id, e);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    public Response excluir(@PathParam("id") Long id) {
        servico.excluir(id);
        return Response.noContent().build();
    }
}