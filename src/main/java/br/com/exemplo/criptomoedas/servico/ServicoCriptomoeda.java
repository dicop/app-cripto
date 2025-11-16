package br.com.exemplo.criptomoedas.servico;

import br.com.exemplo.criptomoedas.modelo.Criptomoeda;
import br.com.exemplo.criptomoedas.repositorio.RepositorioCriptomoeda;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class ServicoCriptomoeda {

    @Inject
    RepositorioCriptomoeda repositorio;

    public List<Criptomoeda> listar() {
        return repositorio.listAll();
    }

    public Criptomoeda buscarPorId(Long id) {
        return repositorio.findById(id);
    }

    @Transactional
    public void salvar(Criptomoeda criptomoeda) {
        repositorio.persist(criptomoeda);
    }

    @Transactional
    public void atualizar(Long id, Criptomoeda dados) {
        Criptomoeda existente = repositorio.findById(id);
        if (existente != null) {
            existente.setNome(dados.getNome());
            existente.setSigla(dados.getSigla());
            existente.setValor(dados.getValor());
            existente.setRede(dados.getRede());
            existente.setExchange(dados.getExchange());
            existente.setContrato(dados.getContrato());
        }
    }

    @Transactional
    public void excluir(Long id) {
        repositorio.deleteById(id);
    }
}
