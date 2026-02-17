import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

export const createRootAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  // 1. التحقق من المفتاح السري في الهيدر (Security Check)
  const creationKey = request.headers['x-admin-key'];
  
  if (creationKey !== process.env.ADMIN_CREATION_KEY) {
    return reply.status(401).send({ message: "غير مسموح لك بالدخول لهذا المسار السري" });
  }

  const { email, password, username, phone } = request.body as any;

  try {
    // 2. التحقق من عدم وجود أي أدمن في قاعدة البيانات (Single Admin Logic)
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    if (adminCount > 0) {
      return reply.status(400).send({ 
        message: "فشل العملية: يوجد مدير بالفعل للنظام. لا يمكن إنشاء أكثر من مدير واحد." 
      });
    }

    // 3. التحقق من البيانات المرسلة
    if (!email || !password || !username || !phone) {
        return reply.status(400).send({ message: "يرجى ملء جميع البيانات" });
    }

    // 4. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. إنشاء الأدمن
    const rootAdmin = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        phone,
        role: 'ADMIN',      // تعيين الرتبة يدوياً هنا
        isVerified: true    // الأدمن مفعل تلقائياً
      }
    });

    return reply.status(201).send({
      message: "تم إنشاء حساب المدير الرئيسي بنجاح. يمكنك الآن تسجيل الدخول.",
      admin: { id: rootAdmin.id, username: rootAdmin.username }
    });

  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};