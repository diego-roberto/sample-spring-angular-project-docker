FROM adoptopenjdk/openjdk8:jdk8u292-b10-alpine AS MAVEN_BUILD

RUN apk update && apk add --upgrade ttf-dejavu \
    && apk add --no-cache  maven

WORKDIR /build/

COPY pom.xml .

COPY src ./src

RUN mvn package

FROM adoptopenjdk/openjdk8:jdk8u292-b10-alpine

WORKDIR /app

ENV TZ=America/Sao_Paulo

ARG BUILD_APP_ENV=local

RUN apk update && apk add --upgrade ttf-dejavu \
    && apk add --no-cache tzdata curl

COPY docker/elastic/elastic-apm-agent-1.26.0.jar /tmp/
COPY docker/elastic/install_elastic.sh /tmp/

RUN if [ "$BUILD_APP_ENV" != "local" ]; then chmod u+x /tmp/install_elastic.sh && /tmp/install_elastic.sh ; fi

COPY docker/elastic/filebeat.yml /etc/filebeat/filebeat.yml
COPY docker/entrypoint.sh /tmp/entrypoint.sh
RUN chmod go-w /etc/filebeat/filebeat.yml

COPY --from=MAVEN_BUILD /build/target/*.jar .

RUN addgroup -g 1001 -S appuser \
    && adduser -u 1001 -S appuser -G appuser \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

ENTRYPOINT /tmp/entrypoint.sh
