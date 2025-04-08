"use client"

import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Suspense, useEffect } from "react";
import ProfileSidebar from "./components/ProfileSidebar";
import { useUser } from "@/lib/hooks/useUser";
import { Spinner } from "@/components/ui/spinner";
import EventEmitter from "events";

const interRegular = localFont({
  src: "./fonts/Inter-Regular.woff",
  variable: "--font-inter",
  weight: "100 600 900"
});

export const userEmitter = new EventEmitter();
userEmitter.setMaxListeners(100);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {data, isLoading, isError} = useUser();
  const pathName = usePathname();

  useEffect(() => {
    if(data?.success) {
      userEmitter.emit("user", data.data);
    }
  }, [pathName, data]);

  // User is not logged in, there was an error, or the request is still executing
  if (isLoading || isError || (!data.success && pathName != "/landing")) {
    return (
      <html lang="en">
        <body className={`${interRegular.variable} antialiased`}>
          <div className="flex items-center justify-center h-screen">
            <Spinner></Spinner>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${interRegular.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="w-full h-screen flex flex-col">
            {!pathName.endsWith("/landing") && data.success && <Header />}
            
            <div className="flex flex-1">
              {pathName.startsWith("/account") && data.success && 
              <ProfileSidebar isAdmin={data.data.type == "admin"} />}

              <main className="flex-1" >{children}</main>
            </div>
          </div>
          <Toaster richColors />
        </Suspense>
      </body>
    </html>
  );
}
