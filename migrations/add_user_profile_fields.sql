-- Add personal profile fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS residence_country VARCHAR(100);

-- Add company profile fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS legal_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS constitution_country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_activity VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS constitution_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS legal_address VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS commercial_address VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_information TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_person_name VARCHAR(255);
