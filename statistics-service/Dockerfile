# --- build stage ---
    FROM node:18.20.2-alpine AS build
    WORKDIR /app
    COPY ./package*.json ./
    RUN npm install --silent
    COPY . .
    RUN npm run build
    
    # --- test stage ---
    FROM build AS test
    ENV NODE_ENV=test
    CMD ["npm", "run", "test"]
    
    # --- production stage ---
    FROM node:18.20.2-alpine AS production
    WORKDIR /app
    COPY ./package*.json ./
    RUN npm install --silent --production
    COPY --from=build /app/dist ./dist
    ENV NODE_ENV=production
    EXPOSE 8000
    CMD ["npm", "start"]
    