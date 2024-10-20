import {cookies} from "next/dist/client/components/headers";

/* Cookies kismindan back-end tarafindan
 * bize getirilen cookiyi alır */
// export const getMyCookie = () => {
//     const cStore = cookies();
//     const sessionCookie = cStore.get(process.env.NEXT_PUBLIC_SESSION_COOKIE || "");
//     if (!sessionCookie) return null;
//     const readable = sessionCookie?.name + "=" + sessionCookie?.value;
//     return readable;
// };
