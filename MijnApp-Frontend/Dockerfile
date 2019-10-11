FROM ubuntu AS base
EXPOSE 80
EXPOSE 443
RUN apt-get update
RUN apt-get install nginx -y

FROM node
WORKDIR /src
COPY . .
RUN npm install
RUN npm run build:prod
COPY /dist /var/www/html/

FROM base
CMD ["nginx","-g","daemon off;"]
