import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("nav");

  return <h1 className="text-accent bg-surface-page rounded-xs font-display">{t("bookDemo")}</h1>;
}
