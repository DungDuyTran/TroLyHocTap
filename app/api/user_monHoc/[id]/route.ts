import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const Schema = z.object({
  userId: z.coerce.number().int().positive(),
  monHocId: z.coerce.number().int().positive(),
});

function parseCompoundId(param: string) {
  const [userIdStr, monHocIdStr] = param.split("_");
  const parsed = Schema.safeParse({
    userId: userIdStr,
    monHocId: monHocIdStr,
  });

  if (!parsed.success) return null;
  return parsed.data;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userId_monHocId: string } }
) {
  const ids = parseCompoundId(params.userId_monHocId);
  if (!ids)
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

  try {
    const record = await prisma.user_MonHoc.findUnique({
      where: {
        userId_monHocId: {
          userId: ids.userId,
          monHocId: ids.monHocId,
        },
      },
    });

    if (!record)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId_monHocId: string } }
) {
  const ids = parseCompoundId(params.userId_monHocId);
  if (!ids)
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

  const payload = await req.json();
  const result = Schema.safeParse(payload);
  if (!result.success)
    return NextResponse.json({ error: result.error.format() }, { status: 400 });

  try {
    const updated = await prisma.user_MonHoc.update({
      where: {
        userId_monHocId: {
          userId: ids.userId,
          monHocId: ids.monHocId,
        },
      },
      data: {
        userId: result.data.userId,
        monHocId: result.data.monHocId,
      },
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId_monHocId: string } }
) {
  const ids = parseCompoundId(params.userId_monHocId);
  if (!ids)
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

  try {
    const deleted = await prisma.user_MonHoc.delete({
      where: {
        userId_monHocId: {
          userId: ids.userId,
          monHocId: ids.monHocId,
        },
      },
    });

    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
