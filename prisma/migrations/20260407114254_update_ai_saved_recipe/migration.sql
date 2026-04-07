-- AlterTable
ALTER TABLE `tbl_ai_saved_recipe` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `cook_time` INTEGER NULL,
    ADD COLUMN `difficulty` VARCHAR(191) NULL,
    ADD COLUMN `xp` INTEGER NOT NULL DEFAULT 0;
