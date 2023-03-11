# sample-spring-angular-project-docker

Projeto base para rápida implementação de diversas utilidades.
O backend conta com uma classe de modelo Sample para uma entidade simples, que deve ser implementada de acordo com a necessidade.
As classes de Controle (SampleController), Serviço (SampleService) e camada de Persistência (SampleRepository) estão organizadas e também podem ser implementadas de acordo com as regras de negócio.

Backend em spring-boot 2.7.9, MVC, utiliza Java 1.8.
Frontend em angular.
Db utiliza MariaDb ou pode implementar h2 para base em memória em casos sem necessidade de persistência.

### Executando em ambiente local

Para executar essa aplicação em modo local, primeiro certifique-se que o container `traefik` está em execução.
A partir da pasta raiz do projeto, acesse a pasta docker-compose e execute o comando para iniciar o container:
> cd docker-compose
> docker-compose up -d traefik
>

O container mariadb é dependência do container do backend, então irá iniciar antes do build, automaticamente.
Senão, utilize o comando abaixo antes de executar o backend novamente:
> docker-compose up -d mariadb
>

Na raiz da pasta do projeto, execute:
> docker-compose up backend 
> 

Para inicializar o container do frontend, utilize o comando:
> docker-compose up frontend 
>

