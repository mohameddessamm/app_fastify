import 'dotenv/config';
import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { prisma } from './lib/prisma';
<<<<<<< HEAD

// استيراد المسارات
import { userRoutes } from './routes/userRoutes';
import { movieRoutes } from './routes/movieRoutes';


const app = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: { colorize: true }
        }
    }
});

// 1. تسجيل الـ Plugins
await app.register(cors, { 
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
=======
import { movieRoutes } from "./routes/movieRoutes";
// استيراد مجموعات المسارات
import { authRoutes } from './routes/authRoutes';
import { adminRoutes } from './routes/adminRoutes';

const app = Fastify({
    logger: { transport: { target: 'pino-pretty' } }
});

// 1. تسجيل الـ Plugins الأساسية
await app.register(cors, { 
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
>>>>>>> main
});
app.register(fastifyCookie);
// في ملف server.ts أو main.ts
app.register(movieRoutes, { prefix: 'api/movies' });
app.register(authRoutes, { prefix: 'api/auth' }); 
// 2. تسجيل مجموعات المسارات (هنا التنظيم الحقيقي)

<<<<<<< HEAD
// 2. تسجيل مجموعات المسارات (Register Routes)
app.register(userRoutes, { prefix: '/api/auth' });
app.register(userRoutes, { prefix: '/api/create-root-admin' });
app.register(movieRoutes, { prefix: '/api/admin' });

// مسارات خاصة/سريعة

app.get("/ping", async () => ({ message: "pong" }));

// 3. دالة تشغيل السيرفر
const start = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected');
        
        await app.listen({ port: 4000, host: '0.0.0.0' });
        console.log('🚀 Server ready at http://localhost:4000');
=======
  // ستصبح الروابط /auth/login
app.register(adminRoutes, { prefix: 'api/admin' }); // ستصبح الروابط /admin/movies

// مسار الفحص

const start = async () => {
    try {
        await prisma.$connect();
        await app.listen({ port: 4000, host: '0.0.0.0' });
        console.log('🚀 Server running on http://localhost:4000');
>>>>>>> main
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();