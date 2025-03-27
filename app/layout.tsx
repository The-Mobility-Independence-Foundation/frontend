"use client"

import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import backendService from "./services/backend.service";
import { useRouter } from "next/navigation";
import "react-chat-elements/dist/main.css";

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
  const router = useRouter();

  // TODO Uncomment when backend is hooked up
  // backendService.get("/users/@me").catch(error => {
  //   router.push('/landing');
  // })

  return (
    <html lang="en">
      <body className={`${interRegular.variable} antialiased`}>
        {!usePathname().endsWith("/landing") && <Header />}

        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
