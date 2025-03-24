
import "./globals.css";

export const metadata = {
  title: "Legal Case Summarizer",
  description: "Summarize legal cases with ease",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Legal Summarizer AI</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
