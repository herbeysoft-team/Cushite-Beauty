import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Truck, ShieldCheck, Sparkles, RotateCcw } from "lucide-react";

import { getAllProducts, getAllCategories } from "../../services/firebase/firestore";
import { useCart } from "../../context/CartContext";
import { ProductCard } from "../../components/product";
import { Loader } from "../../components/common";
import { Heading, Text } from "../../components/ui/Typography";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const TRUST_BADGES = [
  { icon: Truck, label: "Fast Delivery", description: "Edinburgh, UK & Africa" },
  { icon: ShieldCheck, label: "Secure Payment", description: "Card, transfer or on delivery" },
  { icon: Sparkles, label: "Authentic Products", description: "Sourced with care" },
  { icon: RotateCcw, label: "Easy Returns", description: "Hassle-free process" },
];

function SectionHeading({ eyebrow, title, action }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="mb-8 flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        {eyebrow && (
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "#F59A23", fontFamily: "'Poppins', sans-serif" }}
          >
            {eyebrow}
          </p>
        )}
        <Heading level="h2">{title}</Heading>
      </div>
      {action}
    </motion.div>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    let active = true;
    Promise.all([getAllProducts(), getAllCategories()]).then(([productData, categoryData]) => {
      if (!active) return;
      setProducts(productData);
      setCategories(categoryData);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const newArrivals = useMemo(() => products.filter((p) => p.isNew).slice(0, 8), [products]);

  const cushiteCollection = useMemo(
    () =>
      [...products]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4),
    [products]
  );

  const handleAddToCart = (product) => {
    addItem(product, undefined, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <main className="bg-[#FAFAFA]">
      {/* Hero */}
      <section className="flex min-h-screen items-center">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 lg:flex-row lg:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl text-center lg:text-left"
          >
            <p
              className="mb-4 text-lg font-medium uppercase tracking-[0.3em]"
              style={{ color: "#F59A23", fontFamily: "'Poppins', sans-serif" }}
            >
              Luxury Cosmetics
            </p>

            <h1
              className="text-5xl font-bold leading-tight md:text-7xl"
              style={{ fontFamily: "Playfair Display", color: "#4A136C" }}
            >
              Beauty That
              <br />
              Defines You.
            </h1>

            <p
              className="mt-6 text-lg leading-8 text-gray-600"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Discover premium skincare, makeup, fragrances, and beauty
              essentials carefully selected to enhance your confidence and
              elegance.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/shop"
                className="rounded-full px-8 py-4 text-white transition-all duration-300 hover:scale-105"
                style={{ background: "#4A136C", fontFamily: "'Poppins', sans-serif" }}
              >
                Shop Collection
              </Link>

              <Link
                to="/shop"
                className="rounded-full border-2 px-8 py-4 transition-all duration-300 hover:bg-[#4A136C] hover:text-white"
                style={{ borderColor: "#4A136C", color: "#4A136C", fontFamily: "'Poppins', sans-serif" }}
              >
                Explore Products
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="mt-20 flex justify-center lg:mt-0"
          >
            <div
              className="flex h-[450px] w-[450px] items-center justify-center rounded-full"
              style={{ background: "linear-gradient(135deg,#4A136C 0%, #7A2DAA 100%)" }}
            >
              <div className="text-center text-white">
                <h2 className="text-3xl" style={{ fontFamily: "Playfair Display" }}>
                  Cushite
                </h2>
                <p className="mt-3 text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Your Product Showcase
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-[var(--border)] bg-white py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
          {TRUST_BADGES.map(({ icon: Icon, label, description }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
            >
              <Icon size={22} className="text-[var(--primary)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {label}
                </p>
                <p className="text-xs text-[var(--text-light)]">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {loading ? (
        <Loader fullScreen label="Loading collection..." />
      ) : (
        <>
          {/* New Arrivals */}
          {newArrivals.length > 0 && (
            <section className="mx-auto max-w-7xl px-6 py-20">
              <SectionHeading
                eyebrow="Just In"
                title="New Arrivals"
                action={
                  <Link to="/shop" className="text-sm font-semibold text-[var(--primary)]">
                    Shop All →
                  </Link>
                }
              />
              <motion.div
                variants={staggerGrid}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              >
                {newArrivals.map((product) => (
                  <motion.div key={product.id} variants={fadeUp}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* Cushite Collection */}
          {cushiteCollection.length > 0 && (
            <section className="py-20" style={{ background: "linear-gradient(135deg,#4A136C 0%, #381055 100%)" }}>
              <div className="mx-auto max-w-7xl px-6">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="mb-8 text-center"
                >
                  <p
                    className="mb-1 text-xs font-semibold uppercase tracking-[0.25em]"
                    style={{ color: "#F59A23", fontFamily: "'Poppins', sans-serif" }}
                  >
                    Signature Edit
                  </p>
                  <h2 className="text-3xl font-bold text-white md:text-4xl" style={{ fontFamily: "Playfair Display" }}>
                    The Cushite Collection
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-white/70" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Our most-loved pieces, chosen by customers across Edinburgh, the UK and Africa.
                  </p>
                </motion.div>

                <motion.div
                  variants={staggerGrid}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {cushiteCollection.map((product) => (
                    <motion.div key={product.id} variants={fadeUp}>
                      <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* Shop by Category */}
          {categories.length > 0 && (
            <section className="mx-auto max-w-7xl px-6 py-20">
              <SectionHeading eyebrow="Browse" title="Shop by Category" />
              <motion.div
                variants={staggerGrid}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
              >
                {categories.map((category) => (
                  <motion.div key={category.id} variants={fadeUp}>
                    <Link
                      to={`/shop?category=${category.slug}`}
                      className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-4 text-center transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                    >
                      <span
                        className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
                        style={{ background: "linear-gradient(135deg,#4A136C 0%, #7A2DAA 100%)" }}
                      >
                        {category.name?.[0]}
                      </span>
                      <span
                        className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--primary)]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {category.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default Home;
