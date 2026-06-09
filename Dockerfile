# 1. Etapa de compilación (Build)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copiar el resto 
COPY . .
RUN npm run build
FROM node:20-alpine AS runner

WORKDIR /app

# Definir el entorno como producción
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --only=production

# Copiar la carpeta compilada desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponer el puerto (Render manejará esto dinámicamente con la variable PORT)
EXPOSE 3000

# Comando para arrancar la aplicación en producción
CMD ["node", "dist/main.js"]