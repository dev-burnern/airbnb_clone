import HostHeader from "@/components/host/HostHeader";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HostHeader />
      {children}
    </>
  );
}
