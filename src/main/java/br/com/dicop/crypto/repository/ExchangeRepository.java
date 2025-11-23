package br.com.dicop.crypto.repository;

import br.com.dicop.crypto.model.Exchange;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ExchangeRepository implements PanacheRepository<Exchange> { }