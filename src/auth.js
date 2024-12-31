import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
        action: { type: "text", placeholder: "login/register" },
      },
      async authorize(credentials) {
        const { email, password, action } = credentials ?? {};

        try {
          if (action === "login") {
            // LOGIN flow
            const response = await fetch("http://127.0.0.1:7001/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include", // include cookies
              body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
              throw new Error(`Login failed: ${response.statusText}`);
            }

            // Assuming the response contains user data and sets cookies:
            // { userId, email, name, accessToken, refreshToken } (or similar)
            const data = await response.json();
            if (data) {
              // You may store the tokens here in a combined object to pass to the jwt callback.
              return {
                id: data.userId,
                email: data.email,
                name: data.name,
                accessToken: data.accessToken, // from server
                refreshToken: data.refreshToken, // from server
              };
            }
            return null;
          }

          if (action === "register") {
            // REGISTRATION flow
            const response = await fetch("http://127.0.0.1/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include", // include cookies
              body: JSON.stringify({ email }),
            });

            if (!response.ok) {
              throw new Error(`Registration failed: ${response.statusText}`);
            }

            // Assuming the response contains user data and sets cookies:
            // { userId, email, name, accessToken, refreshToken } (or similar)
            const data = await response.json();
            if (data) {
              return {
                id: data.userId,
                email: data.email,
                name: data.name,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              };
            }
            return null;
          }

          // If action is neither 'login' nor 'register':
          throw new Error("Invalid action");
        } catch (error) {
          console.error("Authorization error:", error);
          // Throw a generic error to the NextAuth client
          throw new Error("Invalid credentials or action");
        }
      },
    }),
  ],

  callbacks: {
    /**
     * The `jwt` callback is called whenever a token is created or updated.
     * We can add additional data (like accessToken/refreshToken) to the token object here.
     */
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      if (user?.refreshToken) {
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    /**
     * The `session` callback is called whenever a session is checked.
     * We can expose data from the token to the session object here.
     */
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token?.refreshToken) {
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },

  pages: {
    signIn: "/", // Redirect to your homepage or custom login page on signIn
  },

  session: {
    strategy: "jwt", // Use JWT for session strategy
  },
};

export default authConfig;
