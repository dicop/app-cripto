package br.com.dicop.crypto.service.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/swap/v1")
@RegisterRestClient(baseUri = "https://lite-api.jup.ag")
public interface JupiterClient {

    @GET
    @Path("/quote")
    String getQuote(@QueryParam("inputMint") String inputMint,
            @QueryParam("outputMint") String outputMint,
            @QueryParam("amount") String amount);
}
