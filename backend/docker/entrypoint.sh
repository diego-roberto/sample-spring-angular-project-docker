#!/bin/sh

if [ "$APP_ENV" != "local" ]; then
    /etc/filebeat/filebeat -c /etc/filebeat/filebeat.yml -e &

    java -javaagent:/tmp/elastic-apm-agent-1.26.0.jar -jar /app/project.jar
else
    java -jar /app/project.jar
fi