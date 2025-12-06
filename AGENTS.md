# Fusion Starter

A production-ready full-stack React application template with integrated Express server, featuring React Router 6 SPA mode, TypeScript, Vitest, Zod and modern tooling.

While the starter comes with a express server, only create endpoint when strictly neccesary, for example to encapsulate logic that must leave in the server, such as private keys handling, or certain DB operations, db...

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
```

## Key Features

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### Express Server Integration

- **Development**: Single port (8080) for both frontend/backend
- **Hot reload**: Both client and server code
- **API endpoints**: Prefixed with `/api/`

#### Example API Routes
- `GET /api/ping` - Simple ping api
- `GET /api/demo` - Demo endpoint  

### Shared Types
Import consistent types in both client and server:
```typescript
import { DemoResponse } from '@shared/api';
```

Path aliases:
- `@shared/*` - Shared folder
- `@/*` - Client folder

## Development Commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm test          # Run Vitest tests
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New API Route
1. **Optional**: Create a shared interface in `shared/api.ts`:
```typescript
export interface MyRouteResponse {
  message: string;
  // Add other response properties here
}
```

2. Create a new route handler in `server/routes/my-route.ts`:
```typescript
import { RequestHandler } from "express";
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

export const handleMyRoute: RequestHandler = (req, res) => {
  const response: MyRouteResponse = {
    message: 'Hello from my endpoint!'
  };
  res.json(response);
};
```

3. Register the route in `server/index.ts`:
```typescript
import { handleMyRoute } from "./routes/my-route";

// Add to the createServer function:
app.get("/api/my-endpoint", handleMyRoute);
```

4. Use in React components with type safety:
```typescript
import { MyRouteResponse } from '@shared/api'; // Optional: for type safety

const response = await fetch('/api/my-endpoint');
const data: MyRouteResponse = await response.json();
```

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Standard**: `pnpm build`
- **Binary**: Self-contained executables (Linux, macOS, Windows)
- **Cloud Deployment**: Use either Netlify or Vercel via their MCP integrations for easy deployment. Both providers work well with this starter template.

## Design System & Component Guidelines

### UI Component Library Location
All pre-built components are in `client/components/ui/` and come from shadcn/ui:
- `button.tsx` - Button component
- `input.tsx` - Text input component
- `card.tsx` - Card container (CardHeader, CardTitle, CardContent, etc.)
- `dialog.tsx` - Modal dialogs
- `tabs.tsx` - Tabbed interfaces
- `badge.tsx` - Badge labels
- `alert.tsx` - Alert messages
- `textarea.tsx` - Multi-line text input
- `select.tsx` - Dropdown select
- `toast.tsx` - Toast notifications
- And many more in the ui folder

### How AI Should Use Components

#### Import Pattern
Always import from the `@/components/ui/` path alias:
```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
```

#### Button Usage
```tsx
<Button>Click me</Button>
<Button variant="outline">Outline button</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small button</Button>
<Button disabled>Disabled</Button>
```

#### Card Component
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

#### Form Inputs
```tsx
<Input type="email" placeholder="Enter email" />
<Textarea placeholder="Enter message" />
```

### Styling System

#### Tailwind CSS Classes
- Use TailwindCSS utility classes for all styling
- Base colors: `primary`, `secondary`, `destructive`, `muted`, `accent`
- Spacing: `p-`, `m-`, `px-`, `py-` (padding, margin)
- Typography: `text-sm`, `text-base`, `font-bold`, `font-semibold`
- Responsive: `md:`, `lg:` for breakpoints
- Interactive: `hover:`, `focus:`, `disabled:`, `dark:`

Example:
```tsx
<div className="p-4 md:p-6 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all">
  Content
</div>
```

#### Using cn() for Conditional Classes
Always use the `cn()` utility for combining classes:
```typescript
import { cn } from "@/lib/utils";

<Button className={cn(
  "base-class",
  isActive && "active-class",
  props.className
)} />
```

#### Custom Inline Styles
Use Tailwind first, but inline styles are acceptable for dynamic values:
```tsx
<div style={{
  backgroundColor: dynamicColor,
  padding: `${spacing}px`
}}>
  Content
</div>
```

### Color System
Colors are defined as CSS variables in `client/global.css`:
- `--primary` - Main brand color (blue)
- `--secondary` - Secondary color
- `--destructive` - Error/delete actions (red)
- `--muted` - Disabled/secondary text
- `--accent` - Highlights
- `--background` - Page background
- `--foreground` - Text color

Use with Tailwind:
```tsx
className="bg-primary text-primary-foreground hover:bg-primary/90"
```

### Component Organization

#### Page Components
Location: `client/pages/`
- One route per file (Index.tsx, About.tsx, etc.)
- Pages should import Layout and wrap content
- Example: `<Layout><YourPageContent /></Layout>`

#### Reusable Components
Location: `client/components/`
- Non-page components (non-ui)
- Custom business logic components
- Feature-specific components
- Examples: AdminDashboard.tsx, ArticlesList.tsx, JobsList.tsx

#### UI Components
Location: `client/components/ui/`
- Pre-built components from shadcn/ui
- DO NOT modify these files unless necessary
- Use as-is from the library

#### Hooks
Location: `client/hooks/`
- Custom React hooks
- useAuth.ts, useSupabase.ts, use-toast.ts, use-mobile.tsx

#### Library Functions
Location: `client/lib/`
- Utilities: utils.ts, cn() function
- Supabase: supabase.ts, auth-context.tsx, supabase-queries.ts, useSupabase.ts
- Types: types/database.ts

### AI Implementation Guidelines

When creating components:

1. **Always check existing components first** - Don't recreate what already exists in `client/components/ui/`

2. **Follow established patterns** - Look at existing pages/components for patterns and replicate them

3. **Use TypeScript** - Always add proper types, especially for props:
```typescript
interface MyComponentProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function MyComponent({ title, onClick, disabled }: MyComponentProps) {
  // Component code
}
```

4. **Keep components focused** - Each component should do one thing well. Break complex UIs into smaller components

5. **Use hooks for state** - Prefer React hooks over class components:
```typescript
import { useState, useEffect } from "react";

export function MyComponent() {
  const [state, setState] = useState("");
  useEffect(() => {
    // Side effects
  }, []);
  return <div>{state}</div>;
}
```

6. **Loading and error states** - Always handle these:
```typescript
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
return <div>{data}</div>;
```

7. **Accessibility** - Use semantic HTML and ARIA attributes:
```typescript
<button aria-label="Close dialog" onClick={onClose}>✕</button>
<div role="alert">{errorMessage}</div>
```

8. **Responsive design** - Use Tailwind responsive prefixes:
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

### Supabase Integration

#### Database Types
Location: `client/lib/types/database.ts`
All database tables have TypeScript interfaces. Always import and use these for type safety.

#### Supabase Queries
Location: `client/lib/supabase-queries.ts`
Pre-built query functions for each table:
```typescript
import { companiesQueries, articlesQueries } from "@/lib/supabase-queries";

const companies = await companiesQueries.getAll();
const article = await articlesQueries.getBySlug("slug");
```

#### Authentication Context
Location: `client/lib/auth-context.tsx`
Use the useAuth hook in components:
```typescript
import { useAuth } from "@/lib/auth-context";

const { user, isAuthenticated, signIn, signOut } = useAuth();
```

#### Protected Routes
Example pattern for protecting routes:
```typescript
<Route path="/admin" element={<ProtectedRoute element={<AdminPage />} />} />
```

## Architecture Notes

- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library (shadcn/ui) included
- Type-safe API communication via shared interfaces
- Supabase integration for database and authentication
- Full database schema with 16 tables pre-configured
