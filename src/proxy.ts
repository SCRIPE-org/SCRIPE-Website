import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// localeCookie: false is set on `routing` itself (next-intl v4 moved the
// option there) — see src/i18n/routing.ts.
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
