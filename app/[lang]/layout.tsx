import "../assets/scss/globals.scss";
import "../assets/scss/theme.scss";
import {Inter} from "next/font/google";
import {siteConfig} from "@/config/site";
import Providers from "@/provider/providers";
import "simplebar-react/dist/simplebar.min.css";
import TanstackProvider from "@/provider/providers.client";
import {SessionProvider} from "next-auth/react";
import "flatpickr/dist/themes/light.css";
import DirectionProvider from "@/provider/direction.provider";
import {auth} from "@/lib/auth";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
};

export default async function RootLayout({children, params: {lang}}: {
    children: React.ReactNode;
    params: { lang: string }
}) {
    const session = await auth();
    return (
        <html lang={"en"}>
        <SessionProvider session={session}>
            <TanstackProvider>
                <Providers>
                    <DirectionProvider lang={"en"}>{children}</DirectionProvider>
                </Providers>
            </TanstackProvider>
        </SessionProvider>
        </html>
    );
}
