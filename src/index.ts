import 'dotenv/config'; 
import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { prisma } from './lib/prisma'; // تأكد من المسار الصحيح
import { registerHandler } from "./controller/userRegister";
import { loginHandler } from './controller/userLogin';
import { authenticate } from './middleware/auth';

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  }
});

// 1. تسجيل الإضافات (Plugins)
app.register(fastifyCookie);

// 2. تعريف المسارات (Routes)
app.post("/register", registerHandler);
app.post("/login", loginHandler);
app.get(
  '/profile',
  { preHandler: authenticate },
  async (request, reply) => {
    const user = (request as any).user;
    return reply.send({
      message: 'أهلاً بك',
      user
    });
  }
);

// مسار تجريبي للتأكد من أن السيرفر يعمل
app.get("/ping", async () => {
  return { message: "pong" };
});

// 3. دالة تشغيل السيرفر مع فحص قاعدة البيانات
const start = async () => {
  try {
    console.log('⏳ Checking database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    await app.listen({ port: 4000, host: '0.0.0.0' });
    console.log('🚀 Server is running on http://localhost:4000');
  } catch (err) {
    app.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();