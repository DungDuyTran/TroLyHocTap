import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const KyThiMonHocSchema = z.object({
  kyThiId: z.number(),
  monHocId: z.number(),
});

function parseCompositeId(id: string) {
  const [kyThiIdStr, monHocIdStr] = id.split("_");
  const kyThiId = Number(kyThiIdStr);
  const monHocId = Number(monHocIdStr);
  if (isNaN(kyThiId) || isNaN(monHocId)) return null;
  return { kyThiId, monHocId };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ids = parseCompositeId(params.id);
  if (!ids)
    return NextResponse.json(
      { error: "Invalid composite ID" },
      { status: 400 }
    );

  try {
    const record = await prisma.kyThi_MonHoc.findUnique({
      where: {
        kyThiId_monHocId: ids,
      },
      include: {
        kyThi: true,
        monHoc: true,
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
  const ids = parseCompositeId(params.id);
  if (!ids)
    return NextResponse.json(
      { error: "Invalid composite ID" },
      { status: 400 }
    );

  const body = await req.json();
  const parsed = KyThiMonHocSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  try {
    const updated = await prisma.kyThi_MonHoc.update({
      where: {
        kyThiId_monHocId: ids,
      },
      data: body,
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
  const ids = parseCompositeId(params.id);
  if (!ids)
    return NextResponse.json(
      { error: "Invalid composite ID" },
      { status: 400 }
    );

  try {
    const deleted = await prisma.kyThi_MonHoc.delete({
      where: {
        kyThiId_monHocId: ids,
      },
    });

    return NextResponse.json({ data: deleted });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
