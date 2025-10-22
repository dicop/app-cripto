package br.com.exemplo.criptomoedas.api;

import br.com.exemplo.criptomoedas.modelo.Criptomoeda;
import br.com.exemplo.criptomoedas.servico.ServicoCriptomoeda;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/criptomoedas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CriptomoedaResource {

    @Inject
    ServicoCriptomoeda servico;

    @GET
    public List<Criptomoeda> listar() {
        return servico.listar();
    }

    @GET
    @Path("/{id}")
    public Criptomoeda buscar(@PathParam("id") Long id) {
        return servico.buscarPorId(id);
    }

    @POST
    public Response adicionar(Criptomoeda c) {
        servico.salvar(c);
        return Response.status(Response.Status.CREATED).build();
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, Criptomoeda c) {
        servico.atualizar(id, c);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    public Response excluir(@PathParam("id") Long id) {
        servico.excluir(id);
        return Response.noContent().build();
    }
}
