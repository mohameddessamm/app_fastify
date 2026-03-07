import { FastifyRequest, FastifyReply } from "fastify";

// GET /movies/popular
// GET /movies/popular
export async function getPopularMovies(
  request: FastifyRequest<{ Querystring: { page?: string } }>, // أضفنا تعريف الـ Query هنا
  reply: FastifyReply
) {
  try {
    // 1. استخراج الصفحة من الطلب القادم من الفرونت إيند
    const { page } = request.query;
    const pageNumber = page || "1"; // إذا لم يرسل الفرونت صفحة، نعتبرها 1

    const API_KEY = process.env.TMDB_API_KEY!;
    
    // 2. تمرير المتغير pageNumber بدلاً من الرقم 1 الثابت
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNumber}`
    );

    if (!res.ok) {
      return reply.status(res.status).send({ error: "Failed to fetch popular movies" });
    }

    const data = await res.json();
    return reply.send(data);
  } catch (error) {
    return reply.status(500).send({ error: "Server error fetching popular movies" });
  }
}

// GET /movies/search?query=...


// GET /movies/search?query=...&page=...
export async function searchMovies(
  // 1. تحديث التعريف لاستقبال query و page (اختياري)
  request: FastifyRequest<{ Querystring: { query: string; page?: string } }>,
  reply: FastifyReply
) {
  try {
    const { query, page } = request.query;
    
    // 2. تحديد رقم الصفحة أو اعتبارها 1 كقيمة افتراضية
    const pageNumber = page || "1";

    if (!query) {
      return reply.status(400).send({ error: "Query string is required" });
    }

    const API_KEY = process.env.TMDB_API_KEY!;
    
    // 3. تمرير المتغير pageNumber في الرابط بدلاً من page=1
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        query
      )}&page=${pageNumber}`
    );

    if (!res.ok) {
      return reply
        .status(res.status)
        .send({ error: "Failed to search movies" });
    }

    const data = await res.json();
    return reply.send(data);
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Server error searching movies" });
  }
}