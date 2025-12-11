import { API_URL } from "@/config/api";

/**
 * Opens a file picker and uploads the selected image to your backend upload route.
 * Works locally and on Render automatically because it uses API_URL.
 */
export async function uploadImage(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          console.error("Upload failed:", await res.text());
          return resolve(null);
        }

        const data = await res.json();
        resolve(data.url); // uploaded image URL from backend
      } catch (err) {
        console.error("Image upload error:", err);
        resolve(null);
      }
    };

    input.click();
  });
}
