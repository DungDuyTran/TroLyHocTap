import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

// Schema để validate dữ liệu người dùng
const UserSchema = z.object({
  hoTen: z.string().min(3),
  email: z.string().email(),
  soDienThoai: z.string().min(9).max(15),
  vaiTro: z.string().min(2),
  ngaySinh: z.coerce.date(),
});

// GET: Lấy 1 người dùng theo ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng với ID này." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

// PUT: Cập nhật người dùng theo ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const result = UserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.format() }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: result.data,
    });

    return NextResponse.json({ data: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

// DELETE: Xóa người dùng theo ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ data: deletedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
