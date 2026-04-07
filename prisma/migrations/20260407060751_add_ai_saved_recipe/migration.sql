-- CreateTable
CREATE TABLE `tbl_ai_saved_recipe` (
    `ai_saved_recipe_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `ingredients` JSON NOT NULL,
    `steps` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ai_saved_recipe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_ai_saved_recipe` ADD CONSTRAINT `tbl_ai_saved_recipe_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE CASCADE ON UPDATE CASCADE;
