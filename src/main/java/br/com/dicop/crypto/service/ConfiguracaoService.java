package br.com.dicop.crypto.service;

import br.com.dicop.crypto.model.Configuracao;
import br.com.dicop.crypto.repository.ConfiguracaoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class ConfiguracaoService {

    @Inject
    ConfiguracaoRepository repositorio;

    public Configuracao obterConfiguracao() {
        return repositorio.obterConfiguracao();
    }

    @Transactional
    public Configuracao salvarConfiguracao(Configuracao configuracao) {
        if (configuracao.getId() == null) {
            configuracao.setId(1L); // Garantindo que sempre terá apenas um registro
        }
        return repositorio.getEntityManager().merge(configuracao);
    }
}