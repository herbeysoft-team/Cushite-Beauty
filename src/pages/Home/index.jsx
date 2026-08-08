function Home() {
  return (
    <main className="bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="flex min-h-screen items-center">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 lg:flex-row lg:justify-between">

          {/* Left Content */}
          <div className="max-w-xl text-center lg:text-left">
            <p
              className="mb-4 text-lg font-medium uppercase tracking-[0.3em]"
              style={{
                color: "#F59A23",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Luxury Cosmetics
            </p>

            <h1
              className="text-5xl font-bold leading-tight md:text-7xl"
              style={{
                fontFamily: "Playfair Display",
                color: "#4A136C",
              }}
            >
              Beauty That
              <br />
              Defines You.
            </h1>

            <p
              className="mt-6 text-lg leading-8 text-gray-600"
              style={{
               fontFamily: "'Poppins', sans-serif",
              }}
            >
              Discover premium skincare, makeup, fragrances, and beauty
              essentials carefully selected to enhance your confidence and
              elegance.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <button
                className="rounded-full px-8 py-4 text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: "#4A136C",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Shop Collection
              </button>

              <button
                className="rounded-full border-2 px-8 py-4 transition-all duration-300 hover:bg-[#4A136C] hover:text-white"
                style={{
                  borderColor: "#4A136C",
                  color: "#4A136C",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Explore Products
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="mt-20 flex justify-center lg:mt-0">
            <div
              className="flex h-[450px] w-[450px] items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg,#4A136C 0%, #7A2DAA 100%)",
              }}
            >
              <div className="text-center text-white">
                <h2
                  className="text-3xl"
                  style={{
                    fontFamily: "Playfair Display",
                  }}
                >
                  Cushite
                </h2>

                <p
                  className="mt-3 text-lg"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Your Product Showcase
                </p>
      
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Home;
