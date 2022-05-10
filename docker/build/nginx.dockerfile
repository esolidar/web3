FROM nginx

WORKDIR /var/www

COPY /docker/build/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx","-g","daemon off;"]