import { useState } from "react";
import { Truck } from "lucide-react";
import Select from "../../forms/Select";
import { SHIPPING_LOCATIONS, getShippingCost } from "../../../lib/productPricing";
import { formatGBP } from "../../../lib/currency";

/** ShippingEstimate — location picker that shows the shipping cost for a product. */
function ShippingEstimate({ product }) {
  const [location, setLocation] = useState("edinburgh");
  const cost = getShippingCost(product, location);

  if (!product.shipping) return null;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--text)]">
        <Truck size={16} />
        <span style={{ fontFamily: "'Poppins', sans-serif" }}>Shipping</span>
      </div>

      <Select
        options={SHIPPING_LOCATIONS}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <p
        className="mt-3 text-sm text-[var(--text-light)]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {cost != null
          ? `${formatGBP(cost)} to this location`
          : "Shipping cost unavailable for this location"}
      </p>
    </div>
  );
}

export default ShippingEstimate;
