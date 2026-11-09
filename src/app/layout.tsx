import type { Metadata } from "next";
import { Inter, Libre_Franklin, Source_Code_Pro, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Hill Top Hawk",
    template: "%s · Hill Top Hawk",
  },
  description: "Welcome to the Middle American Freakshow.",
};

// Dark is the default (set on <html> below). This runs before first paint and
// switches to light only for visitors who picked light with the toggle, so
// there's no flash either way.
const themeScript = `try{if(localStorage.getItem('hth-dark-mode')==='0')delete document.documentElement.dataset.theme}catch(e){}`;

// Root layout: fonts, globals and theme only. The site header/footer live in
// (site)/layout.tsx so the Sanity Studio at /studio doesn't get them.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${libreFranklin.variable} ${sourceSerif.variable} ${inter.variable} ${sourceCodePro.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
