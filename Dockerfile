# base image
    FROM node:22-alpine AS base
    RUN apk add --no-cache libc6-compat openssl
    WORKDIR /app
    
  
    COPY package*.json ./
 
    COPY prisma ./prisma/
    COPY prisma.config.ts ./ 
# image development 
    FROM base AS development
    RUN npm install
    COPY . .

    RUN npx prisma generate

CMD npx prisma migrate deploy && npm run dev
    
#  image build 
    FROM base AS build
    RUN npm install
    COPY . .

    RUN npx prisma generate
    RUN npm run build

    RUN npm prune --production
    

    FROM node:22-alpine AS production
    RUN apk add --no-cache openssl
    WORKDIR /app
    

    COPY --from=build /app/dist ./dist

    COPY --from=build /app/node_modules ./node_modules

    COPY --from=build /app/package*.json ./
    COPY --from=build /app/prisma ./prisma
    COPY --from=build /app/prisma.config.ts ./
    

    ENV NODE_ENV=production
    EXPOSE 4000
    
    RUN npx prisma generate
    
    CMD npx prisma migrate deploy && node dist/index.js