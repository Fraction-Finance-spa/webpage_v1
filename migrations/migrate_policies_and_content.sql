-- Insert Policies
INSERT INTO policies (title, slug, content, policy_type, version, effective_date, published) VALUES
(
  'Política de Privacidad',
  'politica-privacidad',
  '<h2>Política de Privacidad</h2>
<p>En Fraction Finance, nos comprometemos a proteger tu privacidad y garantizar que tengas una experiencia positiva en nuestro sitio web.</p>

<h3>1. Información que Recopilamos</h3>
<p>Recopilamos información que nos proporcionas voluntariamente, como tu nombre, correo electrónico y información de contacto cuando completas formularios o te registras en nuestro sitio.</p>

<h3>2. Cómo Usamos tu Información</h3>
<p>Utilizamos tu información para proporcionar, mantener y mejorar nuestros servicios, procesar transacciones y comunicarnos contigo.</p>

<h3>3. Protección de Datos</h3>
<p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado.</p>

<h3>4. Derechos del Usuario</h3>
<p>Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento contactándonos directamente.</p>

<h3>5. Cambios a esta Política</h3>
<p>Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación.</p>',
  'privacy',
  1,
  TIMEZONE('utc'::text, NOW()),
  TRUE
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, version = EXCLUDED.version;

INSERT INTO policies (title, slug, content, policy_type, version, effective_date, published) VALUES
(
  'Términos de Servicio',
  'terminos-servicio',
  '<h2>Términos de Servicio</h2>
<p>Bienvenido a Fraction Finance. Estos Términos de Servicio rigen tu acceso y uso de nuestro sitio web y servicios.</p>

<h3>1. Aceptación de Términos</h3>
<p>Al acceder y usar Fraction Finance, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguno de los términos, por favor no uses nuestros servicios.</p>

<h3>2. Licencia de Uso</h3>
<p>Te otorgamos una licencia limitada, no exclusiva y revocable para acceder y usar nuestro sitio web para fines personales y no comerciales.</p>

<h3>3. Conducta del Usuario</h3>
<p>Te comprometes a no utilizar nuestro sitio de manera que:</p>
<ul>
  <li>Viole cualquier ley o regulación aplicable</li>
  <li>Infrinja los derechos de terceros</li>
  <li>Contenga material ilegal o dañino</li>
  <li>Intente obtener acceso no autorizado a nuestros sistemas</li>
</ul>

<h3>4. Limitación de Responsabilidad</h3>
<p>Fraction Finance no será responsable por daños indirectos, incidentales o consecuentes derivados de tu uso de nuestros servicios.</p>

<h3>5. Cambios a los Términos</h3>
<p>Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Tu uso continuado del sitio constituye aceptación de los cambios.</p>',
  'terms',
  1,
  TIMEZONE('utc'::text, NOW()),
  TRUE
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, version = EXCLUDED.version;

INSERT INTO policies (title, slug, content, policy_type, version, effective_date, published) VALUES
(
  'Política de Cookies',
  'politica-cookies',
  '<h2>Política de Cookies</h2>
<p>Fraction Finance utiliza cookies para mejorar tu experiencia en nuestro sitio web. Esta política explica cómo usamos cookies y tecnologías similares.</p>

<h3>1. ¿Qué Son las Cookies?</h3>
<p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a recordar tus preferencias y mejorar tu experiencia de usuario.</p>

<h3>2. Tipos de Cookies que Usamos</h3>
<h4>Cookies Esenciales</h4>
<p>Son necesarias para el funcionamiento básico de nuestro sitio web, como autenticación y seguridad.</p>

<h4>Cookies de Rendimiento</h4>
<p>Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio para mejorar la experiencia.</p>

<h4>Cookies de Marketing</h4>
<p>Se utilizan para rastrear la efectividad de campañas de marketing y publicidad personalizada.</p>

<h3>3. Control de Cookies</h3>
<p>Puedes controlar y eliminar cookies a través de la configuración de tu navegador. Sin embargo, esto puede afectar la funcionalidad de nuestro sitio.</p>

<h3>4. Cambios a esta Política</h3>
<p>Podemos actualizar esta Política de Cookies en cualquier momento. Te recomendamos revisar esta página regularmente.</p>',
  'cookies',
  1,
  TIMEZONE('utc'::text, NOW()),
  TRUE
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, version = EXCLUDED.version;
