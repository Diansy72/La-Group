import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // SQLite doesn't support insensitive mode, compare manually
    const allUsers = await prisma.user.findMany({
      select: { name: true },
    });
    const nameTaken = allUsers.some(
      (u: { name: string }) => u.name.toLowerCase() === name.toLowerCase()
    );

    if (nameTaken) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Failed to register user:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
