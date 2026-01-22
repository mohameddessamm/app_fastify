import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../jwt/auth'; // الكود اللي عملته انت
// src/index.ts

// باقي الاستيرادات...

export const registerHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password } = request.body as { name: string; email: string; password: string };

  if (!name || !email || !password) {
    return reply.status(400).send({ 
      error: "Bad Request",
      message: "يجب إرسال الاسم والبريد وكلمة المرور" 
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(409).send({ 
        error: "Conflict",
        message: "هذا البريد الإلكتروني مسجل مسبقاً" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    // إنشاء التوكن
    const token = generateToken({ id: user.id, email: user.email });

    // إرسال التوكن في كوكي
    reply
      .setCookie('token', token, {
        httpOnly: true,      // غير قابل للوصول من JS في المتصفح
        secure: process.env.NODE_ENV === 'production', // يعمل فقط على HTTPS في البروودكشن
        sameSite: 'strict',  // يمنع إرسال الكوكي لمواقع أخرى
        path: '/',           // الكوكي متاح لكل صفحات الموقع
        maxAge: 7 * 24 * 60 * 60 // 7 أيام بالثواني
      })
      .status(201)
      .send({
        message: "تم التسجيل بنجاح",
        user: { id: user.id, name: user.name, email: user.email }
      });

  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};

