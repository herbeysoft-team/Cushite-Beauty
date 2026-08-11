import { useEffect, useState } from "react";
import { Package, Tags, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getAllProducts,
  getAllCategories,
  getAllUsers,
} from "../../../services/firebase/firestore";
import { Loader } from "../../../components/common";
import { Heading, Text } from "../../../components/ui/Typography";
import { ROUTES } from "../../../routes/routePaths";
import { isInStock } from "../../../lib/productPricing";

function StatCard({ icon: Icon, label, value, to }) {
  const content = (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
        <Icon size={18} className="text-[var(--primary)]" />
      </div>
      <p className="text-2xl font-bold text-[var(--primary)]" style={{ fontFamily: "Playfair Display" }}>
        {value}
      </p>
      <p className="text-sm text-[var(--text-light)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {label}
      </p>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      const [products, categories, users] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getAllUsers(),
      ]);

      if (!active) return;

      setStats({
        productCount: products.length,
        outOfStockCount: products.filter((p) => !isInStock(p)).length,
        categoryCount: categories.length,
        userCount: users.length,
      });
      setLoading(false);
    }

    loadStats();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Loader fullScreen label="Loading dashboard..." />;

  return (
    <div>
      <Heading level="h2" className="mb-1">
        Dashboard
      </Heading>
      <Text tone="muted" className="mb-8">
        Overview of your store.
      </Text>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.productCount}
          to={ROUTES.ADMIN.PRODUCTS}
        />
        <StatCard
          icon={TrendingUp}
          label="Out of Stock"
          value={stats.outOfStockCount}
          to={ROUTES.ADMIN.PRODUCTS}
        />
        <StatCard
          icon={Tags}
          label="Categories"
          value={stats.categoryCount}
          to={ROUTES.ADMIN.CATEGORIES}
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={stats.userCount}
          to={ROUTES.ADMIN.CUSTOMERS}
        />
      </div>
    </div>
  );
}

export default Dashboard;
