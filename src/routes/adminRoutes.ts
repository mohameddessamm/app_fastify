import { FastifyInstance } from 'fastify';

import { createRootAdmin } from '../controller/admin/admin.setup';
import { authenticate } from '../middleware/auth';
import { adminOnly } from "../middleware/roleCheck";
import { adminLoginHandler } from '../controller/admin/adminLoginHandler';
// import { addMovie, deleteMovie } from '../controller/movieController'; // تأكد من استيراد الدوال

export async function adminRoutes(app: FastifyInstance) {
    // مسار سري لإنشاء الأدمن الأول
    app.post("/create-root-admin", createRootAdmin);
    app.post("/login-admin", adminLoginHandler);
    // مجموعة مسارات محمية (يجب أن يكون مسجل دخول + رتبته أدمن)
    app.register(async (adminGroup) => {
        adminGroup.addHook("preHandler", async (request, reply) => {
            await authenticate(request, reply);
            await adminOnly(request, reply);
        });

        // adminGroup.post("/movies", addMovie);
        // adminGroup.delete("/movies/:id", deleteMovie);
    });
}