FROM registry.cn-huhehaote.aliyuncs.com/develop-cache/nginx
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist .