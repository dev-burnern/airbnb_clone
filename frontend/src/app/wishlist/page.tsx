import Wishlist from "@/widgets/wish-list/wish-list";

export default function WishlistPage() {
  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">위시리스트</h1>
        <Wishlist />
      </main>
    </>
  );
}
