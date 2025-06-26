import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema cho một người dùng
const UserSchema = z.object({
  hoTen: z.string().min(3),
  email: z.string().email(),
  soDienThoai: z.string().min(9).max(15),
  vaiTro: z.string().min(2),
  ngaySinh: z.coerce.date(),
});

// Schema cho mảng người dùng
const UsersSchema = z.array(UserSchema);

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

// POST: Nhập nguyên mảng người dùng
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UsersSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors },
        { status: 400 }
      );
    }

    const created = await prisma.user.createMany({
      data: validated.data,
      skipDuplicates: true,
    });

    return NextResponse.json(
      { message: "Đã thêm người dùng", created },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

// PUT: Cập nhật toàn bộ người dùng (có thể tuỳ chỉnh theo id)
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

// DELETE: Xoá toàn bộ người dùng
export async function DELETE(req: NextRequest) {
  try {
    await prisma.user.deleteMany();
    return NextResponse.json(
      { message: "Đã xoá toàn bộ người dùng." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
