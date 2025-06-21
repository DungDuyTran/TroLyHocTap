import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TaiLieuSchema = z.object({
  tenFile: z.string().min(1),
  huongDan: z.string().min(1),
  ghiChu: z.string().min(1),
  ngayTao: z.coerce.date(),
  monHocId: z.number().int().positive(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    const data = await prisma.taiLieu.findUnique({
      where: { id },
      include: { monHoc: true },
    });

    if (!data) {
      return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
    }

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

  const parsed = TaiLieuSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  try {
    const updated = await prisma.taiLieu.update({
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
    const deleted = await prisma.taiLieu.delete({ where: { id } });
    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
