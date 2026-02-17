import { FastifyInstance } from 'fastify';
import { addMovie, deleteMovie } from '../controller/admin/movieController';
import { adminOnly } from '../middleware/roleCheck';

export async function movieRoutes(app: FastifyInstance) {
    // جميع المسارات هنا ستستخدم بادئة واحدة إذا أردت
    app.post("/movies", { preHandler: [adminOnly] }, addMovie);
    app.delete("/movies/:id", { preHandler: [adminOnly] }, deleteMovie);
}