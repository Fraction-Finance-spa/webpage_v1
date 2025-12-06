-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  industry VARCHAR(100),
  description TEXT,
  website VARCHAR(255),
  founded_year INTEGER,
  annual_revenue NUMERIC,
  employees_count INTEGER,
  country VARCHAR(100),
  city VARCHAR(100),
  logo_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  country VARCHAR(100),
  city VARCHAR(100),
  document_type VARCHAR(50),
  document_number VARCHAR(50) UNIQUE,
  user_type VARCHAR(50) DEFAULT 'investor',
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  profile_picture_url TEXT,
  bio TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Financial Instruments table
CREATE TABLE IF NOT EXISTS financial_instruments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  min_investment NUMERIC,
  max_investment NUMERIC,
  expected_return_percentage NUMERIC,
  risk_level VARCHAR(50),
  duration_months INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Financing Requests table
CREATE TABLE IF NOT EXISTS financing_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES financial_instruments(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount_requested NUMERIC NOT NULL,
  amount_funded NUMERIC DEFAULT 0,
  interest_rate NUMERIC,
  duration_months INTEGER,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  financing_request_id UUID NOT NULL REFERENCES financing_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  transaction_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR(100),
  reference_number VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Digital Assets table
CREATE TABLE IF NOT EXISTS digital_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  blockchain_address VARCHAR(255),
  total_supply NUMERIC,
  issued_amount NUMERIC,
  price_usd NUMERIC,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- STOs table
CREATE TABLE IF NOT EXISTS stos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  token_type VARCHAR(100),
  total_tokens NUMERIC,
  price_per_token NUMERIC,
  soft_cap NUMERIC,
  hard_cap NUMERIC,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Articles and News table
CREATE TABLE IF NOT EXISTS articles_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content TEXT,
  excerpt VARCHAR(500),
  author VARCHAR(255),
  featured_image_url TEXT,
  category VARCHAR(100),
  published BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Educational Content table
CREATE TABLE IF NOT EXISTS educational_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  content TEXT,
  category VARCHAR(100),
  level VARCHAR(50),
  duration_minutes INTEGER,
  video_url TEXT,
  pdf_url TEXT,
  views_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  location VARCHAR(255),
  job_type VARCHAR(50),
  salary_min NUMERIC,
  salary_max NUMERIC,
  currency VARCHAR(10),
  requirements TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  posted_by UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'open',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Job Applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resume_url TEXT,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  status_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  bio TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  linkedin_url VARCHAR(255),
  twitter_url VARCHAR(255),
  profile_image_url TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Ecosystem Partners table
CREATE TABLE IF NOT EXISTS ecosystem_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  logo_url TEXT,
  partner_type VARCHAR(100),
  contact_email VARCHAR(255),
  contact_person VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content TEXT NOT NULL,
  policy_type VARCHAR(100),
  version INTEGER DEFAULT 1,
  effective_date TIMESTAMP WITH TIME ZONE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Complaints and Claims table
CREATE TABLE IF NOT EXISTS complaints_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  transaction_id UUID REFERENCES transactions(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  priority VARCHAR(50) DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id),
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_document ON users(document_number);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_instruments_type ON financial_instruments(type);
CREATE INDEX IF NOT EXISTS idx_instruments_status ON financial_instruments(status);
CREATE INDEX IF NOT EXISTS idx_financing_company ON financing_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_financing_instrument ON financing_requests(instrument_id);
CREATE INDEX IF NOT EXISTS idx_financing_status ON financing_requests(status);
CREATE INDEX IF NOT EXISTS idx_transactions_financing ON transactions(financing_request_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_digital_assets_type ON digital_assets(type);
CREATE INDEX IF NOT EXISTS idx_digital_assets_status ON digital_assets(status);
CREATE INDEX IF NOT EXISTS idx_stos_company ON stos(company_id);
CREATE INDEX IF NOT EXISTS idx_stos_status ON stos(status);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles_news(published);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles_news(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles_news(slug);
CREATE INDEX IF NOT EXISTS idx_education_category ON educational_content(category);
CREATE INDEX IF NOT EXISTS idx_education_level ON educational_content(level);
CREATE INDEX IF NOT EXISTS idx_education_published ON educational_content(published);
CREATE INDEX IF NOT EXISTS idx_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);
CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_team_company ON team_members(company_id);
CREATE INDEX IF NOT EXISTS idx_partners_type ON ecosystem_partners(partner_type);
CREATE INDEX IF NOT EXISTS idx_partners_status ON ecosystem_partners(status);
CREATE INDEX IF NOT EXISTS idx_policies_slug ON policies(slug);
CREATE INDEX IF NOT EXISTS idx_policies_published ON policies(published);
CREATE INDEX IF NOT EXISTS idx_complaints_type ON complaints_claims(type);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints_claims(status);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_company ON complaints_claims(company_id);
