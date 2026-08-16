import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const touristSchema = z.object({
  nationality: z.string().min(2, "Nationality is required"),
  continent: z.enum(["Asia", "Europe", "Americas", "Africa", "Australia"]),
  packageTaken: z.string().min(2, "Package name is required"),
  photoUrl: z.string().nullish().or(z.literal("")),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const take = parseInt(searchParams.get("limit") || "50", 10);

    const tourists = await prisma.tourist.findMany({
      orderBy: { createdAt: "desc" },
      take: take,
    });
    return NextResponse.json(tourists);
  } catch (error) {
    console.error("Failed to fetch tourists:", error);
    return NextResponse.json({ error: "Failed to fetch tourists" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    
    // Zod Validation
    const result = touristSchema.safeParse(rawBody);
    if (!result.success) {
      console.error("Tourist Validation Failed:", result.error.issues);
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }
    
    const data = result.data;

    const tourist = await prisma.tourist.create({
      data: {
        nationality: data.nationality,
        continent: data.continent,
        packageTaken: data.packageTaken,
        photoUrl: data.photoUrl || null,
      },
    });
    return NextResponse.json(tourist, { status: 201 });
  } catch (error) {
    console.error("Failed to create tourist:", error);
    return NextResponse.json({ error: "Failed to create tourist" }, { status: 500 });
  }
}
