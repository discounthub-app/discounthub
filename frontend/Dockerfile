# ⚙️ Этап 1: билд через Vite
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
RUN npm run build

# 🚀 Этап 2: продакшн через nginx
FROM nginx:alpine AS prod

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# 🧪 Этап 3: dev-сервер Vite (будет использоваться через override)
FROM node:20 AS dev

WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .

CMD ["npm", "run", "dev"]
