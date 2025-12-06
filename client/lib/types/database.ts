export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  industry?: string;
  description?: string;
  website?: string;
  founded_year?: number;
  annual_revenue?: number;
  employees_count?: number;
  country?: string;
  city?: string;
  logo_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  country?: string;
  city?: string;
  document_type?: string;
  document_number?: string;
  user_type: string;
  verified: boolean;
  verified_at?: string;
  profile_picture_url?: string;
  bio?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialInstrument {
  id: string;
  name: string;
  description?: string;
  type: string;
  category?: string;
  min_investment?: number;
  max_investment?: number;
  expected_return_percentage?: number;
  risk_level?: string;
  duration_months?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FinancingRequest {
  id: string;
  company_id: string;
  instrument_id: string;
  title: string;
  description?: string;
  amount_requested: number;
  amount_funded: number;
  interest_rate?: number;
  duration_months?: number;
  start_date?: string;
  end_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  financing_request_id: string;
  user_id: string;
  amount: number;
  transaction_type?: string;
  status: string;
  payment_date?: string;
  payment_method?: string;
  reference_number?: string;
  created_at: string;
  updated_at: string;
}

export interface DigitalAsset {
  id: string;
  name: string;
  description?: string;
  type?: string;
  blockchain_address?: string;
  total_supply?: number;
  issued_amount?: number;
  price_usd?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface STO {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  token_type?: string;
  total_tokens?: number;
  price_per_token?: number;
  soft_cap?: number;
  hard_cap?: number;
  start_date?: string;
  end_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  featured_image_url?: string;
  category?: string;
  published: boolean;
  views_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  content?: string;
  category?: string;
  level?: string;
  duration_minutes?: number;
  video_url?: string;
  pdf_url?: string;
  instructor?: string;
  duration_label?: string;
  image_url?: string;
  views_count: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  response?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  location?: string;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  requirements?: string;
  company_id?: string;
  posted_by?: string;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  resume_url?: string;
  cover_letter?: string;
  status: string;
  status_updated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position?: string;
  bio?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  twitter_url?: string;
  profile_image_url?: string;
  company_id?: string;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface EcosystemPartner {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  partner_type?: string;
  contact_email?: string;
  contact_person?: string;
  status: string;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: string;
  title: string;
  slug?: string;
  content: string;
  policy_type?: string;
  version: number;
  effective_date?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplaintClaim {
  id: string;
  type: string;
  user_id?: string;
  company_id?: string;
  transaction_id?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to?: string;
  resolution?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}
