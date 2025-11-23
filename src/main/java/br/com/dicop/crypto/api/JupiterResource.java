package br.com.dicop.crypto.api;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import br.com.dicop.crypto.service.client.JupiterClient;

@Path("/api/jupiter")
public class JupiterResource {

    @Inject
    @RestClient
    JupiterClient jupiterClient;

    @GET
    @Path("/quote")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getQuote(@QueryParam("inputMint") String inputMint,
            @QueryParam("outputMint") String outputMint,
            @QueryParam("amount") String amount) {
        try {
            // For now, we return the raw string response from Jupiter
            // In a real app, we might want to map this to a DTO
            String response = jupiterClient.getQuote(inputMint, outputMint, amount);
            System.out.println(response);
            return Response.ok(response).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}
