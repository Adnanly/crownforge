import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";
import PageLoader from "@/components/PageLoader";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: { default: "CrownForge Games", template: "%s | CrownForge" },
  description: "Next-generation immersive gaming experiences built for the brave.",
  keywords: ["CrownForge","games","game studio","indie games","mobile games"],
  openGraph: { type: "website", siteName: "CrownForge Games", title: "CrownForge Games", description: "Next-generation immersive gaming experiences." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ background: "#030303", color: "#f1f5f9", margin: 0, overflowX: "hidden" }}>
        <AuthProvider>
          <PageLoader />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: "#0f0f0f", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "0.875rem" },
              success: { iconTheme: { primary: "#facc15", secondary: "#000" }, style: { borderColor: "rgba(250,204,21,0.2)" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" }, style: { borderColor: "rgba(239,68,68,0.2)" } },
            }}
          />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
