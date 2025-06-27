// app/api/kyThi/[id]/route.ts
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema để kiểm tra dữ liệu đầu vào khi tạo mới (chỉ để tương thích nếu bạn dùng chung schema)
// Tuy nhiên, POST thường nằm ở route.ts chính.
const KyThiSchema = z.object({
  tenKyThi: z.string().min(1, "Tên kỳ thi không được để trống."),
  ghiChu: z.string().min(1, "Ghi chú không được để trống.").optional(),
  // Sử dụng z.string() vì frontend gửi ISO string, sau đó chuyển đổi sang Date object.
  thoiGianThi: z.string().min(1, "Thời gian thi không được để trống."),
  daThamGia: z.boolean().default(false).optional(),
});

// Schema để kiểm tra dữ liệu đầu vào khi cập nhật (PUT)
// TẤT CẢ các trường đều là optional để bạn có thể cập nhật từng phần
const UpdateKyThiSchema = z.object({
  tenKyThi: z.string().min(1, "Tên kỳ thi không được để trống.").optional(),
  ghiChu: z.string().min(1, "Ghi chú không được để trống.").optional(),
  // Sử dụng .datetime().optional() cho thoiGianThi khi update
  thoiGianThi: z.string().datetime("Thời gian thi không hợp lệ.").optional(),
  daThamGia: z.boolean().optional(), // Đảm bảo daThamGia là optional
});

// Lấy kỳ thi theo ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params; // AWAIT PARAMS
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID kỳ thi không hợp lệ." },
        { status: 400 }
      );
    }

    const record = await prisma.kyThi.findUnique({
      where: { id },
      include: {
        // Bao gồm các mối quan hệ cần thiết
        kyThiMonHoc: {
          include: {
            monHoc: true,
          },
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Không tìm thấy kỳ thi." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: record });
  } catch (error: any) {
    console.error("Lỗi khi tải kỳ thi theo ID:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Cập nhật kỳ thi
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params; // AWAIT PARAMS
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID kỳ thi không hợp lệ." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = UpdateKyThiSchema.safeParse(body); // SỬ DỤNG UpdateKyThiSchema

    if (!parsed.success) {
      console.error("Lỗi xác thực PUT:", parsed.error.format());
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    // Chuyển đổi thoiGianThi thành Date object nếu nó tồn tại trong parsed.data
    const updateData: any = { ...parsed.data };
    if (parsed.data.thoiGianThi) {
      updateData.thoiGianThi = new Date(parsed.data.thoiGianThi);
    }

    const updated = await prisma.kyThi.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ data: updated });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật kỳ thi:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Xoá kỳ thi
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params; // AWAIT PARAMS
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID kỳ thi không hợp lệ." },
        { status: 400 }
      );
    }

    await prisma.kyThi.delete({ where: { id } });
    return NextResponse.json({ message: "Kỳ thi đã được xóa thành công." });
  } catch (error: any) {
    console.error("Lỗi khi xóa kỳ thi:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
