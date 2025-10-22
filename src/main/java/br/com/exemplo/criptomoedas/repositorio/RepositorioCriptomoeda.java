package br.com.exemplo.criptomoedas.repositorio;

import br.com.exemplo.criptomoedas.modelo.Criptomoeda;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RepositorioCriptomoeda implements PanacheRepository<Criptomoeda> {
}
