# ===== DOCKERFILE =====
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Segunda etapa: servidor ligero
FROM nginx:alpine

# Copiamos los archivos ya compilados
COPY --from=build /app/dist/carnetrack /usr/share/nginx/html

# (Opcional) Si tienes rutas con router de Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80