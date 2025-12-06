# Supabase Setup Guide

## Project Credentials

- **Project ID**: `hphpeuutfsgnsproqosw`
- **Project URL**: `https://hphpeuutfsgnsproqosw.supabase.co`
- **Publishable Key**: `sb_publishable_uhKWTDpjQMsNBoiInoi1CA_dOTwsJfp`

## Step 1: Create the Database Schema

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project "Webpage_v1"
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire content from `database-schema.sql` file
6. Click **Run** to create all tables and indexes

## Step 2: Environment Variables

The following environment variables have been set up:

```env
VITE_SUPABASE_URL=https://hphpeuutfsgnsproqosw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_uhKWTDpjQMsNBoiInoi1CA_dOTwsJfp
```

These are configured in the dev server and will be available to your frontend application.

## Step 3: Database Tables Created

The following tables have been created:

### Core Tables
- **companies** - Financing request companies
- **users** - User/investor accounts
- **financial_instruments** - Available financial instruments
- **financing_requests** - Financing operation requests
- **transactions** - Payment transactions

### Content & Assets
- **digital_assets** - Cryptocurrency/digital assets
- **stos** - Security Token Offerings
- **articles_news** - Articles and news content
- **educational_content** - Educational resources
- **policies** - Terms, privacy, and other policies

### Operations
- **jobs** - Job postings
- **job_applications** - Job applications
- **team_members** - Company team members
- **ecosystem_partners** - Ecosystem partners
- **contact_messages** - Contact form submissions
- **complaints_claims** - Complaints and claim reports

## Step 4: Using Supabase in Your App

### Client Import

```typescript
import { supabase } from "@/lib/supabase";
```

### Query Examples

The project includes pre-built query helpers in `client/lib/supabase-queries.ts`:

```typescript
import {
  companiesQueries,
  usersQueries,
  contactMessagesQueries,
  articlesQueries,
  jobsQueries,
} from "@/lib/supabase-queries";

// Get all companies
const companies = await companiesQueries.getAll();

// Get company by ID
const company = await companiesQueries.getById("company-id");

// Create new company
const newCompany = await companiesQueries.create({
  name: "Acme Corp",
  email: "info@acme.com",
  industry: "Technology",
  status: "active",
});

// Create contact message
const message = await contactMessagesQueries.create({
  name: "John Doe",
  email: "john@example.com",
  message: "I have a question...",
  status: "new",
});
```

### Using in React Components

```typescript
import { useEffect, useState } from "react";
import { companiesQueries } from "@/lib/supabase-queries";
import type { Company } from "@/lib/types/database";

export function CompaniesList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await companiesQueries.getAll();
        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {companies.map((company) => (
        <div key={company.id}>
          <h3>{company.name}</h3>
          <p>{company.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## TypeScript Types

All database tables have corresponding TypeScript interfaces in `client/lib/types/database.ts`. Use these for type-safe queries:

```typescript
import type {
  Company,
  User,
  FinancialInstrument,
  FinancingRequest,
  Transaction,
  ContactMessage,
} from "@/lib/types/database";
```

## Direct Supabase Queries

For custom queries not covered by the query helpers:

```typescript
import { supabase } from "@/lib/supabase";

// Select
const { data, error } = await supabase
  .from("companies")
  .select("*")
  .eq("status", "active");

// Insert
const { data, error } = await supabase
  .from("companies")
  .insert([{ name: "New Company", status: "active" }])
  .select();

// Update
const { data, error } = await supabase
  .from("companies")
  .update({ status: "inactive" })
  .eq("id", "company-id")
  .select();

// Delete
const { error } = await supabase.from("companies").delete().eq("id", "company-id");
```

## Real-time Subscriptions

Listen to database changes in real-time:

```typescript
import { supabase } from "@/lib/supabase";

const subscription = supabase
  .from("companies")
  .on("*", (payload) => {
    console.log("Change received!", payload);
  })
  .subscribe();

// Clean up
subscription.unsubscribe();
```

## Row Level Security (RLS)

For production, enable Row Level Security policies to control data access. Visit your Supabase dashboard and configure RLS policies for each table.

## Useful Resources

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase SQL Reference](https://supabase.com/docs/guides/database/overview)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
