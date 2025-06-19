# Etapa 1: Construcción con Node
FROM node:20-alpine AS builder

# Crea y entra al directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
#COPY .npmrc .npmrc

# Instala dependencias
RUN npm install

# Copia el resto del proyecto
COPY . .

# Compila el proyecto
RUN npm run build

# Etapa 2: Contenedor final con Nginx
FROM nginx:alpine

# Elimina archivos por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos generados en la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia tu nginx.conf si lo necesitas
COPY nginx.conf /etc/nginx/nginx.conf

# Expone puerto
EXPOSE 80

# Arranca nginx
CMD ["nginx", "-g", "daemon off;"]
