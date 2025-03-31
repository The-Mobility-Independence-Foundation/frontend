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

  useEffect(() => {
    // backendService.get("/users/@me")
    // .then(response => {
    //   const responseAsUser = response as User;
    //   if(!responseAsUser.success) {
    //     toast(responseAsUser.message);
    //     router.push("/landing");
    //     return;
    //   }
    //   setUser(responseAsUser.data);
    // })
    // .catch(error => {
    //   console.error(error);
    //   router.push("/landing");
    // });
  }, []);

  return (
    <html lang="en">
      <body className={`${interRegular.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="w-full h-screen flex flex-col">
            {!usePathname().endsWith("/landing") && <Header />}
            
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
