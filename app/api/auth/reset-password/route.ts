import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password, locale = "id" } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: locale === "en" ? "Missing required fields" : "Token dan password harus diisi" },
        { status: 400 }
      );
    }

    // Find user with valid token and not expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            locale === "en"
              ? "Reset token is invalid or has expired"
              : "Token reset password tidak valid atau sudah kedaluwarsa",
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear token fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: `Reset password error: ${error?.message || error}` }, { status: 500 });
  }
}
