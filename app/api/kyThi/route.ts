import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const KyThiSchema = z.object({
  tenKyThi: z.string().min(1),
  ghiChu: z.string().min(1).optional(),
  thoiGianThi: z.coerce.date(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  const where = {
    ...(searchParams.get("tenKyThi") && {
      tenKyThi: {
        contains: searchParams.get("tenKyThi") || "",
        mode: "insensitive",
      },
    }),
  };

  try {
    const totalRecords = await prisma.kyThi.count({ where });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.kyThi.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
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
  const payloads = Array.isArray(body) ? body : [body];

  for (const item of payloads) {
    const parsed = KyThiSchema.safeParse(item);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }
  }

  try {
    const created = await prisma.$transaction(
      payloads.map((data) => prisma.kyThi.create({ data }))
    );

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
