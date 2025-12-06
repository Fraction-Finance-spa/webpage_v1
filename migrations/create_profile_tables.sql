-- Investment Profiles table
CREATE TABLE IF NOT EXISTS investment_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  objectives VARCHAR(500),
  risk_tolerance VARCHAR(100),
  experience VARCHAR(100),
  available_capital NUMERIC,
  investor_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(user_id)
);

-- Bank Accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_name VARCHAR(255),
  account_number VARCHAR(50),
  account_type VARCHAR(50),
  account_holder_name VARCHAR(255),
  swift_code VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(user_id)
);

-- Add extra columns to users table for personal info
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS residence_country VARCHAR(100);

-- Add extra columns to users table for company info
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS legal_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS constitution_country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_activity VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS constitution_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS legal_address VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS commercial_address VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_information VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_person_name VARCHAR(255);
