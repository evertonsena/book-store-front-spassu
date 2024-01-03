# FRONT - Sistema Gerenciamento de Livrarias - SPASSU

### Ambiente Docker

* NODE:10.15.3
* NGINX:alpine

### Pré-Requisitos


* [Git](https://git-scm.com)
* [Docker](https://www.docker.com/)
* [Docker-compose](https://docs.docker.com/engine/reference/commandline/compose/)


### Instalação

1 - Clonando o repositório e configurando as variaveis de ambiente

    ```
    git clone git@github.com:evertonsena/book-store-front-spassu.git
    ```

O comando acima fará o clone do ambiente em docker e do projeto FRONT [Book Store FRONT Spassu](https://github.com/evertonsena/book-store-front-spassu)
    
Antes de rodar o projeto você deverá criar os arquivos .env e .env.development, para isso basta gerar a partir do arquivo de exemplo:

    ```
    cp .env.example .env
    cp app_front/.env.example app_front/.env
    cp app_front/.env.development-example app_front/.env.development
    ```
    
2 - Construindo o container docker e iniciando o ambiente

    ```
    docker-compose up --build
    ```

3 - Iniciando o container depois de já ter feito o build 

    ```
    docker-compose up -d
    ```

Parando o docker-compose em execução: 

    ```
    docker-compose down
    ```
    
Para verificar o status dos containers
    
    ```
    docker-compose ps
    ```    
    
Para exibir os logs dos containers
    
    ```
    docker-compose logs
    ```    
       
4 - Acessando o sistema

* Poderá acessar o sistema através do browser no endereço: [http://localhost:9090](http://localhost:9090) (valor default que pode ser alterado)
