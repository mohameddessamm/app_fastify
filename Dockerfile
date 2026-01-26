# 1. Base Image
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# 2. Development Image
FROM base AS development
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
# إضافة القيمة الوهمية هنا أيضاً لتجنب فشل الـ build في الـ dev mode
RUN DATABASE_URL="postgres://unused:unused@localhost:5432/unused" npx prisma generate
CMD npx prisma migrate deploy && npm run dev

# 3. Build Image (للملفات النهائية)
FROM base AS build
COPY package*.json ./
COPY prisma ./prisma/
# نحتاج ملف الـ config هنا لأن بريزما ستبحث عنه أثناء الـ generate
COPY prisma.config.ts ./ 

RUN npm install
# التوليد باستخدام القيمة الوهمية
RUN DATABASE_URL="postgres://unused:unused@localhost:5432/unused" npx prisma generate

COPY . .
RUN npm run build
# تنظيف المكتبات الزائدة مع الحفاظ على Prisma Client
RUN npm prune --production

# 4. Production Image (الصغيرة والخفيفة)
FROM node:22-alpine AS production
RUN apk add --no-cache openssl
WORKDIR /app

# نسخ الملفات الجاهزة فقط من مرحلة الـ build
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./

ENV NODE_ENV=production
EXPOSE 4000

# ملاحظة: لا حاجة لـ prisma generate هنا لأن الـ node_modules جاهزة
CMD npx prisma migrate deploy && node dist/index.js