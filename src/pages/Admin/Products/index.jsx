import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { getAllProducts, deleteProduct } from "../../../services/firebase/firestore";
import { getPriceRange, isInStock } from "../../../lib/productPricing";
import { Loader, EmptyState, Modal } from "../../../components/common";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { Heading, Text } from "../../../components/ui/Typography";
import { ROUTES } from "../../../routes/routePaths";
import { formatGBP } from "../../../lib/currency";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(pendingDelete.slug);
      toast.success(`Deleted "${pendingDelete.name}"`);
      setProducts((prev) => prev.filter((p) => p.slug !== pendingDelete.slug));
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  if (loading) return <Loader fullScreen label="Loading products..." />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading level="h2">Products</Heading>
          <Text tone="muted">{products.length} product{products.length !== 1 && "s"}</Text>
        </div>
        <Link to={ROUTES.ADMIN.PRODUCT_NEW}>
          <Button variant="primary">
            <Plus size={16} /> Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Add your first product to get the store started."
          actionLabel="Add Product"
          onAction={() => (window.location.href = ROUTES.ADMIN.PRODUCT_NEW)}
        />
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="flex flex-col gap-3 md:hidden">
            {products.map((product) => {
              const { min, max } = getPriceRange(product);
              const inStock = isInStock(product);
              return (
                <div
                  key={product.id}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {product.name}
                      </p>
                      <p className="text-xs text-[var(--text-light)]">{product.category}</p>
                    </div>
                    {!inStock && <Badge variant="danger">Out of stock</Badge>}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
                    {min === max ? formatGBP(min) : `${formatGBP(min)} – ${formatGBP(max)}`}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/admin/products/${product.slug}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil size={14} /> Edit
                      </Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => setPendingDelete(product)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] md:block">
            <table className="w-full text-left text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs uppercase text-[var(--text-light)]">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const { min, max } = getPriceRange(product);
                  const inStock = isInStock(product);
                  return (
                    <tr key={product.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-5 py-3 font-medium text-[var(--text)]">{product.name}</td>
                      <td className="px-5 py-3 text-[var(--text-light)]">{product.category || "—"}</td>
                      <td className="px-5 py-3 text-[var(--text)]">
                        {min === max ? formatGBP(min) : `${formatGBP(min)} – ${formatGBP(max)}`}
                      </td>
                      <td className="px-5 py-3">
                        {inStock ? (
                          <Badge variant="success">In stock</Badge>
                        ) : (
                          <Badge variant="danger">Out of stock</Badge>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/products/${product.slug}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil size={14} />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => setPendingDelete(product)}>
                            <Trash2 size={14} className="text-[var(--danger)]" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete product?"
      >
        <Text tone="muted">
          This will permanently delete "{pendingDelete?.name}". This can't be undone.
        </Text>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setPendingDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default AdminProducts;
