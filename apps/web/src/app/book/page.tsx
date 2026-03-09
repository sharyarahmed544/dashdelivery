import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata = {
  title: "Book a Delivery | Dash Delivery",
  description: "Book your same-day or next-day delivery with Dash.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[var(--bg)] text-[var(--fg)]">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-['Syne',sans-serif] font-extrabold uppercase mb-8">
          Book <em className="text-[var(--og)] italic">Delivery</em>
        </h1>
        <BookingFlow />
      </div>
    </main>
  );
}
