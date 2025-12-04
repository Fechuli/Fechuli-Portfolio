import type { Metadata } from "next";

const SITE_NAME = "Fechuli";
const SITE_URL = "https://fechuli.it";

interface PageMetadataOptions {
    title: string;
    description: string;
    path?: string;
    image?: string;
}

export function createMetadata({
    title,
    description,
    path = "",
    image = "/og-image.png",
}: PageMetadataOptions): Metadata {
    const url = `${SITE_URL}${path}`;

    return {
        title: `${title} | ${SITE_NAME}`,
        description,
        openGraph: {
            title: `${title} | ${SITE_NAME}`,
            description,
            url,
            siteName: SITE_NAME,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: "it_IT",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | ${SITE_NAME}`,
            description,
            images: [image],
        },
        alternates: {
            canonical: url,
        },
    };
}
