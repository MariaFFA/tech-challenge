FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Usamos 'npm install' que é mais flexível para o desenvolvimento
RUN npm install

# Copia o resto do código do aplicativo
COPY . .

# Executa o script de build do React, que cria a pasta /app/build
RUN npm run build


FROM nginx:stable-alpine

# Copia os arquivos estáticos da pasta 'build' do estágio anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# O comando padrão da imagem nginx já inicia o servidor,
# então não precisamos de um CMD customizado.