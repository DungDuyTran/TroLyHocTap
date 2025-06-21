import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const NhacNhoSchema = z.object({
  tieuDe: z.string().min(1),
  noiDung: z.string().min(1),
  thoiGianNhac: z.string().datetime(),
  trangThai: z.boolean(),
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
    ...(searchParams.get("trangThai") && {
      trangThai: searchParams.get("trangThai") === "true",
    }),
  };

  try {
    const totalRecords = await prisma.nhacNhoHocTap.count({
      where: whereFilter,
    });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.nhacNhoHocTap.findMany({
      where: whereFilter,
      orderBy: { thoiGianNhac: "asc" },
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
      const parsed = NhacNhoSchema.safeParse(item);
      if (!parsed.success) throw parsed.error.format();
      return parsed.data;
    });

    const created = await prisma.nhacNhoHocTap.createMany({
      data: validated,
    });

    return NextResponse.json({ created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    await prisma.nhacNhoHocTap.deleteMany();
    return NextResponse.json({ message: "Đã xóa tất cả nhắc nhở." });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
