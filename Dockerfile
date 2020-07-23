FROM node as builder

WORKDIR /usr/src/app
ARG BUILD_ENV

RUN npm config set '@bit:registry' https://node.bit.dev

COPY .npmrc ./
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .
RUN if [ "$BUILD_ENV" = "staging" ]; \
    then yarn build:staging; \
    else yarn build; \
    fi



FROM ubuntu
RUN apt-get update && apt-get install -y nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log
RUN rm -rf /etc/nginx/sites-enabled/default

COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
