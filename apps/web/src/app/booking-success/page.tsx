export const metadata = {
  title: "Booking Confirmed | Dash Delivery",
};

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--fg)] p-6">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-24 h-24 bg-[var(--og)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(255,107,0,0.4)]">
          <span className="text-4xl text-white font-bold">✓</span>
        </div>
        
        <h1 className="text-4xl font-['Syne',sans-serif] font-extrabold uppercase tracking-tight">
          Booking <br /><em className="text-[var(--og)] italic">Confirmed</em>
        </h1>
        
        <p className="text-gray-400 text-lg">
          Your payment was successful. We've sent a confirmation email with your tracking details and invoice.
        </p>

        <div className="pt-8">
          <a href="/" className="inline-block bg-white text-black font-bold py-4 px-8 rounded-lg uppercase tracking-wider hover:bg-gray-200 transition-colors w-full">
            Return to Homepage
          </a>
        </div>
      </div>
    </main>
  );
}
