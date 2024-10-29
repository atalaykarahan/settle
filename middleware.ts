import {NextResponse} from "next/server";
import {apiAuthPrefix, authRoutes, publicRoutes} from "@/config/routes";
import {auth} from "@/lib/auth";

let locales = ["en"];
export default auth((req): any => {
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const pathname = nextUrl.pathname;
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/en/`) && pathname !== `/en`
    );
    if (isApiAuthRoute) return null;
    if (isAuthRoute) {
        return null;
    }
    if (!isLoggedIn && !isPublicRoute) {
        // return NextResponse.next();
        return NextResponse.redirect(new URL("/en/auth/login", nextUrl));
    }
    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // const locale = getLocale(req);
        // e.g. incoming request is /products
        // The new URL is now /en-US/products
        return NextResponse.redirect(
            new URL(`/en/${pathname}`, req.url)
        );
    }
    return null;
});
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

