package br.com.exemplo.criptomoedas.servico;

import br.com.exemplo.criptomoedas.modelo.Configuracao;
import br.com.exemplo.criptomoedas.repositorio.RepositorioConfiguracao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class ServicoConfiguracao {
    
    @Inject
    RepositorioConfiguracao repositorio;
    
    public Configuracao obterConfiguracao() {
        return repositorio.obterConfiguracao();
    }
    
    @Transactional
    public Configuracao salvarConfiguracao(Configuracao configuracao) {
        if (configuracao.getId() == null) {
            configuracao.setId(1L); // Garantindo que sempre terá apenas um registro
        }
        repositorio.persist(configuracao);
        return configuracao;
    }
}