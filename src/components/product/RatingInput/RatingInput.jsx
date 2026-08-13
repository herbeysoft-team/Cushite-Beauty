import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

/** RatingInput — interactive star picker for writing a review. */
function RatingInput({ value = 0, onChange, size = 24 }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={
              star <= (hovered || value)
                ? "fill-[var(--secondary)] text-[var(--secondary)]"
                : "fill-transparent text-[var(--border)]"
            }
          />
        </motion.button>
      ))}
    </div>
  );
}

export default RatingInput;
