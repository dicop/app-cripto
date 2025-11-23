package br.com.dicop.crypto.service.scheduler;

import br.com.dicop.crypto.service.CotacaoService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDateTime;

@ApplicationScoped
public class CotacaoRobot implements Robot {

    @Inject
    CotacaoService cotacaoService;

    @Override
    public void execute() {
        System.out.println("[CotacaoRobot] Iniciando: " + LocalDateTime.now());
        cotacaoService.atualizarTodos();
        System.out.println("[CotacaoRobot] Finalizando: " + LocalDateTime.now());
    }

    @Override
    public String getName() {
        return "CotacaoRobot";
    }
}
