package br.com.exemplo.criptomoedas.servico;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;

@RegisterRestClient(baseUri = "https://api.bybit.com")
public interface BybitClient {

    @GET
    @Path("/v5/market/orderbook")
    BybitResponse getOrderbook(@QueryParam("category") String category,
            @QueryParam("symbol") String symbol,
            @QueryParam("limit") int limit);

    static class BybitResponse {
        public int retCode;
        public String retMsg;
        public Result result;
    }

    static class Result {
        public String s;
        public List<List<String>> a; // Asks
        public List<List<String>> b; // Bids
        public long ts;
    }
}
