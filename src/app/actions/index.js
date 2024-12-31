'use server';

import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

export async function handleAuth({ email, password, isLogin, callbackUrl }) {
  try {
    const response = await signIn('credentials', {
      email,
      password: isLogin ? password : undefined, // پسورد فقط برای ورود
      isRegister: isLogin ? 'login' : 'register', // مشخص کردن حالت
      callbackUrl: callbackUrl ?? '/dashboard', // مسیر بازگشت
      redirect: false, // از هدایت مستقیم جلوگیری می‌کند
    });

    if (response?.error) {
      toast.error(
        isLogin
          ? 'ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.'
          : 'ثبت‌نام ناموفق بود. لطفاً دوباره تلاش کنید.'
      );
    } else {
      toast.success(
        isLogin ? 'با موفقیت وارد شدید!' : 'ثبت‌نام با موفقیت انجام شد!'
      );
    }
    return response;
  } catch (error) {
    console.error('Error in handleAuth:', error);
    toast.error('مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.');
    return null;
  }
}
