import Script from "next/script";
import "./globals.css";
import Navbar from "./components/HomePage/Nav";
import TelegramAuthProvider from "./TelegramAuthProvider";

export const metadata = {
  title: "Chain Trail",
  description: "earn NFTs while playing your favorite game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="grid place-content-center">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <TelegramAuthProvider>
          <Navbar />
          {children}
        </TelegramAuthProvider>
      </body>
    </html>
  );
}
