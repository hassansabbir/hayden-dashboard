import type { Metadata } from "next";
import AuthLeft from "./AuthLeft";

export const metadata: Metadata = {
  title: "Tea-It-Up Admin | Sign In",
  description: "Golf club management portal",
};

export default function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full font-sans bg-white overflow-hidden">
      <AuthLeft />
      <div className="flex basis-[100%] flex-col items-center justify-center lg:basis-[50%] px-4 py-12 lg:px-6">
        {children}
      </div>
    </main>
  );
}
