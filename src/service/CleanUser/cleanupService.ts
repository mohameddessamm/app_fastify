import cron from 'node-cron';
import { prisma } from '../../lib/prisma'; // تأكد من صحة المسار

/**
 * وظيفة احترافية لتنظيف الحسابات غير المفعلة
 * يتم تشغيلها دورياً لحذف الحسابات التي لم يتم تفعيلها خلال ساعة
 */
export const initCleanupTask = () => {
  // تشغيل المهمة كل 30 دقيقة
  cron.schedule('* * * * *', async () => {
    const startTime = new Date();
    console.log(`[Cleanup] بدأت عملية التنظيف في: ${startTime.toISOString()}`);

    // تحديد الوقت المرجعي (قبل ساعة من الآن)
    const expirationThreshold = new Date(Date.now() - 2 * 60 * 1000);

    try {
      // تنفيذ الحذف الجماعي بطلب واحد لقاعدة البيانات (Performance Optimized)
      const result = await prisma.user.deleteMany({
        where: {
          isVerified: false,
          createdAt: {
            lt: expirationThreshold, // أقل من (أقدم من) ساعة واحدة
          },
        },
      });

      if (result.count > 0) {
        console.log(`[Cleanup] بنجاح: تم حذف ${result.count} حساب غير مفعل.`);
      } else {
        console.log('[Cleanup] لا يوجد حسابات منتهية الصلاحية لحذفها.');
      }
    } catch (error) {
      console.error('[Cleanup] خطأ فادح أثناء تنظيف الحسابات:', error);
    }
  });
};