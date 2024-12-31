import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// استفاده از NextAuth برای تنظیم مسیریابی
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);