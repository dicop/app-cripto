package br.com.dicop.crypto.service.scheduler;

import br.com.dicop.crypto.service.ServicoCotacao;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDateTime;

@ApplicationScoped
public class CotacaoRobot implements Robot {

    @Inject
    ServicoCotacao servicoCotacao;

    @Override
    public void execute() {
        System.out.println("[CotacaoRobot] Iniciando: " + LocalDateTime.now());
        servicoCotacao.atualizarTodos();
        System.out.println("[CotacaoRobot] Finalizando: " + LocalDateTime.now());
    }

    @Override
    public String getName() {
        return "CotacaoRobot";
    }
}
