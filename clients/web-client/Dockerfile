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

# =============================
# Pasar variables de entorno de Vite en tiempo de build
# =============================
ARG VITE_API_APIM_URL
ENV VITE_API_APIM_URL=$VITE_API_APIM_URL

# Verificar que la variable llegó (opcional)
RUN echo "VITE_API_APIM_URL=$VITE_API_APIM_URL"

# Ejecutar build con la variable inyectada
RUN VITE_API_APIM_URL=$VITE_API_APIM_URL npm run build

# =============================
# Etapa 2: Servir con Nginx
# =============================
FROM nginx:1.25-alpine

# Limpiar contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar build generado desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración Nginx personalizada (si tienes)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
