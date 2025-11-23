package br.com.dicop.crypto.repository;

import br.com.dicop.crypto.model.Cotacao;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CotacaoRepository implements PanacheRepository<Cotacao> {
}
