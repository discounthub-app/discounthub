# Этап 1: сборка
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Этап 2: продакшн-сервер
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
