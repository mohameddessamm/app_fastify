import { FastifyInstance } from 'fastify';
import { registerHandler } from "../controller/user/userRegister";
import { loginHandler } from '../controller/user/userLogin';
import { logoutHandler } from '../controller/user/userLogout';
import { verifyOtpRegister } from '../service/serviceTwilio/verifyOtpController';
import { authenticate } from '../middleware/auth';
import { createRootAdmin } from '../controller/admin/admin.setup';

export async function userRoutes(app: FastifyInstance) {
    app.post("/register", registerHandler);
    app.post("/verify-otp", verifyOtpRegister);
    app.post("/login", loginHandler);
    app.post("/logout", logoutHandler);
    app.post("/create-root-admin", createRootAdmin);
    app.get("/profile", { preHandler: [authenticate] }, async (request, reply) => {
        const user = (request as any).user;
        return reply.send({ message: 'أهلاً بك', user });
    });
}