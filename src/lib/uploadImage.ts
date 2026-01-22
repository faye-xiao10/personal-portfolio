// src/lib/uploadImage.ts
import { supabase } from "@/lib/supabase";

export async function uploadNodeImage(opts: {
  file: File;
  nodeSlug: string; // e.g. career/product-builder/skilt
}) {
  const { file, nodeSlug } = opts;
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${nodeSlug}/${Date.now()}-${safeName}`;

  const { error: uploadErr } = await supabase.storage
    .from("node-assets")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || `image/${ext}`,
    });

  if (uploadErr) throw uploadErr;

  const { data } = supabase.storage.from("node-assets").getPublicUrl(path);
  return data.publicUrl;
}
