# Gerenciador de Criptomoedas (Quarkus)

![Quarkus](https://quarkus.io/assets/images/quarkus_logo_horizontal_rgb.svg)

## Sobre o Projeto

Este é um projeto de exemplo desenvolvido em Java utilizando o framework Quarkus para gerenciar criptomoedas. O sistema permite cadastrar, consultar, atualizar e excluir informações sobre diferentes criptomoedas, oferecendo uma interface web amigável e uma API REST para integração com outros sistemas.

### Arquitetura

O projeto segue uma arquitetura em camadas:

- **Modelo**: Entidades JPA que representam os objetos de domínio
- **Repositório**: Camada de acesso a dados utilizando Panache (extensão do Hibernate)
- **Serviço**: Regras de negócio e lógica da aplicação
- **API**: Endpoints REST para acesso via HTTP
- **View**: Interface web utilizando HTML, CSS e JavaScript

### Tecnologias Utilizadas

- **Quarkus 3.15.1**: Framework Java supersônico e subatômico
- **Java 17**: Versão LTS do Java
- **Hibernate ORM com Panache**: Simplificação do acesso a dados
- **RESTEasy Reactive**: Implementação JAX-RS para APIs REST
- **Jackson**: Processamento de JSON
- **MySQL**: Banco de dados relacional
- **Maven**: Gerenciamento de dependências e build
- **SmallRye OpenAPI**: Documentação da API (Swagger)

## Pré-requisitos

- JDK 17 ou superior
- Maven 3.8+
- MySQL 8.0+
- Git (opcional, para clonar o repositório)

## Como executar

### Configuração do Banco de Dados

1. Ajuste o arquivo `src/main/resources/application.properties` com o usuário/senha e URL do seu MySQL.
2. Crie o banco `criptomoedas_db` no MySQL:
   ```sql
   CREATE DATABASE criptomoedas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Executando a Aplicação

1. Clone o repositório (caso ainda não tenha feito):
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd criptomoedas-quarkus
   ```

2. Execute a aplicação em modo de desenvolvimento:
   ```bash
   mvn quarkus:dev
   ```

3. Acesse a aplicação:
   - Interface web: http://localhost:8080
   - Documentação da API (Swagger): http://localhost:8080/q/swagger-ui

## Funcionalidades

- Cadastro de criptomoedas com informações como nome, símbolo, valor atual, etc.
- Consulta de criptomoedas por diversos critérios
- Atualização de informações de criptomoedas
- Exclusão de criptomoedas
- API REST completa para integração com outros sistemas
- Interface web responsiva

## Estrutura do Projeto

```
src/
├── main/
│   ├── java/
│   │   └── br/
│   │       └── com/
│   │           └── exemplo/
│   │               ├── model/       # Entidades JPA
│   │               ├── repository/  # Repositórios Panache
│   │               ├── service/     # Serviços com regras de negócio
│   │               └── resource/    # Endpoints REST
│   └── resources/
│       ├── META-INF/
│       ├── application.properties   # Configurações da aplicação
│       └── static/                  # Arquivos estáticos (HTML, CSS, JS)
```

## Desenvolvimento

### Modo de Desenvolvimento

O Quarkus oferece um modo de desenvolvimento com hot reload:

```bash
mvn quarkus:dev
```

### Empacotamento e Execução

Para criar um pacote executável:

```bash
mvn package
```

O arquivo JAR executável estará disponível em `target/quarkus-app/quarkus-run.jar`.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

