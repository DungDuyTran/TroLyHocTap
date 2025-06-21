import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UserKyThiSchema = z.object({
  userId: z.number().int().positive(),
  kyThiId: z.number().int().positive(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  const where = {
    ...(searchParams.get("userId") && {
      userId: Number(searchParams.get("userId")),
    }),
    ...(searchParams.get("kyThiId") && {
      kyThiId: Number(searchParams.get("kyThiId")),
    }),
  };

  try {
    const totalRecords = await prisma.user_KyThi.count({ where });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.user_KyThi.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        kyThi: true,
      },
    });

    return NextResponse.json(
      { data, extraInfo: { totalRecords, totalPages, page, limit } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const items = Array.isArray(body) ? body : [body];

  for (const item of items) {
    const parsed = UserKyThiSchema.safeParse(item);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }
  }

  try {
    const created = await prisma.$transaction(
      items.map((item) => prisma.user_KyThi.create({ data: item }))
    );
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
