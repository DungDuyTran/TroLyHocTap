import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const LichHocMonHocSchema = z.object({
  lichHocId: z.number(),
  monHocId: z.number(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  const where = {
    ...(searchParams.get("lichHocId") && {
      lichHocId: Number(searchParams.get("lichHocId")),
    }),
    ...(searchParams.get("monHocId") && {
      monHocId: Number(searchParams.get("monHocId")),
    }),
  };

  try {
    const totalRecords = await prisma.lichHoc_MonHoc.count({ where });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.lichHoc_MonHoc.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        lichHoc: true,
        monHoc: true,
      },
    });

    // Trả ra mảng event để client dễ xử lý
    const result = data.map((item) => ({
      id: `lhmh-${item.lichHocId}-${item.monHocId}`,
      title: item.monHoc.tenMon,
      start: item.lichHoc.batDau.toISOString(),
      end: item.lichHoc.ketThuc.toISOString(),
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Lỗi GET /api/lichHoc_monHoc:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    for (const item of items) {
      const parsed = LichHocMonHocSchema.safeParse(item);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.format() },
          { status: 400 }
        );
      }
    }

    const created = await prisma.$transaction(
      items.map((item) =>
        prisma.lichHoc_MonHoc.create({
          data: item,
        })
      )
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("❌ Lỗi POST /api/lichHoc_monHoc:", error);
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
