# Étape 1 : Build minimal
FROM node:20-alpine

WORKDIR /app

# Copier uniquement package.json et package-lock.json
COPY backend/package*.json ./

# Installer uniquement les prod-dependencies
RUN npm install --only=production

# Copier le code source backend
COPY backend/ .

EXPOSE 3002

CMD ["node", "app.js"]
