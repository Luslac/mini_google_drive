-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_folderId_fkey`;

-- DropForeignKey
ALTER TABLE `folders` DROP FOREIGN KEY `folders_parentId_fkey`;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `folders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folders` ADD CONSTRAINT `folders_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `folders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
