# Estágio de Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência e instala TUDO (incluindo devDependencies)
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Compila o TypeScript
RUN npm run build

# Estágio de Produção
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependência novamente
COPY package*.json ./

# Instala APENAS as dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copia o código já compilado do estágio "builder"
COPY --from=builder /app/dist ./dist

# Cria um usuário não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Dá permissão ao novo usuário
RUN chown -R appuser:appgroup /app

# Muda para o usuário não-root
USER appuser

EXPOSE 3001

CMD ["npm", "start"]