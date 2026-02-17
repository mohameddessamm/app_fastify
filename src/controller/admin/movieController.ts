import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

// --- إضافة فيلم جديد ---
export const addMovie = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { title, description, posterUrl, videoUrl, genre, rating } = request.body as any;

    // 1. التأكد من البيانات الأساسية
    if (!title) {
      return reply.status(400).send({ message: "عنوان الفيلم مطلوب" });
    }

    // 2. معالجة الـ genre ليتوافق مع String[] في السكيما
    // إذا أرسل الفرونت إيند نصاً واحداً "Action"، نحوله لـ ["Action"]
    const genreArray = Array.isArray(genre) 
      ? genre 
      : genre ? [genre] : [];

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        posterUrl,
        videoUrl,
        genre: genreArray, 
        rating: rating ? parseFloat(rating) : 0.0,
      },
    });

    return reply.status(201).send({ message: "تم إضافة الفيلم بنجاح", movie });
  } catch (error) {
    console.error("ADD_MOVIE_ERROR:", error);
    return reply.status(500).send({ error: "فشل في إضافة الفيلم لقاعدة البيانات" });
  }
};

// --- حذف فيلم ---
export const deleteMovie = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };

    // 1. تحويل الـ id لرقم لأن السكيما تستخدم Int
    const movieId = parseInt(id);

    if (isNaN(movieId)) {
      return reply.status(400).send({ message: "رقم الفيلم غير صالح" });
    }

    // 2. التحقق من وجود الفيلم قبل محاولة الحذف
    const existingMovie = await prisma.movie.findUnique({
      where: { id: movieId }
    });

    if (!existingMovie) {
      return reply.status(404).send({ message: "الفيلم غير موجود بالفعل" });
    }

    // 3. تنفيذ الحذف
    await prisma.movie.delete({
      where: { id: movieId },
    });

    return reply.send({ message: `تم حذف الفيلم "${existingMovie.title}" بنجاح` });
  } catch (error) {
    console.error("DELETE_MOVIE_ERROR:", error);
    return reply.status(500).send({ error: "حدث خطأ أثناء محاولة حذف الفيلم" });
  }
};