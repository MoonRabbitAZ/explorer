FROM node:14

ARG BUILD_VERSION
WORKDIR /build
COPY . .
RUN true \
 && yarn install \
 && yarn build --set-build-version "$BUILD_VERSION" \
 && true

FROM nginx:latest
COPY --from=0 /build/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /build/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]