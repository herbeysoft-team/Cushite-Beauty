import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  getAllCategories,
  createCategory,
  deleteCategory,
} from "../../../services/firebase/firestore";
import { slugify } from "../../../lib/slugify";
import Input from "../../../components/forms/Input";
import Button from "../../../components/ui/Button";
import { Loader, EmptyState, Modal } from "../../../components/common";
import { Heading, Text } from "../../../components/ui/Typography";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: "" } });

  const loadCategories = async () => {
    setLoading(true);
    const data = await getAllCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const onSubmit = async ({ name }) => {
    const slug = slugify(name);
    if (!slug) return;

    if (categories.some((c) => c.slug === slug)) {
      toast.error("A category with that name already exists");
      return;
    }

    setSubmitting(true);
    try {
      await createCategory(slug, { name, slug });
      toast.success(`Added "${name}"`);
      reset();
      loadCategories();
    } catch {
      toast.error("Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteCategory(pendingDelete.slug);
      toast.success(`Deleted "${pendingDelete.name}"`);
      setCategories((prev) => prev.filter((c) => c.slug !== pendingDelete.slug));
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <Heading level="h2" className="mb-1">
        Categories
      </Heading>
      <Text tone="muted" className="mb-8">
        Organize your products into categories.
      </Text>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-8 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <Input
            label="New category name"
            placeholder="Skincare"
            {...register("name", { required: true })}
          />
        </div>
        <Button type="submit" variant="primary" loading={submitting}>
          <Plus size={16} /> Add Category
        </Button>
      </form>

      {loading ? (
        <Loader label="Loading categories..." />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Add your first category above." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div>
                <p className="font-medium text-[var(--text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {category.name}
                </p>
                <p className="text-xs text-[var(--text-light)]">/{category.slug}</p>
              </div>
              <button
                onClick={() => setPendingDelete(category)}
                aria-label="Delete category"
                className="text-[var(--text-light)] hover:text-[var(--danger)]"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete category?"
      >
        <Text tone="muted">
          Products already assigned to "{pendingDelete?.name}" will keep that category value, but
          it will disappear from the Shop filter.
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

export default AdminCategories;
