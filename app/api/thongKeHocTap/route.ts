import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const ThongKeSchema = z.object({
  ngay: z.string().datetime(),
  soGioHoc: z.number().positive(),
  ghiChu: z.string().nullable().optional(),
  userId: z.number().int().positive(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 10;
  const page = Number(searchParams.get("page")) || 1;

  const whereFilter: any = {
    ...(searchParams.get("userId") && {
      userId: Number(searchParams.get("userId")),
    }),
    ...(searchParams.get("fromDate") || searchParams.get("toDate")
      ? {
          ngay: {
            ...(searchParams.get("fromDate") && {
              gte: new Date(searchParams.get("fromDate")!),
            }),
            ...(searchParams.get("toDate") && {
              lte: new Date(searchParams.get("toDate")!),
            }),
          },
        }
      : {}),
  };

  try {
    const totalRecords = await prisma.thongKeHocTap.count({
      where: whereFilter,
    });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.thongKeHocTap.findMany({
      where: whereFilter,
      orderBy: { ngay: "desc" },
      skip: (page - 1) * limit,
      take: limit,
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
  try {
    const json = await req.json();
    const data = Array.isArray(json) ? json : [json];

    const validated = data.map((item, index) => {
      const parsed = ThongKeSchema.safeParse(item);
      if (!parsed.success) throw parsed.error.format();
      return parsed.data;
    });

    const created = await prisma.thongKeHocTap.createMany({
      data: validated,
    });

    return NextResponse.json({ created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    await prisma.thongKeHocTap.deleteMany();
    return NextResponse.json({ message: "Đã xóa tất cả thống kê." });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
