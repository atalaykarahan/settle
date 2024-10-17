import NextAuth, { DefaultSession } from "next-auth";
import parse, { splitCookiesString } from "set-cookie-parser";

import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/dist/client/components/headers";
import { authService } from "@/app/api/services/auth.Service";

/** bu metodun amaci user.role kismi boyle bir alan yok
 * hatasi veriyor bunun onune gecmek icin yazildi */
//#region EXTENDED USER
export type ExtendedUser = DefaultSession["user"] & {
  role: any;
};
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface User {
    role?: string;
  }
}
//#endregion

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        //front-end tarafinda session icinde user_id degerine erismek icin
        session.user.id = token.sub;
      }

      //token icinden gelen role yetkisini session'a iletiyoruz
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, account, user }) {
      /** burda yazan yetkilendirme kodu kullanici her bir sayfa
       * degistirdiginde tetikleniyor surekli olarak guncel yetkisini cekiyor yani
       */

      //bu kisimda userin session icinde gozuken role yetkisini ekliyoruz
      if (!token.sub) return token;

      if (user && user.role !== undefined) {
        console.log("user kısmında role gözüküyor; ", user.role);
        token.role = user.role;
      }

      //   const userAuthenticated = await authService.getLoggedInUserServer();
      //   if (userAuthenticated.status === 401) {
      //       await signOut();
      //   }
      return token;
    },
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const { id, name, image, role } = credentials as {
          id: string;
          name: string;
          image: string;
          role: string;
        };

        try {
          return { id, name, image, role };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});

/** auth.js yapisindan dolayi user giris yapmis olsa bile session etrafinda user role bilgisi icin
 * tekrar api ye istek atıp user bilgilerini cekmemiz gerekiyor. bunu daha hafifletmek icin ise
 * redis icindeki session verisini cekiyoruz. Bu isin kotu yani user basarili bir sekilde giris yaptiktan sonra
 * 1 adet back-end istegi gidiyor veritabanina.
 */
