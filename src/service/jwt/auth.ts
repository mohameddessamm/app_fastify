import jwt from 'jsonwebtoken';

// 1. تعريف واجهة (Interface) لشكل البيانات داخل التوكن
// هذا سيحل مشكلة "Property role does not exist"
interface TokenPayload {
  id: number;
  email: string;
  role: string; // أضفنا الرتبة هنا لكي يفهمها TypeScript
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('خطأ: JWT_SECRET غير معرف في ملف .env');
  }
  return secret;
};

// 2. تعديل الدالة لتستقبل الـ Payload بالأنواع الجديدة
export const generateToken = (payload: TokenPayload): string => {
  const secret = getSecret();
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// 3. تعديل دالة التحقق لترجع الـ Payload المحدد أو null
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret = getSecret();
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    return null;
  }
};