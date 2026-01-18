-- Add signature column to folios table
-- Type: LONGTEXT to support base64 image data
-- Safe migration that checks if column exists handled by nature of simple ALTER, 
-- but in MySQL raw SQL usually just try-catch or IF NOT EXISTS logic if needed. 
-- For this simple script, we use direct ALTER.

ALTER TABLE `folios` 
ADD COLUMN `signature` LONGTEXT NULL DEFAULT NULL AFTER `status`;
