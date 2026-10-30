import "./globals.css";

export const metadata = {
  title: "CarbonGrid",
  description: "Geospatial sustainability and carbon intelligence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
