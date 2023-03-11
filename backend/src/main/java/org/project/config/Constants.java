package org.project.config;

public class Constants {

    // para uso em produção ou local - sem uso para o escopo atual (deixar ai por enquanto)
    public static final String ENVIRONMENT = "local";

    // BACKEND - utilizando application.properties (deixar ai por enquanto)
    public static final int BACKEND_SERVER_PORT = 8082;

    // FRONTEND
    public static final String FRONTEND_URL = "http://localhost:4200/#/";

    // DB - utilizando application.properties (deixar ai por enquanto)
    public static final String DB_DIALECT = "org.hibernate.dialect.MariaDBDialect";
    public static final String DB_DRIVER_CLASS = "org.mariadb.jdbc.Driver";
    public static final String DB_BASE_URL = "jdbc:mariadb://localhost:3306/";
    public static final String BACKEND_DB_URL = "jdbc:mariadb://localhost:3306/project_db";
    public static final String DB_ROOT_USER = "root";
    public static final String DB_ROOT_PASS = "password";

    // CORS
    public static final String CORS_ORIGIN = "http://localhost:8082";
    public static final String CORS_WEBSOCKET_ALLOWED_HOST = "*";
    public static final String CORS_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD";
    public static final String CORS_ALLOW_HEADERS = "Access-Control-Allow-Origin,Authorization,Content-Type,X-Authorization,authorization,content-type,x-authorization";
    public static final boolean CORS_ALLOW_CREDENTIALS = true;

}
