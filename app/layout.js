import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Almarai } from 'next/font/google'
import ClientProviders from "./ClientProviders";

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  display: 'swap',
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: "Ruento | روينتو للسياحة والسفر",
  description: "Travel to Russia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={almarai.className}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}