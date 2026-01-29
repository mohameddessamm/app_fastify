import jwt from 'jsonwebtoken';
// src/index.ts
// باقي الاستيرادات...
// 1. دالة لجلب المفتاح السري والتحقق من وجوده في الـ .env
const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('خطأ: JWT_SECRET غير معرف في ملف .env');
  }
  return secret;
};

// 2. دالة لإنشاء توكن جديد (Sign)
export const generateToken = (payload: object): string => {
  const secret = getSecret();
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// 3. دالة للتحقق من صحة التوكن (Verify)
export const verifyToken = (token: string): any => {
  try {
    const secret = getSecret();
    return jwt.verify(token, secret);
  } catch (error) {
    return null; // إذا كان التوكن منتهي أو غير صحيح يرجع null
  }
};