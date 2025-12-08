import "@/app/globals.css";
import { JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import BBSContent from "./bbs-content";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export default async function BBSLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as "en" | "it")) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${jetbrainsMono.variable} bg-black font-mono`}>
                <NextIntlClientProvider messages={messages}>
                    <BBSContent>{children}</BBSContent>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
