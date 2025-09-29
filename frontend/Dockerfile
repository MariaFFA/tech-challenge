# Estágio de Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o resto do código
COPY . .

# Gera a build de produção
RUN npm run build

# Estágio de Produção com Nginx
FROM nginx:stable-alpine

# Copia os arquivos estáticos da build do estágio anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Expõe a porta 80 (padrão do Nginx)
EXPOSE 80
