import { motion } from "framer-motion";
import { Heading, Text } from "../../ui/Typography";
import { cn } from "../../../lib/cn";

/**
 * PageHeader — dark purple banner used at the top of standard pages
 * (Shop, Cart, Checkout, Orders, etc.) so every page shares the same
 * "dark header, light title" look.
 */
function PageHeader({ title, subtitle, align = "center", children }) {
  return (
    <section
      className="py-14 sm:py-16"
      style={{ background: "linear-gradient(135deg,#4A136C 0%, #381055 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "mx-auto max-w-7xl px-6",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        <Heading level="h1" align={align} className="!text-white">
          {title}
        </Heading>
        {subtitle && (
          <Text size="lg" className={cn("mt-3 text-white/70", align === "center" && "mx-auto max-w-xl")}>
            {subtitle}
          </Text>
        )}
        {children}
      </motion.div>
    </section>
  );
}

export default PageHeader;
