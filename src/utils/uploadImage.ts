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
        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        resolve(data.url); // return uploaded URL
      } catch (err) {
        console.error("Image upload error:", err);
        resolve(null);
      }
    };

    input.click();
  });
}
