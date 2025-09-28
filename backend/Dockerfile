FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala TODAS as dependências, incluindo as de desenvolvimento para a compilação
RUN npm install

# Agora, copia o resto do código-fonte
COPY . .

# Compila o código TypeScript para JavaScript
RUN npm run build

# Começamos de uma imagem limpa e nova para um resultado final menor
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependência novamente
COPY package*.json ./

# Instala APENAS as dependências de produção, resultando em uma imagem menor
RUN npm ci --only=production && npm cache clean --force

# Copia o código já compilado do estágio "builder"
COPY --from=builder /app/dist ./dist

# Cria um usuário e grupo não-root para rodar a aplicação com segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Dá permissão ao usuário não-root para acessar os arquivos da aplicação
RUN chown -R appuser:appgroup /app

# Muda para o usuário não-root
USER appuser

# Expõe a porta que a aplicação usa
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]