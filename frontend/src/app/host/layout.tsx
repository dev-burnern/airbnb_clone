import Header from "@/widgets/main_header/Header";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
