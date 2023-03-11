# BACKEND

API em spring-boot, MVC, utiliza Java 1.8.

### Executando em ambiente local

Para executar essa aplicação em modo local, deve-se executar o container `backend`.

Primeiro certifique-se que o container `traefik` está em execução.
 
Na raiz da pasta do projeto, execute:
> docker-compose up backend 
> 
verifique os logs do container e certifique que o container da base, `mariadb` foi iniciado.

### Configurarndo a URL do Backend no Frontend

> Procure pelo arquivo environment.ts
>
> Altere o BACKEND_URL para `http://localhost:8082`
>
> Acesse: `http://frontend.localhost/`

### Possíveis Erros:

Caso tenha problema ao executar o maven, pode ser permissão de pastas onde 
a IDE intelliJ não está acessando.
Execute os seguintes comandos dentro da pasta raiz do `backend`:

- `sudo chmod -R 777 ./target`
- `sudo chmod -R 777 ./logs`

