"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Field, Input, btnGhost } from "@/components/admin/ui";
import { uploadImage } from "@/app/admin/_actions/upload";

export default function ImageUploadField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    startTransition(async () => {
      const result = await uploadImage(fd);
      if ("url" in result) setUrl(result.url);
      else setError(result.error);
    });
  }

  return (
    <Field label="Image" hint="Upload a file, or paste a URL / path">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/products/…jpeg or https://…"
            required
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className={`${btnGhost} shrink-0`}
            disabled={pending}
            onClick={() => fileRef.current?.click()}
          >
            {pending ? "Uploading…" : "Upload"}
          </button>
        </div>
        {error && (
          <span className="font-mono text-[10px] tracking-[0.08em] text-red-700">{error}</span>
        )}
        {url && !error && (
          <div className="relative w-24 h-24 rounded-sm border border-line overflow-hidden bg-bg-alt">
            <Image src={url} alt="Product image preview" fill className="object-cover" sizes="96px" unoptimized />
          </div>
        )}
      </div>
    </Field>
  );
}
