import NextAuth, {DefaultSession} from "next-auth";
import parse, {splitCookiesString} from "set-cookie-parser";

import Credentials from "next-auth/providers/credentials";
import {cookies} from "next/dist/client/components/headers";
import {authService} from "@/app/api/services/auth.Service";

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
}
//#endregion

export const {auth, handlers, signIn, signOut} = NextAuth({
    callbacks: {
        async session({token, session}) {
            /** eger kullanici giris yapmis ise token icinde sub olusur
             * ve session icindede user objesi olusur */
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
        async jwt({token}) {
            /** burda yazan yetkilendirme kodu kullanici her bir sayfa
             * degistirdiginde tetikleniyor surekli olarak guncel yetkisini cekiyor yani
             */

            //bu kisimda userin session icinde gozuken role yetkisini ekliyoruz
            if (!token.sub) return token;

            const userAuthenticated = await authService.getLoggedInUserServer();
            if (userAuthenticated.status === 401) {
                await signOut();
            }
            return token;
        },
    },
    session: {strategy: "jwt"},
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                const {email, password} = credentials as {
                    email: string,
                    password: string,
                };

                try {
                    // API'ye giriş isteği yap
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({email, password}),
                    });

                    // Yanıt durumunu kontrol et
                    if (!response.ok) {
                        console.error('auth credentials failed response', response);
                        return null;
                    }

                    // Çerezleri ayarla
                    const responseCookies: any = response.headers.get('set-cookie');
                    if (responseCookies) {
                        const splittedCookie = splitCookiesString(responseCookies);
                        const cookieObj = parse(splittedCookie);
                        cookies().set({
                            name: cookieObj[0].name,
                            value: cookieObj[0].value,
                            domain: cookieObj[0].domain,
                            expires: cookieObj[0].expires,
                            httpOnly: cookieObj[0].httpOnly,
                            path: cookieObj[0].path,
                        });
                    }
                    // Kullanıcı bilgilerini döndür
                    const user = await response.json();
                    return {id: user.user_id, name: user.user_name, email: user.user_email};

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