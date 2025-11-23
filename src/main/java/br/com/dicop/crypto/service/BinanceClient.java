package br.com.dicop.crypto.service;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;

@RegisterRestClient(baseUri = "https://api.binance.com")
public interface BinanceClient {

    @GET
    @Path("/api/v3/depth")
    BinanceResponse getOrderbook(@QueryParam("symbol") String symbol,
            @QueryParam("limit") int limit);

    static class BinanceResponse {
        public long lastUpdateId;
        public List<List<String>> bids;
        public List<List<String>> asks;
    }
}
