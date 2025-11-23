package br.com.dicop.crypto.api;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import br.com.dicop.crypto.service.JupiterService;
import br.com.dicop.crypto.dto.JupiterQuoteDTO;

@Path("/api/jupiter")
public class JupiterResource {

    @Inject
    JupiterService jupiterService;

    @GET
    @Path("/quote")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getQuote(@QueryParam("inputMint") String inputMint,
            @QueryParam("outputMint") String outputMint,
            @QueryParam("amount") String amount) {
        try {
            JupiterQuoteDTO quote = jupiterService.getQuote(inputMint, outputMint, amount);
            return Response.ok(quote).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}
