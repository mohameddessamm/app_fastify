import { FastifyRequest, FastifyReply } from "fastify";

// GET /movies/popular
// GET /movies/popular
export async function getPopularMovies(
  request: FastifyRequest<{ Querystring: { page?: string; with_genres?: string } }>,
  reply: FastifyReply
) {
  try {
    const { page, with_genres } = request.query;
    const pageNumber = page || "1";
    const API_KEY = process.env.TMDB_API_KEY!;

    // إذا وجد genreId نستخدم رابط discover، وإذا لم يوجد نستخدم رابط popular
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNumber}`;
    
    if (with_genres) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=${pageNumber}&with_genres=${with_genres}&sort_by=popularity.desc`;
    }

    const res = await fetch(url);
    const data = await res.json();
    return reply.send(data);
  } catch (error) {
    return reply.status(500).send({ error: "Server error" });
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
export async function getMoviesByGenre(
  request: FastifyRequest<{ Querystring: { genre: string; page?: string } }>,
  reply: FastifyReply
) {
  try {
    const { genre, page } = request.query;
    const pageNumber = page || "1";
    
    if (!genre) {
      return reply
        .status(400)
        .send({ error: "Genre query parameter is required" });
    }

    const API_KEY = process.env.TMDB_API_KEY!;
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genre}&page=${pageNumber}`
    );

    if (!res.ok) {
      return reply
        .status(res.status)
        .send({ error: "Failed to fetch movies by genre" });
    }

    const data = await res.json();
    return reply.send(data);
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Server error fetching movies by genre" });
  }
}


export async function getGenreList(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const API_KEY = process.env.TMDB_API_KEY!;
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );

    if (!res.ok) {
      return reply.status(res.status).send({ error: "Failed to fetch genres" });
    }

    const data = await res.json();
    return reply.send(data);
  } catch (error) {
    return reply.status(500).send({ error: "Server error fetching genres" });
  }
}