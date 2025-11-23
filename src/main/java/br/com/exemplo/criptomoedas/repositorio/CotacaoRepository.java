package br.com.exemplo.criptomoedas.repositorio;

import br.com.exemplo.criptomoedas.modelo.Cotacao;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CotacaoRepository implements PanacheRepository<Cotacao> {
}
