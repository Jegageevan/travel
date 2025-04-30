# Étape 1 : Build Angular
FROM node:20.12.2-alpine as angular-build

WORKDIR /app

# Copier tout ce qu'il faut pour builder Angular
COPY package*.json angular.json tsconfig*.json tsconfig.app.json tsconfig.spec.json ./
COPY src ./src

# Installer les dépendances
RUN npm install

# Build Angular en mode production
RUN npm run build -- --configuration production

# Étape 2 : Servir avec Nginx
FROM nginx:1.27.3-alpine

# Copier LE BON DOSSIER buildé vers nginx
COPY --from=angular-build /app/dist/http/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
