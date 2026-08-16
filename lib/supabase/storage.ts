import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gwdonfwwedbrstsivjeb.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only initialize the full supabase admin client on the server side
// where the secret service role key is available.
const supabase = typeof window === "undefined" && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

/**
 * Converts a relative path into a public absolute URL.
 * Safe to run on both client and server.
 * If the path is already a full URL or starts with `/uploads`, it returns it as is.
 */
export function getPublicUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:") ||
    path.startsWith("/")
  ) {
    return path;
  }
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
}

/**
 * Uploads a file to Supabase Storage and returns the relative path.
 * Runs on server-side only.
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase client is not initialized on the server. Check SUPABASE_SERVICE_ROLE_KEY.");
  }

  // Generate a unique filename using built-in Web Crypto API
  const uuid = crypto.randomUUID();
  const fileExt = file.name.split(".").pop();
  const filename = `${uuid}.${fileExt}`;
  const relativePath = `${folder}/${filename}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from("media")
    .upload(relativePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  return relativePath;
}

/**
 * Deletes a file from Supabase Storage by its relative path.
 * Runs on server-side only.
 */
export async function deleteFile(path: string | null | undefined): Promise<void> {
  if (!supabase || !path) return;
  // If it's a legacy URL or local path, don't attempt to delete from storage
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("/")
  ) {
    return;
  }

  const { error } = await supabase.storage.from("media").remove([path]);
  if (error) {
    console.error(`Failed to delete file from Supabase Storage: ${path}`, error);
  }
}

/**
 * Uploads a new file and, if successful, deletes the old file.
 * Returns the new relative path.
 * Runs on server-side only.
 */
export async function replaceFile(
  file: File,
  oldPath: string | null | undefined,
  folder: string
): Promise<string> {
  const newPath = await uploadFile(file, folder);
  if (oldPath) {
    try {
      await deleteFile(oldPath);
    } catch (e) {
      console.error("Error deleting old file during replacement:", e);
    }
  }
  return newPath;
}
