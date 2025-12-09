import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
    matcher: [
        // Match all pathnames except for
        // - /api routes
        // - /_next (Next.js internals)
        // - /_vercel (Vercel internals)
        // - /images, /video, /fonts (static files)
        // - Files with extensions (.ico, .svg, etc)
        "/((?!api|_next|_vercel|images|video|fonts|.*\\..*).*)",
    ],
};
