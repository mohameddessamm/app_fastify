import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../service/jwt/auth"; // تأكد من وجود دالة توليد التوكن

export const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as any;

  try {
    // 1. البحث عن المستخدم (سواء كان USER أو ADMIN)
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.status(401).send({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    // 2. التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    // 3. توليد التوكن وتضمين الـ Role بداخله
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role // مهم جداً للتفرقة لاحقاً في الـ Middleware
    });

    // 4. إرسال التوكن في Cookie وتفاصيل المستخدم في الـ Body
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
        message: "تم تسجيل الدخول بنجاح",
        user: { 
          username: user.username, 
          role: user.role // نرسله للفرونت-إيند ليعرف أين يوجه المستخدم
        },
      });
  } catch (error) {
    return reply.status(500).send({ error: "حدث خطأ في السيرفر" });
  }
};