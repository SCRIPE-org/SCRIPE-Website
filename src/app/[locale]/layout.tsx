import "@/app/globals.css";
import { fontClassesFor } from "@/fonts";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html className={fontClassesFor(locale as "en" | "ar")}>
      <body>{children}</body>
    </html>
  );
}
