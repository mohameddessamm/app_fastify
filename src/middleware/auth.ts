import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../../service/jwt/auth";
import { prisma } from "../lib/prisma";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const token = request.cookies.token;

  if (!token) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Invalid or expired session register",
    });
  }

  try {
    const [isBlocked, decoded] = await Promise.all([
      prisma.blockedToken.findUnique({ where: { token } }),
      verifyToken(token),
    ]);

    if (isBlocked) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Invalid or expired session  Please log in again",
      });
    }

    (request as any).user = decoded;
  } catch (error) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Invalid or expired session  Please log in again",
    });
  }
};
