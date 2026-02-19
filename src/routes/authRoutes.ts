import { FastifyInstance } from 'fastify';
import { registerHandler } from "../controller/userRegister";
import { loginHandler } from '../controller/userLogin';
import { logoutHandler } from '../controller/userLogout';
import { verifyOtpRegister } from '../service/serviceTwilio/verifyOtpController';
import { authenticate } from '../middleware/auth';

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", registerHandler);
    app.post("/verify-otp", verifyOtpRegister);
    app.post("/login", loginHandler);
    app.post("/logout", logoutHandler);
    
    app.get("/profile", { preHandler: authenticate }, async (request, reply) => {
        const user = (request as any).user;
        return reply.send({ message: 'أهلاً بك', user });
    });
}