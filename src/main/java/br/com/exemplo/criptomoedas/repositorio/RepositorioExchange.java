// c:\desenvolvimento\projetos\app-cripto\src\main\java\br\com\exemplo\criptomoedas\repositorio\RepositorioExchange.java
package br.com.exemplo.criptomoedas.repositorio;

import br.com.exemplo.criptomoedas.modelo.Exchange;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RepositorioExchange implements PanacheRepository<Exchange> { }