// RootLayout.js

export const metadata = {
  title: "Next.js 13 App with Tailwind",
  description: "Demo project with GoMaps integration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Additional metadata or links can be added here */}
      </head>
      <body className="font-sans w-full bg-gray-100">
        {children}
      </body>
    </html>
  );
}
