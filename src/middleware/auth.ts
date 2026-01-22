import { FastifyRequest, FastifyReply } from 'fastify';
import {verifyToken} from "../jwt/auth"
export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // 1. استخراج التوكن من الكوكيز
    const token = request.cookies.token;

    if (!token) {
      return reply.status(401).send({ error: "Unauthorized", message: "يرجى تسجيل الدخول أولاً" });
    }

    // 2. التحقق من صحة التوكن
    const decoded = verifyToken(token);

    // 3. تخزين بيانات المستخدم داخل الطلب لاستخدامها في الـ Handler
    (request as any).user = decoded;

  } catch (error) {
    return reply.status(401).send({ error: "Unauthorized", message: "جلسة انتهت، يرجى تسجيل الدخول مجدداً" });
  }
};