function Checkout() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h1
          className="text-center text-4xl font-bold md:text-5xl"
          style={{ fontFamily: "Playfair Display", color: "#4A136C" }}
        >
          Checkout
        </h1>
        <p
          className="mx-auto mt-4 max-w-xl text-center text-gray-600"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Almost there \u2014 just a few details left.
        </p>
      </section>
    </main>
  );
}

export default Checkout;
