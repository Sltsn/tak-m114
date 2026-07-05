import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgroKlinik - AI Destekli Bitki Sağlığı Platformu",
  description: "Yapay zeka ile bitki hastalıklarını teşhis edin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
