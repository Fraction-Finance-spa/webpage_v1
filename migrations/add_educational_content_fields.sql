-- Add extra fields for educational content details
ALTER TABLE educational_content ADD COLUMN IF NOT EXISTS instructor VARCHAR(255);
ALTER TABLE educational_content ADD COLUMN IF NOT EXISTS duration_label VARCHAR(100);
ALTER TABLE educational_content ADD COLUMN IF NOT EXISTS image_url TEXT;
