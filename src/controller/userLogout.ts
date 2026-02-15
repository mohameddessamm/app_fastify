import { prisma } from "../lib/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "./../service/jwt/auth";

// أضفنا async هنا ليعمل await بالداخل
export const logoutHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const token = request.cookies.token;

  if (token) {
    try {
      // 1. فك تشفير التوكن لمعرفة تاريخ انتهائه
      const decoded = verifyToken(token) as any; // عملنا casting لـ any للوصول لـ exp بسهولة

      // 2. إضافة التوكن للقائمة السوداء في قاعدة البيانات
      // استخدمنا await هنا لضمان التسجيل قبل مسح الكوكي
      await prisma.blockedToken.create({
        data: {
          token: token,
          expiresAt: new Date(decoded.exp * 1000),
        },
      });
    } catch (err) {
      // في حال كان التوكن تالفاً أو منتهياً، لا نريد تعطيل عملية الـ logout
      console.error("Logout Error (Token Blacklisting):", err);
    }
  }

  // 3. مسح الكوكي من المتصفح بأمان
  return reply
    .clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .send({ message: "Logged out successfully" });
};
