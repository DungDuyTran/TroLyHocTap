import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const GhiChuSchema = z.object({
  noiDung: z.string().min(1),
  ngayTao: z.string().datetime(),
  userId: z.number().int().positive(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const filters: any = {
    ...(searchParams.get("userId") && {
      userId: Number(searchParams.get("userId")),
    }),
    ...(searchParams.get("noiDung") && {
      noiDung: {
        contains: searchParams.get("noiDung"),
        mode: "insensitive",
      },
    }),
    ...(searchParams.get("ngayTu") || searchParams.get("ngayDen")
      ? {
          ngayTao: {
            gte: searchParams.get("ngayTu")
              ? new Date(searchParams.get("ngayTu")!)
              : undefined,
            lte: searchParams.get("ngayDen")
              ? new Date(searchParams.get("ngayDen")!)
              : undefined,
          },
        }
      : {}),
  };

  try {
    const totalRecords = await prisma.ghiChu.count({ where: filters });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.ghiChu.findMany({
      where: filters,
      orderBy: { ngayTao: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(
      {
        data,
        extraInfo: { totalRecords, totalPages, page, limit },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records = Array.isArray(body) ? body : [body];

    const validated = records.map((item) => {
      const parsed = GhiChuSchema.safeParse(item);
      if (!parsed.success) throw parsed.error.format();
      return parsed.data;
    });

    const result = await prisma.ghiChu.createMany({ data: validated });

    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    await prisma.ghiChu.deleteMany();
    return NextResponse.json({ message: "Đã xóa tất cả ghi chú." });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
