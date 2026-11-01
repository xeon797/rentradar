import type { Metadata } from "next";
import localFont from "next/font/local";
import { Hind_Siliguri, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/auth-context";

const fontSatoshi = localFont({
  src: [
    {
      path: "../../public/fonts/satoshi/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const fontBangla = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rentradar.bd"),
  title: {
    default: "RentRadar BD | Civic Rental Intelligence & Multimodal AI Inspector",
    template: "%s | RentRadar BD",
  },
  description:
    "Bangladesh housing intelligence platform powered by Google Gemini 2.5 Flash multimodal inspection, Sharp 9x8 perceptual dHash duplicate photo detection, true rental cost move-in shock engine, and Premises Rent Control Act 1991 statutory defense.",
  keywords: [
    "RentRadar",
    "Bangladesh Rental Scam Detector",
    "Dhaka Flat Rent",
    "Sylhet Mess Rent",
    "Chattogram Apartment",
    "Gemini 2.5 Flash",
    "Sharp dHash",
    "Premises Rent Control Act 1991",
    "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১",
    "AIgnite 2026",
  ],
  authors: [{ name: "RentRadar Civic Engineering Team" }],
  openGraph: {
    title: "RentRadar BD | Civic Rental Intelligence & Multimodal AI Inspector",
    description:
      "Evidence-based rental discovery, perceptual image collision detection, utility bill zero-LLM privacy vault, and 1991 Rent Control Act statutory assistant.",
    url: "https://rentradar.bd",
    siteName: "RentRadar BD",
    locale: "en_BD",
    type: "website",
    images: [
      {
        url: "/built-for-aignite-2026.png",
        width: 1200,
        height: 630,
        alt: "RentRadar - Built for AIgnite 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentRadar BD | Multimodal AI Housing Inspector",
    description:
      "Catch stolen-photo rental scams, calculate true Bangladesh move-in shock, and audit lease clauses under the Premises Rent Control Act, 1991.",
    images: ["/built-for-aignite-2026.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSatoshi.variable} ${fontBangla.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen bg-paper text-carbon font-sans antialiased flex flex-col selection:bg-radar selection:text-carbon">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
