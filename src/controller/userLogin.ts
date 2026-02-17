import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../service/jwt/auth";
// ... (نفس الإستيرادات السابقة)

export const loginHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    return reply
      .status(400)
      .send({ message: "يرجى إرسال البريد الإلكتروني وكلمة المرور" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply
        .status(401)
        .send({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply
        .status(401)
        .send({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    // --- التعديل الأول: إضافة الـ role داخل التوكن ---
    // هذا يسمح للـ Middleware بمعرفة رتبة المستخدم فوراً دون استعلام إضافي من قاعدة البيانات
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role // أضفنا الرتبة هنا
    });

    return reply
      .setCookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      })
      .status(200)
      .send({
        message: "تم تسجيل الدخول بنجاح",
        // --- التعديل الثاني: إعادة الـ role في الرد لكي يستخدمه الـ Frontend ---
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role // أضفنا الرتبة هنا أيضاً
        },
      });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};