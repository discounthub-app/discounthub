# ⚙️ Этап 1: билд через Vite
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 🚀 Этап 2: продакшн через nginx
FROM nginx:alpine AS prod

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# 🧪 Этап 3: dev-сервер Vite (используется через override)
FROM node:20 AS dev

WORKDIR /app
COPY package*.json ./

ENV NODE_ENV=development
RUN npm install --include=dev \
 && npx vite --version

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
