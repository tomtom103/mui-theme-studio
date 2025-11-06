import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ThemeProvider from "@/components/shared/ThemeProvider";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MUI Theme Studio",
  description:
    "A visual development tool for creating and managing MUI v8 themes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className} style={{ margin: 0 }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
