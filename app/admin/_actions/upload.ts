"use server";

import { put } from "@vercel/blob";

export type UploadResult = { url: string } | { error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  // The SDK accepts either a read-write token or OIDC auth (BLOB_STORE_ID +
  // VERCEL_OIDC_TOKEN, both auto-injected on Vercel).
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return { error: "Blob storage not configured — paste an image URL instead." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed." };
  }
  // Vercel server actions cap the request body at 4.5 MB.
  if (file.size > 4 * 1024 * 1024) {
    return { error: "Image must be under 4 MB." };
  }

  const blob = await put(`products/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return { url: blob.url };
}
