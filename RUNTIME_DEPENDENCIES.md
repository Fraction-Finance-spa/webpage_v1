# Runtime Dependencies

**Note:** This command runs from the repository root directory.

## Production Runtime Dependencies

These are the packages required to run the application in production (found in `package.json` under `"dependencies"`):

### Core Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | `^2.86.0` | Database client and authentication with Supabase |
| `dotenv` | `^17.2.1` | Environment variable management |
| `express` | `^5.1.0` | Web server framework for backend API |
| `zod` | `^3.25.76` | TypeScript-first schema validation |

## Frontend Runtime Dependencies (Included in devDependencies, built into production)

These packages are bundled into the final build and shipped to browsers:

| Category | Packages |
|----------|----------|
| **React** | react@^18.3.1, react-dom@^18.3.1 |
| **Routing** | react-router-dom@^6.30.1 |
| **UI Components** | @radix-ui/* (accordion, dialog, dropdown, form, etc.), lucide-react@^0.539.0 |
| **Forms** | react-hook-form@^7.62.0, @hookform/resolvers@^5.2.1 |
| **Styling** | tailwindcss@^3.4.17, tailwind-merge@^2.6.0, class-variance-authority@^0.7.1 |
| **Animations** | framer-motion@^12.23.12, tailwindcss-animate@^1.0.7, sonner@^1.7.4 |
| **3D Graphics** | three@^0.176.0, @react-three/fiber@^8.18.0, @react-three/drei@^9.122.0 |
| **Data Visualization** | recharts@^2.12.7 |
| **Utilities** | date-fns@^4.1.0, clsx@^2.1.1 |
| **Form Inputs** | input-otp@^1.4.2, embla-carousel-react@^8.6.0, react-resizable-panels@^3.0.4 |
| **Theming** | next-themes@^0.4.6 |

## Development Dependencies

These packages are **NOT** included in production builds:

- TypeScript and type definitions (@types/*)
- Testing frameworks (vitest)
- Build tools (vite, @vitejs/plugin-react-swc)
- Code quality (prettier, eslint configs)
- Backend types (@types/express, @types/cors)

## Running the Application

### Development Mode
```bash
# From the repository root
pnpm install
pnpm dev
```
The dev server includes both frontend (Vite) and backend (Express).

### Production Build
```bash
# From the repository root
pnpm install
pnpm build      # Builds both client and server
pnpm start      # Runs the production server
```

## Environment Variables Required

Create a `.env` file in the root directory with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anonymous_key

# Optional: Backend configuration
PING_MESSAGE=pong
```

## Dependency Graph

```
Application Root
├── Frontend (React SPA)
│   ├── React Components (UI Library + Custom)
│   ├── React Router (Navigation)
│   ├── TailwindCSS (Styling)
│   ├── Supabase JS Client (Database/Auth)
│   └── Other utilities (date-fns, recharts, etc.)
│
├── Backend (Express Server)
│   ├── Express Framework
│   ├── Supabase Client (Database)
│   ├── Zod (Validation)
│   └── CORS Middleware
│
└── Shared
    ├── Environment Variables (dotenv)
    └── Type Definitions
```

## Updating Dependencies

To update dependencies safely:

```bash
# Check for outdated packages
pnpm outdated

# Update specific package
pnpm update package-name

# Update all dependencies
pnpm update -r

# Install dependencies for current lock file
pnpm install
```

## Security Considerations

- Never commit `.env` files with real credentials
- Use environment variables for sensitive data
- Keep dependencies updated regularly
- Review security advisories: `pnpm audit`

## Deployment

When deploying:

1. ✅ Install dependencies: `pnpm install`
2. ✅ Set environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
3. ✅ Build: `pnpm build`
4. ✅ Start: `pnpm start`
5. ✅ Server runs on port 8080 by default

## Performance Notes

- **Frontend Bundle**: Optimized with Vite, uses code splitting
- **Supabase Client**: Lightweight, only loads what's needed
- **TypeScript**: Removed at build time, zero runtime overhead
- **TailwindCSS**: Purged in production, only includes used classes
