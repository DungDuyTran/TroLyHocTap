import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const LichSuThiSchema = z.object({
  diem: z.number().min(0),
  ghiChu: z.string().optional(),
  kyThiId: z.number().int().positive(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const record = await prisma.lichSuThi.findUnique({
      where: { id },
      include: {
        kyThi: true,
      },
    });

    if (!record)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data: record });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const body = await req.json();
  const parsed = LichSuThiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  try {
    const updated = await prisma.lichSuThi.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const deleted = await prisma.lichSuThi.delete({ where: { id } });
    return NextResponse.json({ data: deleted });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
