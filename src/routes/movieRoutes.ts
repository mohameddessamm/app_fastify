import { FastifyInstance } from "fastify";
import { getPopularMovies, searchMovies } from "../controller/moveis/movieController";

export async function movieRoutes(app: FastifyInstance) {
  // تعريف Route بدون أي أخطاء TypeScript

  app.get("/popular", getPopularMovies);
app.get(
  "/movies/search",
  {
    schema: {
      querystring: {
        type: "object",        // مهم جدًا
        properties: {
          query: { type: "string" }
        },
        required: ["query"]     // اختياري، لو عايز القيمة تبقى إجبارية
      }
    }
  },
  searchMovies
);
}