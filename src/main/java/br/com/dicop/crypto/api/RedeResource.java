package br.com.dicop.crypto.api;

import br.com.dicop.crypto.model.Rede;
import br.com.dicop.crypto.service.RedeService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/redes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RedeResource {

    @Inject
    RedeService servico;

    @GET
    public List<Rede> listar() {
        return servico.listar();
    }

    @GET
    @Path("/{id}")
    public Rede buscar(@PathParam("id") Long id) {
        return servico.buscarPorId(id);
    }

    @POST
    public Response adicionar(Rede rede) {
        servico.salvar(rede);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Rede rede) {
        servico.atualizar(id, rede);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    public Response excluir(@PathParam("id") Long id) {
        servico.excluir(id);
        return Response.noContent().build();
    }
}