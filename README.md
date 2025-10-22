# Gerenciador de Criptomoedas (Quarkus)

Projeto exemplo em Java usando Quarkus para gerenciar criptomoedas.
Camadas: modelo, repositorio, servico, api (REST) e view (HTML/CSS/JS).

## Como executar

1. Ajuste `src/main/resources/application.properties` com o usuário/senha e URL do seu MySQL.
2. Crie o banco `criptomoedas_db` no MySQL:
   ```sql
   CREATE DATABASE criptomoedas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Execute com Maven:
   ```bash
   mvn quarkus:dev
   ```
4. Abra `http://localhost:8080` para acessar a interface web.

