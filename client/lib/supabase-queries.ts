import { supabase } from "./supabase";
import type {
  Company,
  User,
  FinancialInstrument,
  FinancingRequest,
  Transaction,
  ContactMessage,
  Article,
  Job,
  EducationalContent,
  ComplaintClaim,
  Policy,
} from "./types/database";

// Companies queries
export const companiesQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Company[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Company;
  },

  create: async (company: Omit<Company, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("companies")
      .insert([company])
      .select()
      .single();
    if (error) throw error;
    return data as Company;
  },

  update: async (
    id: string,
    updates: Partial<Omit<Company, "id" | "created_at" | "updated_at">>
  ) => {
    const { data, error } = await supabase
      .from("companies")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Company;
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) throw error;
  },
};

// Users queries
export const usersQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as User[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as User;
  },

  getByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (error) throw error;
    return data as User;
  },

  create: async (user: Omit<User, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("users")
      .insert([user])
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },

  update: async (
    id: string,
    updates: Partial<Omit<User, "id" | "created_at" | "updated_at">>
  ) => {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as User;
  },
};

// Financial Instruments queries
export const instrumentsQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("financial_instruments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as FinancialInstrument[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("financial_instruments")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as FinancialInstrument;
  },

  create: async (
    instrument: Omit<
      FinancialInstrument,
      "id" | "created_at" | "updated_at"
    >
  ) => {
    const { data, error } = await supabase
      .from("financial_instruments")
      .insert([instrument])
      .select()
      .single();
    if (error) throw error;
    return data as FinancialInstrument;
  },
};

// Financing Requests queries
export const financingRequestsQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("financing_requests")
      .select(
        `
        *,
        companies (*),
        financial_instruments (*)
      `
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("financing_requests")
      .select(
        `
        *,
        companies (*),
        financial_instruments (*)
      `
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  getByCompanyId: async (companyId: string) => {
    const { data, error } = await supabase
      .from("financing_requests")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as FinancingRequest[];
  },

  create: async (
    request: Omit<FinancingRequest, "id" | "created_at" | "updated_at">
  ) => {
    const { data, error } = await supabase
      .from("financing_requests")
      .insert([request])
      .select()
      .single();
    if (error) throw error;
    return data as FinancingRequest;
  },

  update: async (
    id: string,
    updates: Partial<Omit<FinancingRequest, "id" | "created_at" | "updated_at">>
  ) => {
    const { data, error } = await supabase
      .from("financing_requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as FinancingRequest;
  },
};

// Transactions queries
export const transactionsQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Transaction[];
  },

  getByFinancingRequestId: async (financingRequestId: string) => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("financing_request_id", financingRequestId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Transaction[];
  },

  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Transaction[];
  },

  create: async (
    transaction: Omit<Transaction, "id" | "created_at" | "updated_at">
  ) => {
    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction])
      .select()
      .single();
    if (error) throw error;
    return data as Transaction;
  },
};

// Contact Messages queries
export const contactMessagesQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ContactMessage[];
  },

  create: async (
    message: Omit<ContactMessage, "id" | "created_at" | "updated_at">
  ) => {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([message])
      .select()
      .single();
    if (error) throw error;
    return data as ContactMessage;
  },

  updateStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as ContactMessage;
  },
};

// Articles queries
export const articlesQueries = {
  getAll: async (limit?: number) => {
    let query = supabase
      .from("articles_news")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Article[];
  },

  getPaginated: async (page: number = 1, pageSize: number = 6) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("articles_news")
      .select("*", { count: "exact" })
      .eq("published", true)
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return {
      data: data as Article[],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  },

  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from("articles_news")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return data as Article;
  },

  create: async (article: Omit<Article, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("articles_news")
      .insert([article])
      .select()
      .single();
    if (error) throw error;
    return data as Article;
  },
};

// Educational Content queries
export const educationQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("educational_content")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as EducationalContent[];
  },

  getByCategory: async (category: string) => {
    const { data, error } = await supabase
      .from("educational_content")
      .select("*")
      .eq("category", category)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as EducationalContent[];
  },

  create: async (
    content: Omit<EducationalContent, "id" | "created_at" | "updated_at">
  ) => {
    const { data, error } = await supabase
      .from("educational_content")
      .insert([content])
      .select()
      .single();
    if (error) throw error;
    return data as EducationalContent;
  },
};

// Jobs queries
export const jobsQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, companies (*)")
      .eq("status", "open")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, companies (*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (job: Omit<Job, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("jobs")
      .insert([job])
      .select()
      .single();
    if (error) throw error;
    return data as Job;
  },
};

// Complaints and Claims queries
export const complaintsQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("complaints_claims")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ComplaintClaim[];
  },

  getByStatus: async (status: string) => {
    const { data, error } = await supabase
      .from("complaints_claims")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ComplaintClaim[];
  },

  create: async (
    complaint: Omit<ComplaintClaim, "id" | "created_at" | "updated_at">
  ) => {
    const { data, error } = await supabase
      .from("complaints_claims")
      .insert([complaint])
      .select()
      .single();
    if (error) throw error;
    return data as ComplaintClaim;
  },

  updateStatus: async (id: string, status: string, resolution?: string) => {
    const { data, error } = await supabase
      .from("complaints_claims")
      .update({ status, resolution, resolved_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as ComplaintClaim;
  },
};

// Policies queries
export const policiesQueries = {
  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from("policies")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    if (error) {
      console.warn(`Policy with slug "${slug}" not found:`, error);
      return null;
    }
    return data as Policy;
  },

  getByType: async (policyType: string) => {
    const { data, error } = await supabase
      .from("policies")
      .select("*")
      .eq("policy_type", policyType)
      .eq("published", true)
      .order("version", { ascending: false })
      .limit(1)
      .single();
    if (error) {
      console.warn(`Policy of type "${policyType}" not found:`, error);
      return null;
    }
    return data as Policy;
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from("policies")
      .select("*")
      .eq("published", true)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data as Policy[];
  },

  create: async (policy: Omit<Policy, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("policies")
      .insert([policy])
      .select()
      .single();
    if (error) throw error;
    return data as Policy;
  },

  update: async (
    id: string,
    updates: Partial<Omit<Policy, "id" | "created_at" | "updated_at">>
  ) => {
    const { data, error } = await supabase
      .from("policies")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Policy;
  },
};
