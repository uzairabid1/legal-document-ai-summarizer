
import "./globals.css";
import { Gabarito } from 'next/font/google';
export const metadata = {
  title: 'Legal Hearing Summarizer', // Updated title
  description: 'Summarize legal hearings with ease using AI',
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo.png" type="image/png" />
        <title>Legal Summarizer AI</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
