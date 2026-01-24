import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../jwt/auth';

export const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as { email: string; password: string };

  // 1. التأكد من إرسال البيانات
  if (!email || !password) {
    return reply.status(400).send({ message: "يرجى إرسال البريد الإلكتروني وكلمة المرور" });
  }

  try {
    // 2. البحث عن المستخدم في قاعدة البيانات
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    // 3. مقارنة كلمة المرور المشفرة
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    // 4. إنشاء التوكن (JWT)
    const token = generateToken({ id: user.id, email: user.email });

    // 5. إرسال التوكن في الكوكي والرد بنجاح
    return reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // أسبوع
      })
      .status(200)
      .send({
        message: "تم تسجيل الدخول بنجاح",
        user: { id: user.id, name: user.name, email: user.email }
      });

  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};