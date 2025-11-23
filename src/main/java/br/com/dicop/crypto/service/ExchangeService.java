package br.com.dicop.crypto.service;

import br.com.dicop.crypto.model.Exchange;
import br.com.dicop.crypto.repository.ExchangeRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ExchangeService {

    @Inject
    ExchangeRepository repositorio;

    public List<Exchange> listar() { return repositorio.listAll(); }
    public Exchange buscarPorId(Long id) { return repositorio.findById(id); }

    @Transactional
    public void salvar(Exchange e) { repositorio.persist(e); }

    @Transactional
    public void atualizar(Long id, Exchange dados) {
        Exchange existente = repositorio.findById(id);
        if (existente != null) {
            existente.setNome(dados.getNome());
            existente.setUrl(dados.getUrl());
            existente.setTokenSeguranca(dados.getTokenSeguranca());
            existente.setTaxaNegociacao(dados.getTaxaNegociacao());
        }
    }

    @Transactional
    public void excluir(Long id) { repositorio.deleteById(id); }
}