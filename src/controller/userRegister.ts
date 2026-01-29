import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma"; // تأكد من المسار الصحيح
import bcrypt from "bcrypt";
import crypto from "crypto";
import twilio from "twilio";

export const registerHandler = async (request: FastifyRequest, reply: FastifyReply) => {

  const { email, password, phone, username } = request.body as {
    email: string;
    password: string;
    phone: string;
    username: string;
  };

// (Validation)
  if (!email || !password || !phone || !username) {
    return reply.status(400).send({ message: "please fill all fields" });
  }

  try {
 
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }, { username }] },
    });

    if (existingUser) {
      return reply.status(400).send({ message: "this user already exists" });
    }

    // OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // صلاحية 10 دقائق

    // 5.create user 
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        phone,
        isVerified: false,
        otpCode: otp,
        otpExpiresAt: expiresAt,
        otpType: "ACCOUNT_VERIFICATION",
      },
    });

    // send SMS otp via Twilio
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
const formattedPhone = phone.startsWith('01') ? `+2${phone}` : phone;
    try {
      await client.messages.create({
        body: `كود التفعيل الخاص بحسابك هو: ${otp}، صالح لمدة 10 دقائق.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone, // تأكد أن الرقم بالصيغة الدولية مثل +201xxxx
      });
      console.log(`[SMS Sent] Successfully to ${phone}`);
    } catch (smsError) {
      console.error("Twilio Error:", smsError);
      // SMS 
    }

    // 
    return reply.status(201).send({
      message: "تم إنشاء الحساب بنجاح. يرجى تفعيل حسابك باستخدام الكود المرسل لهاتفك.",
      userId: newUser.id,
    });

  } catch (error) {
    console.error("Register Error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};