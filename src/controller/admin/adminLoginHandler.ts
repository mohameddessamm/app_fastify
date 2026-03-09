import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../service/jwt/auth";

export const adminLoginHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email, password } = request.body as any;
  const adminKey = request.headers['x-admin-key']; // استلام المفتاح السري من الهيدر

  // 1. التحقق من وجود المفتاح السري وصحته
  if (!adminKey || adminKey !== process.env.ADMIN_CREATION_KEY) {
    return reply.status(401).send({ message: "مفتاح الإدارة غير صحيح أو مفقود" });
  }

  if (!email || !password) {
    return reply.status(400).send({ message: "يرجى إرسال البريد وكلمة المرور" });
  }

  try {
    // 2. البحث عن المستخدم والتأكد أنه أدمن
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== 'ADMIN') {
      return reply.status(401).send({ message: "بيانات الاعتماد غير صحيحة أو لست مديراً" });
    }

    // 3. التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    // 4. توليد التوكن مع الرتبة (ADMIN)
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    // 5. إرسال التوكن في Cookie وتأكيد النجاح
    return reply
      .setCookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // أسبوع
      })
      .status(200)
      .send({
        message: "تم تسجيل دخول المدير بنجاح",
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        },
      });

  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};