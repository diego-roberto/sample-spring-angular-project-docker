# STEP1: BUILD APP
FROM atlassian/default-image:2 AS BUILD_APP

WORKDIR /app

RUN npm install --silent -g @angular/cli@15.2.2 \
    && npm install --silent -g typings

COPY package*.json ./

RUN npm install --silent --no-optional

COPY . .

RUN node --max_old_space_size=3000 node_modules/@angular/cli/bin/ng build --aot --prod

# STEP2: DEPLOY TO NGINX
FROM nginx:1.17

ENV TZ=America/Sao_Paulo

WORKDIR /usr/share/nginx/html

COPY ./docker/app.conf /etc/nginx/conf.d/app.conf

# users are not allowed to listen on privileged ports
RUN sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf

COPY --from=BUILD_APP /app/dist .

## add permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080
