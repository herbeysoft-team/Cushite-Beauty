import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

/**
 * Uploads a product image to Storage under products/{productSlug}/...
 * and resolves with its public download URL. `onProgress` is called
 * with a 0–100 number as the upload streams.
 */
export function uploadProductImage(file, productSlug, onProgress) {
  return new Promise((resolve, reject) => {
    const path = `products/${productSlug}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/** Best-effort delete — swallow errors (e.g. file already gone, external URL). */
export async function deleteProductImage(url) {
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch {
    // not a Storage URL, or already deleted — nothing to do
  }
}
