import { FastifyRequest, FastifyReply } from "fastify";

// هذا الميدل وير يتأكد أن الشخص "أدمن"
export const isAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // 1. استخراج المستخدم من الطلب (بعد التحقق من التوكن)
    const user = (request as any).user;

    // 2. التحقق من الرتبة
    if (!user || user.role !== 'ADMIN') {
      return reply.status(403).send({ 
        message: "عذراً، هذا المسار يتطلب صلاحيات مدير النظام (Admin Only)." 
      });
    }
  } catch (error) {
    return reply.status(500).send({ error: "خطأ في التحقق من الصلاحيات" });
  }
};