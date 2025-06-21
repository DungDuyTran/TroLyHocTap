import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const ThongKeSchema = z.object({
  ngay: z.string().datetime(),
  soGioHoc: z.number().positive(),
  ghiChu: z.string().nullable().optional(),
  userId: z.number().int().positive(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  try {
    const data = await prisma.thongKeHocTap.findUnique({ where: { id } });
    if (!data)
      return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();
  const parsed = ThongKeSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  try {
    const updated = await prisma.thongKeHocTap.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  try {
    const deleted = await prisma.thongKeHocTap.delete({ where: { id } });
    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
