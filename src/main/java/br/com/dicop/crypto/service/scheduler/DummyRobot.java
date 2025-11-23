package br.com.dicop.crypto.service.scheduler;

import jakarta.enterprise.context.ApplicationScoped;

import java.time.LocalDateTime;

@ApplicationScoped
public class DummyRobot implements Robot {

    @Override
    public void execute() {
        System.out.println("[DummyRobot] Executing at: " + LocalDateTime.now());
    }

    @Override
    public String getName() {
        return "DummyRobot";
    }
}
