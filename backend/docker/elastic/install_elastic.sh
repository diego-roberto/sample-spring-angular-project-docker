#!/bin/sh

if [ "$BUILD_APP_ENV" != "local" ]; then

    curl https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.11.2-linux-x86_64.tar.gz -o /filebeat.tar.gz
    tar -zxvf /filebeat.tar.gz -C /
    rm /filebeat.tar.gz
    mv /filebeat-7.11.2-linux-x86_64 /filebeat

    cp /filebeat/filebeat /usr/bin

    cp -r /filebeat /etc/filebeat

    chmod go-w /etc/filebeat/filebeat.yml

    mkdir -p /var/lib/filebeat
    chmod -R 755 /var/lib/filebeat

    mkdir -p /etc/filebeat/data
    chmod -R 777 /etc/filebeat/data
    chmod -R g=u /etc/filebeat/data

    mkdir -p /etc/filebeat/logs
    chmod -R 777 /etc/filebeat/logs
    chmod -R g=u /etc/filebeat/logs

    chmod -R g=u /var/lib/filebeat

fi
