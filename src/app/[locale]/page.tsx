import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Field } from "@/components/ui/Field";
import { Section } from "@/components/ui/Section";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("nav");

  return (
    <>
      {/* Task 8 smoke test: exercises the UI primitives together. Replaced
          by real page composition in later tasks. */}
      <Section width="default">
        <Eyebrow>SCRIPE</Eyebrow>
        <h1 className="text-accent bg-surface-page rounded-xs font-display">{t("bookDemo")}</h1>
        <div className="flex gap-3">
          <Button href="/">{t("bookDemo")}</Button>
          <Button variant="outline">{t("bookDemo")}</Button>
        </div>
        {/* Task 10 smoke test: exercises the Reveal motion primitive.
            Replaced by real page composition in later tasks. */}
        <Reveal>
          <Card accent="academy">
            <Field label={t("bookDemo")} hint="Smoke test hint">
              <input type="text" />
            </Field>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
