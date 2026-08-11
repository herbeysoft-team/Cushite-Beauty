import { useRef, useState } from "react";
import { ImagePlus, X, Loader2, Star } from "lucide-react";
import toast from "react-hot-toast";
import { uploadImage } from "../../../services/cloudinary/upload";
import { cn } from "../../../lib/cn";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * GalleryUpload — multiple product photos. The first image in the
 * list is the featured/thumbnail image (shown on ProductCard and as
 * the default detail-page image); click the star on any other image
 * to promote it to first place.
 */
function GalleryUpload({ images = [], onChange, pathPrefix, label = "Product Images" }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image must be under 5MB");
      return;
    }

    setProgress(0);
    try {
      const { url } = await uploadImage(file, `cushite-beauty/products/${pathPrefix}`, setProgress);
      onChange([...images, url]);
      toast.success("Image uploaded");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const makeFeatured = (index) => {
    if (index === 0) return;
    const reordered = [...images];
    const [chosen] = reordered.splice(index, 1);
    reordered.unshift(chosen);
    onChange(reordered);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="text-sm font-medium text-[var(--text)]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {label}
      </span>
      <p className="text-xs text-[var(--text-light)]" style={{ fontFamily: "'Poppins', sans-serif" }}>
        The first image is the product thumbnail. Click the star on another image to make it featured.
      </p>

      <div className="mt-1 flex flex-wrap gap-3">
        {images.map((url, index) => (
          <div key={url} className="relative h-32 w-32">
            <img
              src={url}
              alt={`Product ${index + 1}`}
              className={cn(
                "h-32 w-32 rounded-[var(--radius-md)] border object-cover",
                index === 0 ? "border-[var(--primary)] border-2" : "border-[var(--border)]"
              )}
            />
            {index === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-[var(--primary)] px-2 py-0.5 text-[10px] font-semibold text-white">
                Featured
              </span>
            )}
            <button
              type="button"
              onClick={() => removeImage(index)}
              aria-label="Remove image"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--danger)] text-white"
            >
              <X size={14} />
            </button>
            {index !== 0 && (
              <button
                type="button"
                onClick={() => makeFeatured(index)}
                aria-label="Set as featured image"
                title="Set as featured"
                className="absolute -left-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--secondary)] shadow"
              >
                <Star size={13} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={progress !== null}
          className={cn(
            "flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] text-[var(--text-light)] transition-colors",
            progress === null && "hover:border-[var(--primary)] hover:text-[var(--primary)]"
          )}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {progress !== null ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span className="text-xs">{Math.round(progress)}%</span>
            </>
          ) : (
            <>
              <ImagePlus size={20} />
              <span className="text-xs">Add Image</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

export default GalleryUpload;
