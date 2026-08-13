import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Package, Heart, Star, User } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  getOrdersByUser,
  getReviewsByUser,
  createReview,
} from "../../services/firebase/firestore";
import { Loader } from "../../components/common";
import Select from "../../components/forms/Select";
import TextArea from "../../components/forms/TextArea";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { RatingInput, ProductRating } from "../../components/product";
import { Heading, Text } from "../../components/ui/Typography";
import { formatGBP } from "../../lib/currency";

const STATUS_VARIANT = {
  pending: "warning",
  awaiting_payment: "warning",
  paid: "success",
  fulfilled: "success",
  cancelled: "danger",
};

function StatCard({ icon: Icon, label, value }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
        <Icon size={18} className="text-[var(--primary)]" />
      </div>
      <p className="text-2xl font-bold text-[var(--primary)]" style={{ fontFamily: "Playfair Display" }}>
        {value}
      </p>
      <p className="text-sm text-[var(--text-light)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {label}
      </p>
    </motion.div>
  );
}

function Profile() {
  const { user } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;

    Promise.all([getOrdersByUser(user.uid), getReviewsByUser(user.uid)]).then(
      ([orderData, reviewData]) => {
        if (!active) return;
        setOrders(orderData);
        setReviews(reviewData);
        setLoading(false);
      }
    );

    return () => {
      active = false;
    };
  }, [user]);

  // Every distinct product bought across non-cancelled orders, minus
  // ones already reviewed — these populate the "write a review" picker.
  const reviewableProducts = useMemo(() => {
    const reviewedIds = new Set(reviews.map((r) => r.productId));
    const seen = new Map();

    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((order) => {
        order.items.forEach((item) => {
          if (!reviewedIds.has(item.productId) && !seen.has(item.productId)) {
            seen.set(item.productId, item);
          }
        });
      });

    return [...seen.values()];
  }, [orders, reviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedProductId || rating === 0) {
      toast.error("Pick a product and a star rating");
      return;
    }

    const product = reviewableProducts.find((p) => p.productId === selectedProductId);
    setSubmitting(true);
    try {
      const newReview = await createReview({
        productId: product.productId,
        productSlug: product.slug,
        productName: product.name,
        userId: user.uid,
        userName: user.name || "Anonymous",
        rating,
        comment,
      });
      setReviews((prev) => [
        { id: newReview, productId: product.productId, productSlug: product.slug, productName: product.name, rating, comment, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setSelectedProductId("");
      setRating(0);
      setComment("");
      toast.success("Review submitted — thank you!");
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading your profile..." />;

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <section className="mx-auto max-w-5xl px-6 py-16">
        {/* Account header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/10">
            <User size={28} className="text-[var(--primary)]" />
          </div>
          <div>
            <Heading level="h2">{user?.name || "Your Account"}</Heading>
            <Text tone="muted" size="sm">{user?.email}</Text>
          </div>
          {user?.role === "admin" && (
            <Badge variant="primary" className="ml-auto">Admin</Badge>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <StatCard icon={Package} label="Orders Placed" value={orders.length} />
          <StatCard icon={Heart} label="Wishlist Items" value={wishlistItems.length} />
          <StatCard icon={Star} label="Reviews Written" value={reviews.length} />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent orders */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <Text className="font-semibold">Recent Orders</Text>
              <Link to="/orders" className="text-xs font-medium text-[var(--primary)]">
                View all
              </Link>
            </div>

            {orders.length === 0 ? (
              <Text tone="muted" size="sm">No orders yet.</Text>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.slice(0, 4).map((order) => (
                  <Link
                    key={order.id}
                    to={`/order-confirmation/${order.id}`}
                    className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] p-3 hover:bg-[var(--background)]"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-[var(--text-light)]">
                        {new Date(order.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Text size="sm" className="font-semibold">{formatGBP(order.total)}</Text>
                      <Badge variant={STATUS_VARIANT[order.status] || "neutral"}>{order.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Wishlist preview */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <Text className="font-semibold">Wishlist</Text>
              <Link to="/wishlist" className="text-xs font-medium text-[var(--primary)]">
                View all
              </Link>
            </div>

            {wishlistItems.length === 0 ? (
              <Text tone="muted" size="sm">Nothing saved yet.</Text>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {wishlistItems.slice(0, 6).map((item) => (
                  <Link key={item.productId} to={`/product/${item.slug}`} className="aspect-square overflow-hidden rounded-[var(--radius-sm)] bg-[var(--background)]">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-[8px] text-white">
                        {item.name}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Reviews */}
        <section className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <Text className="mb-4 font-semibold">Ratings &amp; Reviews</Text>

          {reviewableProducts.length > 0 && (
            <form onSubmit={handleSubmitReview} className="mb-6 flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--border)] p-4">
              <Text size="sm" tone="muted">Write a review for something you've bought:</Text>
              <Select
                placeholder="Choose a product"
                options={reviewableProducts.map((p) => ({ value: p.productId, label: p.name }))}
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              />
              <RatingInput value={rating} onChange={setRating} />
              <TextArea placeholder="Share your thoughts (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
              <Button type="submit" variant="primary" loading={submitting} className="self-start">
                Submit Review
              </Button>
            </form>
          )}

          {reviews.length === 0 ? (
            <Text tone="muted" size="sm">You haven't written any reviews yet.</Text>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-t border-[var(--border)] pt-4 first:border-t-0 first:pt-0">
                  <div className="flex items-center justify-between">
                    <Link to={`/product/${review.productSlug}`} className="text-sm font-semibold text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {review.productName}
                    </Link>
                    <Text size="xs" tone="muted">
                      {new Date(review.createdAt).toLocaleDateString("en-GB")}
                    </Text>
                  </div>
                  <ProductRating rating={review.rating} className="mt-1" />
                  {review.comment && (
                    <Text size="sm" tone="muted" className="mt-1">
                      {review.comment}
                    </Text>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default Profile;
