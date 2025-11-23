package br.com.dicop.crypto.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.dicop.crypto.service.client.JupiterClient;
import br.com.dicop.crypto.dto.JupiterQuoteDTO;

import java.math.BigDecimal;
import java.math.RoundingMode;

@ApplicationScoped
public class JupiterService {

    @Inject
    @RestClient
    JupiterClient jupiterClient;

    @Inject
    ObjectMapper objectMapper;

    public JupiterQuoteDTO getQuote(String inputMint, String outputMint, String amount) {
        try {
            String jsonResponse = jupiterClient.getQuote(inputMint, outputMint, amount);
            JsonNode rootNode = objectMapper.readTree(jsonResponse);

            // Extract fields from Jupiter API response
            // Note: Jupiter API returns amounts in atomic units (integers as strings)
            String inAmountStr = rootNode.path("inAmount").asText();
            String outAmountStr = rootNode.path("outAmount").asText();
            String priceImpactPctStr = rootNode.path("priceImpactPct").asText();

            // Calculate "Resultado da Cotação" (Price)
            // Price = outAmount / inAmount (roughly, ignoring decimals for raw ratio, but
            // usually users want 1 Input = X Output)
            // However, without decimal information for each token, we can only provide the
            // raw ratio or just return the raw values.
            // The user request asks for "Resultado da Cotação", "Entrada", "Saída
            // Estimada", "Impacto no Preço".
            // Let's format them nicely.

            // For now, returning raw values as strings, but we might want to format them if
            // we knew decimals.
            // Assuming the frontend handles decimal conversion or we just pass what we get.
            // But wait, the user image shows "1 = 0.007600 SOL". This implies we need to
            // know the decimals to calculate the rate of 1 unit.
            // Since we don't have token metadata here (decimals), we might just have to
            // return the raw atomic units or the values provided by Jupiter if any.
            // Jupiter response usually has `swapMode`, `inAmount`, `outAmount`,
            // `priceImpactPct`.

            // Let's try to calculate a simple ratio if possible, or just pass the values.
            // If we treat them as raw numbers:
            BigDecimal inAmount = new BigDecimal(inAmountStr);
            BigDecimal outAmount = new BigDecimal(outAmountStr);

            // Avoid division by zero
            BigDecimal price = BigDecimal.ZERO;
            if (inAmount.compareTo(BigDecimal.ZERO) > 0) {
                price = outAmount.divide(inAmount, 6, RoundingMode.HALF_UP);
            }

            // Format price impact
            BigDecimal priceImpact = new BigDecimal(priceImpactPctStr);
            String priceImpactFormatted = priceImpact.setScale(4, RoundingMode.HALF_UP).toString() + "%";

            return new JupiterQuoteDTO(
                    inAmountStr,
                    outAmountStr,
                    priceImpactFormatted,
                    price.toString());

        } catch (Exception e) {
            throw new RuntimeException("Error calling Jupiter API", e);
        }
    }
}
