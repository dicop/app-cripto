package br.com.dicop.crypto.service;

import br.com.dicop.crypto.model.Rede;
import br.com.dicop.crypto.repository.RepositorioRede;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ServicoRede {

    @Inject
    RepositorioRede repositorio;

    public List<Rede> listar() {
        return repositorio.listAll();
    }

    public Rede buscarPorId(Long id) {
        return repositorio.findById(id);
    }

    @Transactional
    public void salvar(Rede rede) {
        repositorio.persist(rede);
    }

    @Transactional
    public void atualizar(Long id, Rede dados) {
        Rede existente = repositorio.findById(id);
        if (existente != null) {
            existente.setNome(dados.getNome());
            existente.setLinkExplorer(dados.getLinkExplorer());
        }
    }

    @Transactional
    public void excluir(Long id) {
        repositorio.deleteById(id);
    }
}