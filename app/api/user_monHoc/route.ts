import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const Schema = z.object({
  userId: z.number().int().positive(),
  monHocId: z.number().int().positive(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  const filter = {
    ...(searchParams.get("userId") && {
      userId: Number(searchParams.get("userId")),
    }),
    ...(searchParams.get("monHocId") && {
      monHocId: Number(searchParams.get("monHocId")),
    }),
  };

  try {
    const totalRecords = await prisma.user_MonHoc.count({ where: filter });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.user_MonHoc.findMany({
      where: filter,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        monHoc: true,
      },
    });

    return NextResponse.json(
      {
        data,
        extraInfo: {
          totalRecords,
          totalPages,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const payload = await req.json();

  const records = Array.isArray(payload) ? payload : [payload];

  for (const item of records) {
    const result = Schema.safeParse(item);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 }
      );
    }
  }

  try {
    const created = await prisma.$transaction(
      records.map((item) =>
        prisma.user_MonHoc.create({
          data: {
            userId: item.userId,
            monHocId: item.monHocId,
          },
        })
      )
    );

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
