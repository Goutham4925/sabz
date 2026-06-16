import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer: Buffer, folder: string): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: randomUUID(), resource_type: "image" },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result as { secure_url: string; public_id: string });
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, "saabz_gallery");
    return NextResponse.json({ url: result.secure_url, relative: result.secure_url, filename: result.public_id });
  } catch (err) {
    console.error("GALLERY UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Gallery upload failed" }, { status: 500 });
  }
}
