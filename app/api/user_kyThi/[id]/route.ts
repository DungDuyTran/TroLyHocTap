import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UserKyThiSchema = z.object({
  userId: z.number().int().positive(),
  kyThiId: z.number().int().positive(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; kyThiId: string } }
) {
  const userId = Number(params.userId);
  const kyThiId = Number(params.kyThiId);

  if (isNaN(userId) || isNaN(kyThiId))
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });

  try {
    const result = await prisma.user_KyThi.findUnique({
      where: {
        userId_kyThiId: { userId, kyThiId },
      },
      include: {
        user: true,
        kyThi: true,
      },
    });

    if (!result)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string; kyThiId: string } }
) {
  const userId = Number(params.userId);
  const kyThiId = Number(params.kyThiId);

  if (isNaN(userId) || isNaN(kyThiId))
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });

  const body = await req.json();
  const parsed = UserKyThiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  try {
    const updated = await prisma.user_KyThi.update({
      where: {
        userId_kyThiId: { userId, kyThiId },
      },
      data: parsed.data,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string; kyThiId: string } }
) {
  const userId = Number(params.userId);
  const kyThiId = Number(params.kyThiId);

  if (isNaN(userId) || isNaN(kyThiId))
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });

  try {
    const deleted = await prisma.user_KyThi.delete({
      where: {
        userId_kyThiId: { userId, kyThiId },
      },
    });

    return NextResponse.json({ data: deleted });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
