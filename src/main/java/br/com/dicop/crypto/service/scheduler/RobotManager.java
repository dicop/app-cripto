package br.com.dicop.crypto.service.scheduler;

import br.com.dicop.crypto.model.Configuracao;
import br.com.dicop.crypto.service.ServicoConfiguracao;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;

import java.util.Map;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@ApplicationScoped
public class RobotManager {

    private final Map<String, Robot> robots = new ConcurrentHashMap<>();
    private final Map<String, ScheduledFuture<?>> runningTasks = new ConcurrentHashMap<>();
    private final Map<String, Long> robotFrequencies = new ConcurrentHashMap<>(); // Frequency in seconds
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);

    @Inject
    ServicoConfiguracao servicoConfiguracao;

    @Inject
    ObjectMapper objectMapper;

    @Inject
    public RobotManager(Instance<Robot> robotInstances) {
        for (Robot robot : robotInstances) {
            this.robots.put(robot.getName(), robot);
            this.robotFrequencies.put(robot.getName(), 10L); // Default 10 seconds
        }
    }

    void onStart(@Observes StartupEvent ev) {
        loadFrequencies();
        robots.keySet().forEach(this::start);
    }

    private void loadFrequencies() {
        try {
            Configuracao config = servicoConfiguracao.obterConfiguracao();
            if (config != null && config.getFrequenciaRobos() != null) {
                Map<String, Long> savedFrequencies = objectMapper.readValue(
                        config.getFrequenciaRobos(),
                        new TypeReference<Map<String, Long>>() {
                        });
                robotFrequencies.putAll(savedFrequencies);
                System.out.println("Loaded robot frequencies: " + savedFrequencies);
            }
        } catch (Exception e) {
            System.err.println("Error loading robot frequencies: " + e.getMessage());
        }
    }

    private void saveFrequencies() {
        try {
            Configuracao config = servicoConfiguracao.obterConfiguracao();
            if (config == null) {
                config = new Configuracao();
            }
            String json = objectMapper.writeValueAsString(robotFrequencies);
            config.setFrequenciaRobos(json);
            servicoConfiguracao.salvarConfiguracao(config);
            System.out.println("Saved robot frequencies: " + json);
        } catch (Exception e) {
            System.err.println("Error saving robot frequencies: " + e.getMessage());
        }
    }

    public void start(String name) {
        Robot robot = robots.get(name);
        if (robot != null && !runningTasks.containsKey(name)) {
            long frequency = robotFrequencies.getOrDefault(name, 10L);
            ScheduledFuture<?> task = scheduler.scheduleAtFixedRate(
                    robot::execute,
                    0,
                    frequency,
                    TimeUnit.SECONDS);
            runningTasks.put(name, task);
            System.out.println("Robot " + name + " started with frequency " + frequency + "s");
        }
    }

    public void stop(String name) {
        ScheduledFuture<?> task = runningTasks.remove(name);
        if (task != null) {
            task.cancel(false);
            System.out.println("Robot " + name + " stopped");
        }
    }

    public void setFrequency(String name, long seconds) {
        if (robots.containsKey(name)) {
            robotFrequencies.put(name, seconds);
            saveFrequencies(); // Persist change

            // If running, restart to apply new frequency
            if (runningTasks.containsKey(name)) {
                stop(name);
                start(name);
            }
            System.out.println("Frequency for " + name + " set to " + seconds + "s");
        }
    }

    public Map<String, Object> getRobotsStatus() {
        return robots.keySet().stream().collect(Collectors.toMap(
                name -> name,
                name -> Map.of(
                        "status", runningTasks.containsKey(name) ? "RUNNING" : "STOPPED",
                        "frequency", robotFrequencies.getOrDefault(name, 10L))));
    }
}
