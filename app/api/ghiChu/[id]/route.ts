import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const GhiChuSchema = z.object({
  noiDung: z.string().min(1),
  ngayTao: z.string().datetime(),
  userId: z.number().int().positive(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  try {
    const data = await prisma.ghiChu.findUnique({ where: { id } });
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
  const parsed = GhiChuSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  try {
    const updated = await prisma.ghiChu.update({
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
    const deleted = await prisma.ghiChu.delete({ where: { id } });
    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
