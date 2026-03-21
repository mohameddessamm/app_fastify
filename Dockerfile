# ==========================================
# 1. المرحلة الأساسية (Base)
# ==========================================
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ==========================================
# 2. مرحلة التطوير (Development)
# ==========================================
FROM base AS development
# نسخ ملفات تعريف المكتبات أولاً لاستغلال الـ Caching
COPY package*.json ./
COPY my-front-end/package*.json ./my-front-end/

# تثبيت كل المكتبات (بما فيها مكتبات التطوير)
RUN npm install
RUN cd my-front-end && npm install

# نسخ ملفات Prisma وتوليد الـ Client
COPY prisma ./prisma/
RUN DATABASE_URL="postgres://unused:unused@localhost:5432/unused" npx prisma generate

# نسخ بقية كود المشروع
COPY . .

# أمر التشغيل الافتراضي للتطوير (يدعم التحديث التلقائي للهجرة والكود)
CMD npx prisma migrate dev && npm run dev

# ==========================================
# 3. مرحلة البناء (Build)
# ==========================================
FROM base AS build
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN DATABASE_URL="postgres://unused:unused@localhost:5432/unused" npx prisma generate

COPY . .
# بناء الباك إند (esbuild) والفرونت إند (Vite)
RUN npm run build
RUN cd my-front-end && npm run build

# تنظيف المكتبات غير الضرورية للإنتاج
RUN npm prune --production

# ==========================================
# 4. مرحلة الإنتاج (Production)
# ==========================================
FROM node:22-alpine AS production
RUN apk add --no-cache openssl
WORKDIR /app

# نسخ مخرجات البناء (الباك إند المجمع والمكتبات الأساسية)
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

# نسخ ملفات الفرونت إند الجاهزة ليخدمها الباك إند
COPY --from=build /app/my-front-end/dist ./client

ENV NODE_ENV=production
EXPOSE 4000

# تنفيذ الهجرة (deploy) وتشغيل الملف المجمع
CMD npx prisma migrate deploy && npm run start