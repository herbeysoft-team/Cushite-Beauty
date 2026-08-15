import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { uploadImage } from "../../../services/cloudinary/upload";
import { cn } from "../../../lib/cn";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * ImageUpload — click-to-select image tile with a live upload
 * progress ring and preview once done. Uploads to Cloudinary (no
 * billing plan required). `pathPrefix` scopes the Cloudinary folder
 * (e.g. the product's slug, or a temp id for a not-yet-saved product).
 */
function ImageUpload({ value, onChange, pathPrefix, label = "Product Image" }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null); // null = idle, 0–100 while uploading

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
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
      const { url } = await uploadImage(file, `products/${pathPrefix}`, setProgress);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  };

  const handleRemove = () => {
    // Deleting from Cloudinary requires a signed request (i.e. a
    // backend), so we just drop the reference here — the file stays
    // in your Cloudinary media library, harmless but not auto-cleaned.
    onChange("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="text-sm font-medium text-[var(--text)]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {label}
      </span>

      {value ? (
        <div className="relative w-40">
          <img
            src={value}
            alt="Product preview"
            className="h-40 w-40 rounded-[var(--radius-md)] border border-[var(--border)] object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--danger)] text-white"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={progress !== null}
          className={cn(
            "flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] text-[var(--text-light)] transition-colors",
            progress === null && "hover:border-[var(--primary)] hover:text-[var(--primary)]"
          )}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {progress !== null ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span className="text-xs">{Math.round(progress)}%</span>
            </>
          ) : (
            <>
              <ImagePlus size={22} />
              <span className="text-xs">Upload Image</span>
            </>
          )}
        </button>
      )}

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

export default ImageUpload;
