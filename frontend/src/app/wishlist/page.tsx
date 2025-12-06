import Wishlist from "@/widgets/wish-list/wish-list";
import SideHeader from "@/widgets/side_header/Header";

export default function WishlistPage() {
  return (
    <>
      <SideHeader />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">위시리스트</h1>
        <Wishlist />
      </main>
    </>
  );
}
