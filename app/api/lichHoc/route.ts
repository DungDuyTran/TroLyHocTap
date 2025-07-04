import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validate cho mỗi lịch học
const LichHocSchema = z.object({
  tieuDe: z.string().min(1),
  batDau: z.coerce.date(),
  ketThuc: z.coerce.date(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  const where = {
    ...(searchParams.get("tieuDe") && {
      tieuDe: { contains: searchParams.get("tieuDe") || "" },
    }),
  };

  try {
    const totalRecords = await prisma.lichHoc.count({ where });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.lichHoc.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { batDau: "asc" },
      include: {
        lichHocMonHoc: { include: { monHoc: true } }, // nếu cần liên kết với MonHoc
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

  // Xác định xem là object hay array
  const isArray = Array.isArray(body);
  const schema = isArray ? z.array(LichHocSchema) : LichHocSchema;
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  try {
    const data = parsed.data;
    const created = isArray
      ? await prisma.lichHoc.createMany({ data })
      : await prisma.lichHoc.create({ data });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    await prisma.lichHoc.deleteMany();
    return NextResponse.json({ message: "Đã xóa tất cả lịch học." });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
