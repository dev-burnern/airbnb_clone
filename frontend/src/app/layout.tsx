import ReduxProvider from "./providers";
import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Airbnb Clone",
  description: "An Airbnb clone built with Next.js and Redux Toolkit",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}