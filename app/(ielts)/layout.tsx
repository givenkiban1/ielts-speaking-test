
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <div className="pt-10 px-5">
          {children}
        </div>
      </>
  );
}
