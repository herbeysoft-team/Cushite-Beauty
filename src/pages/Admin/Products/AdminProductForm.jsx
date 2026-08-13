import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  getProductBySlug,
  createProduct,
  updateProduct,
  getAllCategories,
} from "../../../services/firebase/firestore";
import { slugify } from "../../../lib/slugify";
import { generateVariantCombinations } from "../../../lib/productPricing";
import Input from "../../../components/forms/Input";
import TextArea from "../../../components/forms/TextArea";
import Select from "../../../components/forms/Select";
import Checkbox from "../../../components/forms/Checkbox";
import ImageUpload from "../../../components/forms/ImageUpload";
import GalleryUpload from "../../../components/forms/GalleryUpload";
import Button from "../../../components/ui/Button";
import { Loader } from "../../../components/common";
import { Heading, Text } from "../../../components/ui/Typography";
import AttributeEditor from "./AttributeEditor";

const emptyAttribute = { name: "", type: "button", options: [] };

function AdminProductForm() {
  const { slug: editingSlug } = useParams();
  const isEditMode = Boolean(editingSlug);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      category: "",
      price: "",
      compareAtPrice: "",
      stock: "",
      images: [],
      isNew: false,
      attributes: [],
      variants: [],
      shippingEdinburgh: "",
      shippingUk: "",
      shippingAfrica: "",
    },
  });

  const attributeArray = useFieldArray({ control, name: "attributes" });
  const variantArray = useFieldArray({ control, name: "variants" });

  const nameValue = watch("name");
  const slugValue = watch("slug");
  const images = watch("images");
  const attributesValue = watch("attributes");
  const hasAttributes = attributesValue.some((a) => a.name && a.options?.length > 0);

  // A new product doesn't have a slug until the name is typed, but
  // images can be uploaded before that — fall back to a stable random
  // id for the upload path so early uploads don't collide.
  const tempIdRef = useRef(crypto.randomUUID());
  const imagePathPrefix = isEditMode ? editingSlug : slugValue || tempIdRef.current;

  useEffect(() => {
    if (!isEditMode) {
      setValue("slug", slugify(nameValue || ""));
    }
  }, [nameValue, isEditMode, setValue]);

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    let active = true;
    async function loadProduct() {
      const product = await getProductBySlug(editingSlug);
      if (!active || !product) return;

      reset({
        name: product.name || "",
        slug: product.slug || "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        category: product.category || "",
        price: product.price ?? "",
        compareAtPrice: product.compareAtPrice ?? "",
        stock: product.stock ?? "",
        images: product.images || (product.image ? [product.image] : []),
        isNew: Boolean(product.isNew),
        attributes: product.attributes || [],
        variants: (product.variants || []).map((v) => ({
          options: v.options || {},
          price: v.price ?? "",
          compareAtPrice: v.compareAtPrice ?? "",
          stock: v.stock ?? "",
          image: v.image || "",
        })),
        shippingEdinburgh: product.shipping?.edinburgh ?? "",
        shippingUk: product.shipping?.uk ?? "",
        shippingAfrica: product.shipping?.africa ?? "",
      });
      setLoading(false);
    }

    loadProduct();
    return () => {
      active = false;
    };
  }, [editingSlug, isEditMode, reset]);

  /** Regenerates the variant list from current attributes, keeping any
   * price/stock/image already entered for combinations that still exist. */
  const handleGenerateVariants = () => {
    const combos = generateVariantCombinations(attributesValue);
    if (combos.length === 0) {
      toast.error("Add at least one attribute with options first");
      return;
    }

    const existing = watch("variants");
    const sameOptions = (a, b) =>
      Object.keys(a).length === Object.keys(b).length &&
      Object.entries(a).every(([k, v]) => b[k] === v);

    const merged = combos.map((options) => {
      const match = existing.find((v) => sameOptions(v.options || {}, options));
      return {
        options,
        price: match?.price ?? "",
        compareAtPrice: match?.compareAtPrice ?? "",
        stock: match?.stock ?? "",
        image: match?.image ?? "",
      };
    });

    variantArray.replace(merged);
    toast.success(`Generated ${merged.length} variant${merged.length !== 1 ? "s" : ""}`);
  };

  const onSubmit = async (data) => {
    if (hasAttributes && data.variants.length === 0) {
      toast.error("Click \"Generate Variations\" before saving");
      return;
    }

    setSubmitting(true);
    try {
      const attributes = data.attributes
        .filter((a) => a.name && a.options?.length > 0)
        .map((a) => ({
          name: a.name,
          type: a.type,
          options: a.options.map((o) => ({
            label: o.label,
            value: o.value || slugify(o.label),
            ...(a.type === "color" ? { swatch: o.swatch } : {}),
          })),
        }));

      const variants = attributes.length
        ? data.variants.map((v) => ({
            options: v.options,
            price: Number(v.price),
            compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
            stock: v.stock !== "" ? Number(v.stock) : 0,
            image: v.image || undefined,
          }))
        : [];

      const payload = {
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        images: data.images,
        price: Number(data.price),
        compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
        stock: data.stock !== "" ? Number(data.stock) : undefined,
        isNew: data.isNew,
        attributes,
        variants,
        shipping: {
          edinburgh: data.shippingEdinburgh ? Number(data.shippingEdinburgh) : 0,
          uk: data.shippingUk ? Number(data.shippingUk) : 0,
          africa: data.shippingAfrica ? Number(data.shippingAfrica) : 0,
        },
      };

      if (isEditMode) {
        await updateProduct(editingSlug, payload);
        toast.success("Product updated");
      } else {
        await createProduct(data.slug, payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong saving the product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading product..." />;

  const categoryOptions = categories.map((c) => ({ value: c.slug, label: c.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/admin/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--text-light)]"
      >
        <ArrowLeft size={14} /> Back to Products
      </Link>

      <Heading level="h2" className="mb-8">
        {isEditMode ? "Edit Product" : "Add Product"}
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* Basic info */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <Text className="mb-4 font-semibold">Basic Info</Text>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Product Name"
              placeholder="Rose Glow Serum"
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
            <Input
              label="Slug"
              placeholder="rose-glow-serum"
              disabled={isEditMode}
              error={errors.slug?.message}
              {...register("slug", { required: "Slug is required" })}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Short Description"
              placeholder="A lightweight vitamin C serum that brightens skin."
              {...register("shortDescription")}
            />
          </div>

          <div className="mt-4">
            <TextArea
              label="Full Description"
              placeholder="Details, ingredients, how to use..."
              {...register("description")}
            />
          </div>

          <div className="mt-4">
            <Select
              label="Category"
              placeholder="Select a category"
              options={categoryOptions}
              error={errors.category?.message}
              {...register("category", { required: "Category is required" })}
            />
          </div>

          <div className="mt-4">
            <Checkbox label="Mark as New Arrival" {...register("isNew")} />
          </div>
        </section>

        {/* Images */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <GalleryUpload
            images={images}
            onChange={(next) => setValue("images", next, { shouldDirty: true })}
            pathPrefix={imagePathPrefix}
          />
        </section>

        {/* Default pricing */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <Text className="mb-1 font-semibold">Default Pricing</Text>
          <Text tone="muted" size="sm" className="mb-4">
            Used automatically if this product has no variations below.
          </Text>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Price (£)"
              type="number"
              step="0.01"
              placeholder="25.00"
              error={errors.price?.message}
              {...register("price", { required: "Price is required" })}
            />
            <Input
              label="Compare At (£)"
              type="number"
              step="0.01"
              placeholder="35.00"
              {...register("compareAtPrice")}
            />
            <Input label="Stock" type="number" placeholder="20" {...register("stock")} />
          </div>
        </section>

        {/* Attributes */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Text className="font-semibold">Attributes</Text>
              <Text tone="muted" size="sm">
                e.g. Color, Size — used to build variations.
              </Text>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => attributeArray.append(emptyAttribute)}
            >
              <Plus size={14} /> Add Attribute
            </Button>
          </div>

          {attributeArray.fields.length > 0 && (
            <div className="flex flex-col gap-4">
              {attributeArray.fields.map((field, index) => (
                <AttributeEditor
                  key={field.id}
                  control={control}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  attrIndex={index}
                  onRemove={() => attributeArray.remove(index)}
                />
              ))}
            </div>
          )}

          {hasAttributes && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleGenerateVariants}
            >
              <Wand2 size={14} /> Generate Variations
            </Button>
          )}
        </section>

        {/* Variants */}
        {variantArray.fields.length > 0 && (
          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <Text className="mb-4 font-semibold">
              Variations ({variantArray.fields.length})
            </Text>

            <div className="flex flex-col gap-4">
              {variantArray.fields.map((field, index) => {
                const options = watch(`variants.${index}.options`) || {};
                const variantImage = watch(`variants.${index}.image`);

                return (
                  <div
                    key={field.id}
                    className="rounded-[var(--radius-md)] border border-[var(--border)] p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(options).map(([k, v]) => (
                          <span
                            key={k}
                            className="rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--primary)]"
                          >
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => variantArray.remove(index)}
                        aria-label="Remove variant"
                        className="text-[var(--text-light)] hover:text-[var(--danger)]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input
                        label="Price (£)"
                        type="number"
                        step="0.01"
                        placeholder="25.00"
                        {...register(`variants.${index}.price`, { required: true })}
                      />
                      <Input
                        label="Compare At (£)"
                        type="number"
                        step="0.01"
                        placeholder="35.00"
                        {...register(`variants.${index}.compareAtPrice`)}
                      />
                      <Input
                        label="Stock"
                        type="number"
                        placeholder="10"
                        {...register(`variants.${index}.stock`)}
                      />
                    </div>

                    <div className="mt-3">
                      <ImageUpload
                        label="Variant Image (optional)"
                        value={variantImage}
                        onChange={(url) =>
                          setValue(`variants.${index}.image`, url, { shouldDirty: true })
                        }
                        pathPrefix={`${imagePathPrefix}-variant-${index}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Shipping */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <Text className="mb-4 font-semibold">Shipping Cost by Location (£)</Text>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Edinburgh" type="number" step="0.01" placeholder="3.50" {...register("shippingEdinburgh")} />
            <Input label="Rest of UK" type="number" step="0.01" placeholder="6.00" {...register("shippingUk")} />
            <Input label="Africa" type="number" step="0.01" placeholder="15.00" {...register("shippingAfrica")} />
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Link to="/admin/products">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" loading={submitting}>
            {isEditMode ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
