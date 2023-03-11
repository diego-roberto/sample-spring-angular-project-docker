FROM atlassian/default-image:2 AS build

ENV TZ=America/Sao_Paulo

RUN mkdir -p /opt/frontend

WORKDIR /opt/frontend

RUN apt-get update --fix-missing

RUN apt-get install nginx -y

COPY ./ /opt/frontend

RUN cd /opt/frontend \
    && rm -rf node_modules \
    && npm install --silent -g @angular/cli@7.3.9 \
    && npm install --silent -g typings \
    && npm install --silent --no-optional\
    && npm run --max-old-space-size=3000 build --verbose

RUN rm /etc/nginx/sites-available/default \
    && cp /opt/frontend/docker/dev.app.conf /etc/nginx/conf.d/default.conf

RUN chmod +x /opt/frontend/start_dev.sh \
    && cp /opt/frontend/start_dev.sh /opt/frontend

RUN rm /var/www/html/index.nginx-debian.html \
    && cp -r /opt/frontend/dist/* /var/www/html \
    && rm -rf /opt/frontend/dist/ \
    && rm -rf /opt/frontend/node_modules/
