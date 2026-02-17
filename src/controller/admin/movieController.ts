import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

// --- إضافة فيلم جديد ---
export const addMovie = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { title, description, posterUrl, videoUrl, genre, rating } = request.body as any;

    // التأكد من البيانات الأساسية
    if (!title) {
      return reply.status(400).send({ message: "عنوان الفيلم مطلوب" });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        posterUrl,
        videoUrl,
        genre: genre || [], // مصفوفة نصوص
        rating: parseFloat(rating) || 0.0,
      },
    });

    return reply.status(201).send({ message: "تم إضافة الفيلم بنجاح", movie });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "فشل في إضافة الفيلم لقاعدة البيانات" });
  }
};

// --- حذف فيلم ---
export const deleteMovie = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };

    // تحويل الـ id لرقم لأن Prisma يتوقع Int
    const movieId = parseInt(id);

    await prisma.movie.delete({
      where: { id: movieId },
    });

    return reply.send({ message: `تم حذف الفيلم رقم ${movieId} بنجاح` });
  } catch (error) {
    console.error(error);
    return reply.status(404).send({ error: "الفيلم غير موجود أو حدث خطأ أثناء الحذف" });
  }
};