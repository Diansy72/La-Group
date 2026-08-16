import { NextResponse } from "next/server";
import { uploadFile, replaceFile, getPublicUrl } from "@/lib/supabase/storage";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("path") || "media";
    const replacePath = searchParams.get("replacePath");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    const isImage = IMAGE_TYPES.includes(file.type) || file.type.startsWith("image/");
    const isVideo = VIDEO_TYPES.includes(file.type) || file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported file type. Use JPG, JPEG, PNG, WEBP, MP4, MOV, or WEBM.",
        },
        { status: 400 }
      );
    }

    // Double check extensions/mime types if needed
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const allowedImageExts = ["jpg", "jpeg", "png", "webp"];
    const allowedVideoExts = ["mp4", "mov", "webm"];

    if (isImage && fileExt && !allowedImageExts.includes(fileExt)) {
      return NextResponse.json(
        { success: false, message: "Invalid image format. Allowed: JPG, JPEG, PNG, WEBP." },
        { status: 400 }
      );
    }

    if (isVideo && fileExt && !allowedVideoExts.includes(fileExt)) {
      return NextResponse.json(
        { success: false, message: "Invalid video format. Allowed: MP4, MOV, WEBM." },
        { status: 400 }
      );
    }

    // File size validation
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      const maxMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        {
          success: false,
          message: `File too large. Maximum size allowed is ${maxMB}MB.`,
        },
        { status: 400 }
      );
    }

    let relativePath: string;

    if (replacePath && replacePath.trim() !== "") {
      relativePath = await replaceFile(file, replacePath, folder);
    } else {
      relativePath = await uploadFile(file, folder);
    }

    return NextResponse.json({
      success: true,
      url: relativePath, // returning relative path as url so the client forms store it
      path: relativePath,
      publicUrl: getPublicUrl(relativePath), // provide absolute public url if components need it
      type: isVideo ? "video" : "image",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal Server Error during upload",
      },
      { status: 500 }
    );
  }
}
