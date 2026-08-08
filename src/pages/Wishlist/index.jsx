function Wishlist() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h1
          className="text-center text-4xl font-bold md:text-5xl"
          style={{ fontFamily: "Playfair Display", color: "#4A136C" }}
        >
          Your Wishlist
        </h1>
        <p
          className="mx-auto mt-4 max-w-xl text-center text-gray-600"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Saved for later.
        </p>
      </section>
    </main>
  );
}

export default Wishlist;
