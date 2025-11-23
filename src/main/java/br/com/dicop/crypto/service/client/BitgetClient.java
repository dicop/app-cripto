package br.com.dicop.crypto.service.client;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;

@RegisterRestClient(baseUri = "https://api.bitget.com")
public interface BitgetClient {

    @GET
    @Path("/api/v2/spot/market/orderbook")
    BitgetResponse getOrderbook(@QueryParam("symbol") String symbol,
                                @QueryParam("type") String type,
                                @QueryParam("limit") int limit);

    class BitgetResponse {
        public String code;
        public String msg;
        public Data data;
    }

    class Data {
        public List<List<String>> asks;
        public List<List<String>> bids;
        public String ts;
    }
}