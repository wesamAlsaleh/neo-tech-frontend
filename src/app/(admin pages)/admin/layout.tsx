export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Side nav */}

        {/* main section */}
        <main>{children}</main>
      </body>
    </html>
  );
}
