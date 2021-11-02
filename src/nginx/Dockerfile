FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d /etc/nginx/conf.d

RUN sed -i 's/<hostname>/https:\/\/nccrd.saeeon.ac.za/g' /etc/nginx/conf.d/nccrd.conf