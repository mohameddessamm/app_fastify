// src/middleware/adminAuth.ts
import { FastifyRequest, FastifyReply } from "fastify";

export const adminOnly = async (request: FastifyRequest, reply: FastifyReply) => {
  // استخراج المفتاح من الهيدر (Headers)
  const adminKey = request.headers['x-admin-key'];

  // مقارنته بنفس المفتاح الذي استخدمته في كود التسجيل (المخزن في .env)
  if (!adminKey || adminKey !== process.env.ADMIN_CREATION_KEY) {
    return reply.status(401).send({ 
      message: "غير مسموح لك بإجراء هذه العملية. المفتاح السري مطلوب." 
    });
  }
};