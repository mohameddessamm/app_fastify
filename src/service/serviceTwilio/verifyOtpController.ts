import { FastifyRequest, FastifyReply } from "fastify";
import { generateToken } from "../jwt/auth";
import { prisma } from "../../lib/prisma";

export const verifyOtpRegister = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { phone, otp } = request.body as { phone: string; otp: string };

  if (!phone || !otp) {
    return reply.status(400).send({ message: "please insert otp" });
  }

  try {
    // . البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user || user.otpCode !== otp) {
      return reply.status(400).send({ message: "الكود غير صحيح" });
    }
    // verify otp

    if (new Date() > user.otpExpiresAt!) {
      return reply.status(400).send({ message: "انتهت صلاحية الكود" });
    }
    // (Atomic Update)

    const updatedUser = await prisma.user.update({
      where: { phone },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    // 5. generate token
    const token = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    // send token in kookie
    return reply
      .setCookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // أسبوع
      })
      .status(200)
      .send({
        message: "Account Verified Successfully ",
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
        },
      });
  } catch (error: any) {
    // 7. معالجة الأخطاء بشكل احترافي
    if (error.message === "USER_NOT_FOUND") {
      return reply.status(404).send({ message: "otp not exist" });
    }
    if (error.message === "INVALID_OR_EXPIRED_OTP") {
      return reply.status(400).send({ message: "otp NotExpired" });
    }

    console.error("OTP Error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
