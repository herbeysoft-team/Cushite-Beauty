import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { getAllProducts, getAllCategories } from "../../services/firebase/firestore";
import { ProductCard } from "../../components/product";
import { Loader, EmptyState } from "../../components/common";
import Select from "../../components/forms/Select";
import { Heading, Text } from "../../components/ui/Typography";
import { useCart } from "../../context/CartContext";

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const [productData, categoryData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        if (active) {
          setProducts(productData);
          setCategories(categoryData);
        }
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const categoryOptions = categories.map((c) => ({ value: c.slug, label: c.name }));

  const { addItem } = useCart();

  const handleAddToCart = (product) => {
    addItem(product, undefined, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (product) => {
    // TODO: wire to a wishlist service/context
    toast.success(`${product.name} added to wishlist`);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Heading level="h1" align="center" className="mb-3">
          Shop All Products
        </Heading>
        <Text tone="muted" align="center" className="mx-auto mb-8 max-w-xl">
          Browse our full collection of skincare, makeup and fragrances.
        </Text>

        {categoryOptions.length > 0 && (
          <div className="mx-auto mb-10 max-w-xs">
            <Select
              placeholder="All Categories"
              options={categoryOptions}
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            />
          </div>
        )}

        {loading && <Loader fullScreen label="Loading products..." />}

        {!loading && error && (
          <EmptyState
            title="Couldn't load products"
            description="Something went wrong while fetching the catalog. Please try again shortly."
          />
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <EmptyState
            title="No products yet"
            description="Check back soon — new arrivals are on the way."
          />
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Shop;
