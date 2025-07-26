# Этап 1: сборка Vite-приложения
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап 2: NGINX для продакшн-сборки
FROM nginx:alpine

# Удаляем конфиг по умолчанию (по желанию)
RUN rm -rf /etc/nginx/conf.d/default.conf

# Копируем сборку
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
