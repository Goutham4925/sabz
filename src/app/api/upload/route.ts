import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer: Buffer, folder = "saabz_kitchen"): Promise<{ secure_url: string; public_id: string }> {
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

function extractPublicId(url: string) {
  try {
    const parts = url.split("/");
    const filename = parts.pop()!;
    const folder = parts.pop()!;
    return `${folder}/${filename.split(".")[0]}`;
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer);

    const oldImage = formData.get("oldImage") as string | null;
    if (oldImage) {
      const publicId = extractPublicId(oldImage);
      if (publicId) cloudinary.uploader.destroy(publicId).catch(console.error);
    }

    return NextResponse.json({ url: result.secure_url, relative: result.secure_url, filename: result.public_id });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("filename");
    if (!publicId) return NextResponse.json({ error: "filename missing" }, { status: 400 });
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "not found") return NextResponse.json({ error: "File not found" }, { status: 404 });
    return NextResponse.json({ success: true, deleted: publicId });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
