# Guía de Integración - Supabase con Frontend

## Resumen de lo Implementado

Se ha integrado completamente **Supabase** como base de datos para tu aplicación con las siguientes funcionalidades:

### 1. ✅ Autenticación (Authentication)

**Archivos:**
- `client/lib/auth-context.tsx` - Context de autenticación con React
- `client/pages/Login.tsx` - Página de login
- `client/pages/Register.tsx` - Página de registro

**Uso en componentes:**
```tsx
import { useAuth } from "@/lib/auth-context";

function MyComponent() {
  const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Por favor inicia sesión</p>;
  }
  
  return <p>Hola {user?.email}</p>;
}
```

### 2. ✅ Formulario de Contacto

**Archivo:**
- `client/pages/ContactForm.tsx` - Componente de formulario de contacto

**Integración:**
```tsx
import ContactForm from "@/pages/ContactForm";

function ContactPage() {
  return (
    <Layout>
      <ContactForm />
    </Layout>
  );
}
```

Los datos se guardan automáticamente en la tabla `contact_messages` de Supabase.

### 3. ✅ Solicitud de Financiamiento

**Archivo:**
- `client/pages/FinancingRequestPage.tsx` - Página de solicitud de financiamiento

**Características:**
- Selecciona empresa
- Elige instrumento financiero
- Especifica monto y términos
- Los datos se guardan en `financing_requests`

**Uso:**
```tsx
import { Route } from "react-router-dom";
import FinancingRequestPage from "@/pages/FinancingRequestPage";

// En el router
<Route path="/solicitar-financiamiento" element={<FinancingRequestPage />} />
```

### 4. ✅ Dashboard de Admin

**Archivo:**
- `client/components/AdminDashboard.tsx` - Panel de administración completo

**Características:**
- Vista general con estadísticas
- Gestión de empresas
- Gestión de usuarios
- Gestión de solicitudes de financiamiento
- Gestión de mensajes de contacto
- Gestión de denuncias y reclamos

**Integración:**
```tsx
import AdminDashboard from "@/components/AdminDashboard";

// En una página de administrador
function AdminPage() {
  return (
    <Layout>
      <AdminDashboard />
    </Layout>
  );
}
```

### 5. ✅ Componentes Reutilizables para Datos Dinámicos

#### ArticlesList
Muestra artículos desde la base de datos:
```tsx
import ArticlesList from "@/components/ArticlesList";

// Básico
<ArticlesList />

// Con parámetros
<ArticlesList limit={3} category="financiamiento" />
```

#### JobsList
Muestra empleos disponibles:
```tsx
import JobsList from "@/components/JobsList";

// Básico
<JobsList />

// Con parámetros
<JobsList limit={5} />
```

#### InstrumentsList
Muestra instrumentos financieros:
```tsx
import InstrumentsList from "@/components/InstrumentsList";

// Todos los instrumentos
<InstrumentsList />

// Solo de un tipo
<InstrumentsList type="bonos" limit={6} />
```

---

## Funciones de Query Disponibles

**Ubicación:** `client/lib/supabase-queries.ts`

### Empresas
```tsx
import { companiesQueries } from "@/lib/supabase-queries";

// Obtener todas
const companies = await companiesQueries.getAll();

// Obtener por ID
const company = await companiesQueries.getById("id");

// Crear
const newCompany = await companiesQueries.create({
  name: "Acme Corp",
  email: "info@acme.com",
  status: "active"
});

// Actualizar
await companiesQueries.update("id", { status: "inactive" });

// Eliminar
await companiesQueries.delete("id");
```

### Usuarios
```tsx
import { usersQueries } from "@/lib/supabase-queries";

const users = await usersQueries.getAll();
const user = await usersQueries.getById("id");
const user = await usersQueries.getByEmail("user@email.com");
const newUser = await usersQueries.create({ email, full_name, user_type });
```

### Solicitudes de Financiamiento
```tsx
import { financingRequestsQueries } from "@/lib/supabase-queries";

const requests = await financingRequestsQueries.getAll();
const request = await financingRequestsQueries.getById("id");
const companyRequests = await financingRequestsQueries.getByCompanyId("company_id");
const newRequest = await financingRequestsQueries.create({...});
```

### Mensajes de Contacto
```tsx
import { contactMessagesQueries } from "@/lib/supabase-queries";

const messages = await contactMessagesQueries.getAll();
const newMessage = await contactMessagesQueries.create({...});
await contactMessagesQueries.updateStatus("id", "responded");
```

### Artículos
```tsx
import { articlesQueries } from "@/lib/supabase-queries";

const articles = await articlesQueries.getAll();
const article = await articlesQueries.getBySlug("slug-del-articulo");
const newArticle = await articlesQueries.create({...});
```

### Empleos
```tsx
import { jobsQueries } from "@/lib/supabase-queries";

const jobs = await jobsQueries.getAll();
const job = await jobsQueries.getById("id");
```

### Educación
```tsx
import { educationQueries } from "@/lib/supabase-queries";

const allContent = await educationQueries.getAll();
const categoryContent = await educationQueries.getByCategory("category");
```

### Denuncias y Reclamos
```tsx
import { complaintsQueries } from "@/lib/supabase-queries";

const all = await complaintsQueries.getAll();
const byStatus = await complaintsQueries.getByStatus("open");
const newComplaint = await complaintsQueries.create({...});
await complaintsQueries.updateStatus("id", "closed", "Resuelto");
```

---

## React Hooks para Queries

**Ubicación:** `client/hooks/useSupabase.ts`

### useQuery - Para GET
```tsx
import { useQuery } from "@/hooks/useSupabase";
import { companiesQueries } from "@/lib/supabase-queries";

function MyComponent() {
  const { data, loading, error, refetch } = useQuery(
    () => companiesQueries.getAll(),
    { refetchInterval: 5000 } // Refetch cada 5 segundos
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.map(c => <p key={c.id}>{c.name}</p>)}
      <button onClick={refetch}>Recargar</button>
    </div>
  );
}
```

### useMutation - Para POST/UPDATE/DELETE
```tsx
import { useMutation } from "@/hooks/useSupabase";
import { companiesQueries } from "@/lib/supabase-queries";

function CreateCompanyForm() {
  const { execute, loading, error } = useMutation(
    (data) => companiesQueries.create(data)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await execute({ name: "New Corp", status: "active" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loading}>
        {loading ? "Creando..." : "Crear"}
      </button>
    </form>
  );
}
```

---

## Tipos TypeScript

**Ubicación:** `client/lib/types/database.ts`

Todos los tipos están disponibles para uso type-safe:

```tsx
import type {
  Company,
  User,
  FinancialInstrument,
  FinancingRequest,
  Transaction,
  DigitalAsset,
  STO,
  Article,
  EducationalContent,
  ContactMessage,
  Job,
  JobApplication,
  TeamMember,
  EcosystemPartner,
  Policy,
  ComplaintClaim,
} from "@/lib/types/database";
```

---

## Ejemplo Completo: Página de Instrumentos

```tsx
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { instrumentsQueries } from "@/lib/supabase-queries";
import type { FinancialInstrument } from "@/lib/types/database";

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<FinancialInstrument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await instrumentsQueries.getAll();
        setInstruments(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Layout><p>Cargando...</p></Layout>;

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Instrumentos Financieros</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instruments.map((instrument) => (
            <Card key={instrument.id}>
              <CardHeader>
                <CardTitle>{instrument.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{instrument.description}</p>
                <p className="mt-2">Tipo: {instrument.type}</p>
                <p>Retorno: {instrument.expected_return_percentage}%</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
```

---

## Próximos Pasos

1. **Completar páginas con datos de Supabase:**
   - `/nosotros/blog` - usar `<ArticlesList />`
   - `/nosotros/careers` - usar `<JobsList />`
   - `/productos/inversiones` - usar `<InstrumentsList />`

2. **Implementar Row Level Security (RLS) en Supabase:**
   - Ve a tu dashboard de Supabase
   - Habilita RLS en cada tabla
   - Crea políticas de seguridad

3. **Conectar formulario de contacto en la página:**
   - Importa `ContactForm` en tu página de contacto
   - Reemplaza el formulario existente si lo hay

4. **Agregar más datos a Supabase:**
   - Desde el admin dashboard, crea empresas, instrumentos, etc.
   - O crea un panel de administración para agregar datos

5. **Personalización:**
   - Personaliza los estilos de los componentes
   - Agrega más campos según tus necesidades
   - Implementa filtros y búsqueda

---

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están configuradas
- Revisa en DevServerControl que están seteadas correctamente

### Error: "useAuth must be used within AuthProvider"
- Asegúrate de que el componente está dentro de `<AuthProvider>` en App.tsx

### No hay datos en las queries
- Verifica que las tablas están creadas en Supabase
- Comprueba que hay datos en la tabla desde el SQL Editor de Supabase

---

¡Listo! Tu plataforma está completamente integrada con Supabase. 🎉
