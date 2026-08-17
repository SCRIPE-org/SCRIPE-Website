import localFont from "next/font/local";

export const archivo = localFont({
  src: [
    {
      path: "./Archivo-var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
});

export const inter = localFont({
  src: [
    {
      path: "./Inter-var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const notoKufi = localFont({
  src: [
    {
      path: "./NotoKufiArabic-var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-noto-kufi",
  display: "swap",
});

export const notoSans = localFont({
  src: [
    {
      path: "./NotoSansArabic-var.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans",
  display: "swap",
});

export function fontClassesFor(locale: "en" | "ar"): string {
  if (locale === "ar") {
    return [archivo.variable, inter.variable, notoKufi.variable, notoSans.variable].join(" ");
  }
  return [archivo.variable, inter.variable].join(" ");
}
