# =============================
# Etapa 1: Construcción del proyecto
# =============================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependencias e instalarlas
COPY package*.json ./
RUN npm ci --silent

# Copiar código fuente
COPY . .

# ✅ Inyectar variables de entorno necesarias para el build
# (agrégalas todas las que use import.meta.env en tu proyecto)
ARG VITE_API_APIM_URL

ENV VITE_API_APIM_URL=$VITE_API_APIM_URL

# ✅ Verificar que las variables llegaron (opcional pero útil para debug)
RUN echo "VITE_API_APIM_URL=$VITE_API_APIM_URL" 

# Ejecutar build
RUN npm run build

# =============================
# Etapa 2: Servir con Nginx
# =============================
FROM nginx:1.25-alpine

# Limpiar contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar build generado
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
