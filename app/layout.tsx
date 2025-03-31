"use client"

import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Suspense, useEffect, useState } from "react";
import backendService from "./services/backend.service";
import { User, UserData } from "./models/User";
import { toast } from "sonner";
import ProfileSidebar from "./components/ProfileSidebar";
// import backendService from "./services/backend.service";
// import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import { Spinner } from "@/components/ui/spinner";

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
  const [user, setUser] = useState<UserData>();
  const [isSelf, setIsSelf] = useState(false);

  const router = useRouter();
  const {data, isLoading, isError} = useUser();
  const pathName = usePathname();

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
            {!pathName.endsWith("/landing") && <Header />}
            
            <div className="flex flex-1">
              {usePathname().startsWith("/account") && user && 
              <ProfileSidebar 
                user={user}
              />}

              <main className="flex-1">{children}</main>
            </div>
          </div>
          <Toaster richColors />
        </Suspense>
      </body>
    </html>
  );
}
