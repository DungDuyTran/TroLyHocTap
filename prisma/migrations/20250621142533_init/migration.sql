-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hoTen` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `soDienThoai` VARCHAR(255) NOT NULL,
    `vaiTro` VARCHAR(45) NOT NULL,
    `ngaySinh` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TienDoHocTap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trangThai` VARCHAR(45) NOT NULL,
    `ghiChu` VARCHAR(245) NULL,
    `tienDoPhanTram` INTEGER NOT NULL DEFAULT 0,
    `ngayBatDau` DATETIME(3) NOT NULL,
    `ngayKetThuc` DATETIME(3) NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThongKeHocTap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ngay` DATETIME(3) NOT NULL,
    `soGioHoc` DOUBLE NOT NULL,
    `ghiChu` VARCHAR(45) NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NhacNhoHocTap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tieuDe` VARCHAR(45) NOT NULL,
    `noiDung` VARCHAR(45) NOT NULL,
    `thoiGianNhac` DATETIME(3) NOT NULL,
    `trangThai` BOOLEAN NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GhiChu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `noiDung` VARCHAR(255) NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BangDiem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `diemGiuaKy` VARCHAR(45) NOT NULL,
    `diemThuongKy` VARCHAR(45) NOT NULL,
    `diemTrungBinh` VARCHAR(45) NOT NULL,
    `userId` INTEGER NOT NULL,
    `monHocId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MonHoc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenMon` VARCHAR(45) NOT NULL,
    `giangVien` VARCHAR(45) NOT NULL,
    `moTa` VARCHAR(450) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaiLieu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenFile` VARCHAR(45) NOT NULL,
    `huongDan` VARCHAR(255) NOT NULL,
    `ghiChu` VARCHAR(155) NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL,
    `monHocId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_MonHoc` (
    `userId` INTEGER NOT NULL,
    `monHocId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `monHocId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KyThi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenKyThi` VARCHAR(45) NOT NULL,
    `ghiChu` VARCHAR(155) NULL,
    `thoiGianThi` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichSuThi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `diem` DOUBLE NOT NULL,
    `ghiChu` VARCHAR(45) NULL,
    `kyThiId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_KyThi` (
    `userId` INTEGER NOT NULL,
    `kyThiId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `kyThiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichHoc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tieuDe` VARCHAR(45) NOT NULL,
    `batDau` DATETIME(3) NOT NULL,
    `ketThuc` DATETIME(3) NOT NULL,
    `monHocId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_LichHoc` (
    `userId` INTEGER NOT NULL,
    `lichHocId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `lichHocId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichHoc_MonHoc` (
    `lichHocId` INTEGER NOT NULL,
    `monHocId` INTEGER NOT NULL,

    PRIMARY KEY (`lichHocId`, `monHocId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KyThi_MonHoc` (
    `kyThiId` INTEGER NOT NULL,
    `monHocId` INTEGER NOT NULL,

    PRIMARY KEY (`kyThiId`, `monHocId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TienDoHocTap` ADD CONSTRAINT `TienDoHocTap_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThongKeHocTap` ADD CONSTRAINT `ThongKeHocTap_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NhacNhoHocTap` ADD CONSTRAINT `NhacNhoHocTap_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GhiChu` ADD CONSTRAINT `GhiChu_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BangDiem` ADD CONSTRAINT `BangDiem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BangDiem` ADD CONSTRAINT `BangDiem_monHocId_fkey` FOREIGN KEY (`monHocId`) REFERENCES `MonHoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaiLieu` ADD CONSTRAINT `TaiLieu_monHocId_fkey` FOREIGN KEY (`monHocId`) REFERENCES `MonHoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_MonHoc` ADD CONSTRAINT `User_MonHoc_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_MonHoc` ADD CONSTRAINT `User_MonHoc_monHocId_fkey` FOREIGN KEY (`monHocId`) REFERENCES `MonHoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichSuThi` ADD CONSTRAINT `LichSuThi_kyThiId_fkey` FOREIGN KEY (`kyThiId`) REFERENCES `KyThi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_KyThi` ADD CONSTRAINT `User_KyThi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_KyThi` ADD CONSTRAINT `User_KyThi_kyThiId_fkey` FOREIGN KEY (`kyThiId`) REFERENCES `KyThi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHoc` ADD CONSTRAINT `LichHoc_monHocId_fkey` FOREIGN KEY (`monHocId`) REFERENCES `MonHoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_LichHoc` ADD CONSTRAINT `User_LichHoc_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_LichHoc` ADD CONSTRAINT `User_LichHoc_lichHocId_fkey` FOREIGN KEY (`lichHocId`) REFERENCES `LichHoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHoc_MonHoc` ADD CONSTRAINT `LichHoc_MonHoc_lichHocId_fkey` FOREIGN KEY (`lichHocId`) REFERENCES `LichHoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHoc_MonHoc` ADD CONSTRAINT `LichHoc_MonHoc_monHocId_fkey` FOREIGN KEY (`monHocId`) REFERENCES `MonHoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KyThi_MonHoc` ADD CONSTRAINT `KyThi_MonHoc_kyThiId_fkey` FOREIGN KEY (`kyThiId`) REFERENCES `KyThi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KyThi_MonHoc` ADD CONSTRAINT `KyThi_MonHoc_monHocId_fkey` FOREIGN KEY (`monHocId`) REFERENCES `MonHoc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
