import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "University Events & Student Achievements",
  description: "Открытая платформа событий университета и достижений студентов"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
