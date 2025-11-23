package br.com.dicop.crypto.repository;

import br.com.dicop.crypto.model.Configuracao;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ConfiguracaoRepository implements PanacheRepository<Configuracao> {
    
    public Configuracao obterConfiguracao() {
        return find("1=1").firstResult();
    }
}