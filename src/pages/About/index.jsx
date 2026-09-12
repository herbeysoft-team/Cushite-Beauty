import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Globe2, Heart, ShieldCheck } from "lucide-react";
import { Heading, Text } from "../../components/ui/Typography";
import Button from "../../components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Authenticity",
    description: "Every product is sourced with care and chosen for real quality, not just packaging.",
  },
  {
    icon: Globe2,
    title: "Community",
    description: "Rooted in Edinburgh, reaching across the UK and Africa — beauty that travels with you.",
  },
  {
    icon: Heart,
    title: "Confidence",
    description: "We believe great beauty products should make you feel like the best version of yourself.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    description: "Transparent pricing, honest descriptions, and support that actually helps.",
  },
];

function About() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Hero */}
      <section className="py-20" style={{ background: "linear-gradient(135deg,#4A136C 0%, #381055 100%)" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <p className="mb-3 text-xs font-semibold font-heading uppercase tracking-[0.25em] text-[#F59A23]">
            Our Story
          </p>
          <Heading level="h1" className="!text-white font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Beauty That Defines You
          </Heading>
          <Text className="mt-4 text-white/80" size="lg">
            Cushite Beauty is a home for premium skincare, makeup and fragrances —
            built to celebrate elegance in every form, wherever you are.
          </Text>
        </motion.div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Heading level="h3" className="mb-4">Who We Are</Heading>
          <Text tone="muted" size="lg" className="mb-4">
            Cushite Beauty started with a simple idea: beauty essentials should feel
            personal, not mass-produced. We hand-pick every product in our
            catalogue — skincare that actually works, makeup that lasts, and
            fragrances worth remembering.
          </Text>
          <Text tone="muted" size="lg">
            From our base in Edinburgh, we ship across the UK and to customers
            throughout Africa, bringing the same care and attention to every
            order regardless of where it's headed.
          </Text>
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <Heading level="h3">What We Stand For</Heading>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {VALUES.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="rounded-[var(--radius-lg)] border border-[var(--border)] p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <Icon size={22} className="text-[var(--primary)]" />
                </div>
                <Text className="mb-1 font-semibold">{title}</Text>
                <Text tone="muted" size="sm">{description}</Text>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <Heading level="h3" className="mb-4">Ready to Explore?</Heading>
        <Link to="/shop">
          <Button variant="primary" size="lg">Shop the Collection</Button>
        </Link>
      </section>
    </main>
  );
}

export default About;
