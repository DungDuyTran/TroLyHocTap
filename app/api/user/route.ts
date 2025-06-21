import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validate đầu vào
const UserSchema = z.object({
  hoTen: z.string().min(3),
  email: z.string().email(),
  soDienThoai: z.string().min(9).max(15),
  vaiTro: z.string().min(2),
  ngaySinh: z.coerce.date(),
});

// GET: Lọc danh sách người dùng
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 10;
  const page = Number(searchParams.get("page")) || 1;

  const whereFilter: Prisma.UserWhereInput = {
    ...(searchParams.get("hoTen") && {
      hoTen: { contains: searchParams.get("hoTen") || "" },
    }),
    ...(searchParams.get("email") && {
      email: { contains: searchParams.get("email") || "" },
    }),
    ...(searchParams.get("vaiTro") && {
      vaiTro: { equals: searchParams.get("vaiTro") || "" },
    }),
  };

  try {
    const totalRecords = await prisma.user.count({ where: whereFilter });
    const totalPages = Math.ceil(totalRecords / limit);

    const users = await prisma.user.findMany({
      where: whereFilter,
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(
      {
        data: users,
        extraInfo: {
          totalRecords,
          totalPages,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST: Tạo mới người dùng
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UserSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: validated.data,
    });

    return NextResponse.json({ newUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

// PUT: Cập nhật nhiều người dùng (có thể sửa lại nếu muốn cập nhật theo ID)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UserSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors },
        { status: 400 }
      );
    }

    await prisma.user.updateMany({
      data: validated.data,
    });

    return NextResponse.json(
      { message: "Đã cập nhật người dùng thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

// DELETE: Xóa tất cả người dùng (cẩn thận khi dùng)
export async function DELETE(req: NextRequest) {
  try {
    await prisma.user.deleteMany();
    return NextResponse.json(
      { message: "Đã xóa toàn bộ người dùng." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
