package br.com.exemplo.criptomoedas.repositorio;

import br.com.exemplo.criptomoedas.modelo.Configuracao;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RepositorioConfiguracao implements PanacheRepository<Configuracao> {
    
    public Configuracao obterConfiguracao() {
        return find("1=1").firstResult();
    }
}