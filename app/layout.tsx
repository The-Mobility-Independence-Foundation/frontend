import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";

const interRegular = localFont({
  src: "./fonts/Inter-Regular.woff",
  variable: "--font-inter",
  weight: "100 600 900"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interRegular.variable} antialiased`}>

        <main>{children}</main>
      </body>
    </html>
  );
}
