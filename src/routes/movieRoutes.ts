
import { FastifyInstance } from "fastify";
import { 
  getGenreList, 
  getPopularMovies, 
  searchMovies, 
  getMoviesByGenre 
} from "../controller/moveis/movieController";

export async function movieRoutes(app: FastifyInstance) {
  // 1. مسار الأفلام الشائعة (Popular)
  app.get("/popular", getPopularMovies);

  // 2. مسار قائمة التصنيفات (Genres List)
  app.get("/genres", getGenreList);

  // 3. مسار البحث عن الأفلام (Search)
  app.get(
    "/search",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            query: { type: "string" },
            page: { type: "string" }
          },
          required: ["query"] // البحث يتطلب نصاً للبحث
        }
      }
    },
    searchMovies
  );

  // 4. مسار جلب الأفلام حسب تصنيف محدد (Movies by Genre)
  app.get(
    "/genre",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            genre: { type: "string" }, // هذا هو الـ ID الخاص بالتصنيف
            page: { type: "string" }
          },
          required: ["genre"]
        }
      }
    },
    getMoviesByGenre
  );

}