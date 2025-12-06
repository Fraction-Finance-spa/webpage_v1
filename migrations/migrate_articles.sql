-- Insert Blog Articles
INSERT INTO articles_news (title, slug, content, excerpt, category, published, published_at, created_at, updated_at) VALUES
(
  '"Fraction" seleccionada para ALGEN‑18',
  'fraction-seleccionada-algen-18',
  '<h2>"Fraction" seleccionada para ALGEN‑18</h2><p>Fraction Finance ha sido seleccionada para participar en el programa ALGEN-18, un reconocimiento significativo en el ecosistema de finanzas digitales. Esta selección refleja nuestro compromiso con la innovación y la excelencia en el desarrollo de soluciones de financiamiento alternativo.</p><p>ALGEN-18 es una iniciativa que busca impulsar y reconocer a las startups y empresas más innovadoras en el área de tecnología financiera. Nuestra participación en este programa abre nuevas oportunidades para colaboraciones estratégicas y crecimiento.</p>',
  '"Fraction" seleccionada para participar en el programa ALGEN-18',
  'Programas',
  TRUE,
  '2025-10-07T00:00:00Z',
  TIMEZONE('utc'::text, NOW()),
  TIMEZONE('utc'::text, NOW())
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

INSERT INTO articles_news (title, slug, content, excerpt, category, published, published_at, created_at, updated_at) VALUES
(
  'SWIFT construye plataforma de pagos en Ethereum con más de 30 bancos',
  'swift-plataforma-pagos-ethereum-30-bancos',
  '<h2>SWIFT construye plataforma de pagos en Ethereum con más de 30 bancos</h2><p>La Society for Worldwide Interbank Financial Telecommunication (SWIFT), ha anunciado el desarrollo de una plataforma de pagos basada en Ethereum que integra a más de 30 bancos globales. Este es un hito importante en la adopción de tecnología blockchain por instituciones financieras tradicionales.</p><p>La plataforma busca mejorar la velocidad y eficiencia de las transacciones internacionales, reduciendo costos y tiempos de liquidación. La participación de instituciones bancarias de renombre mundial valida la importancia de la tecnología blockchain en el futuro del sistema financiero.</p>',
  'SWIFT desarrolla plataforma de pagos interbancaria en Ethereum',
  'Blockchain',
  TRUE,
  '2025-10-03T00:00:00Z',
  TIMEZONE('utc'::text, NOW()),
  TIMEZONE('utc'::text, NOW())
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

INSERT INTO articles_news (title, slug, content, excerpt, category, published, published_at, created_at, updated_at) VALUES
(
  'La Fed Reduce la Tasa de Interés y Bitcoin Reacciona al Alza',
  'fed-reduce-tasa-interes-bitcoin-reacciona',
  '<h2>La Fed Reduce la Tasa de Interés y Bitcoin Reacciona al Alza</h2><p>La Reserva Federal de Estados Unidos anunció una reducción en las tasas de interés, lo que provocó una reacción positiva inmediata en los mercados de criptoactivos. Bitcoin experimentó una suba significativa, reflejando la correlación entre políticas monetarias tradicionales y activos digitales.</p><p>Las decisiones de política monetaria tienen impactos directos en los mercados de criptomonedas. Una tasa de interés más baja generalmente incentiva a los inversores a buscar rendimientos en activos alternativos como Bitcoin y otros criptoactivos. Este evento subraya la importancia de monitorear indicadores macroeconómicos para inversores en activos digitales.</p>',
  'La Fed reduce tasas de interés y Bitcoin sube como reacción',
  'Política monetaria',
  TRUE,
  '2025-09-16T00:00:00Z',
  TIMEZONE('utc'::text, NOW()),
  TIMEZONE('utc'::text, NOW())
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

INSERT INTO articles_news (title, slug, content, excerpt, category, published, published_at, created_at, updated_at) VALUES
(
  'Nasdaq abre la puerta a la tokenización de acciones en Wall Street',
  'nasdaq-abre-tokenizacion-acciones-wall-street',
  '<h2>Nasdaq abre la puerta a la tokenización de acciones en Wall Street</h2><p>La bolsa de valores Nasdaq ha anunciado su iniciativa para permitir la tokenización de acciones, un paso revolucionario que podría transformar completamente la forma en que se negocian los valores en Wall Street. Esta decisión marca el inicio de una era donde los mercados tradicionales abrazan la tecnología blockchain.</p><p>La tokenización de acciones permitirá mayor liquidez, operaciones 24/7, y costos de transacción reducidos. Nasdaq se posiciona como un líder en la integración de tecnología blockchain con los mercados financieros convencionales, abriendo nuevas posibilidades para inversores institucionales y retail.</p>',
  'Nasdaq autoriza la tokenización de acciones en su plataforma',
  'Acciones',
  TRUE,
  '2025-09-08T00:00:00Z',
  TIMEZONE('utc'::text, NOW()),
  TIMEZONE('utc'::text, NOW())
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;

INSERT INTO articles_news (title, slug, content, excerpt, category, published, published_at, created_at, updated_at) VALUES
(
  'EE.UU. aprueba histórica ley sobre stablecoins y se perfila como líder mundial en criptoactivos',
  'eeuu-aprueba-ley-stablecoins-lider-criptoactivos',
  '<h2>EE.UU. aprueba histórica ley sobre stablecoins</h2><p>El Congreso de los Estados Unidos ha aprobado una ley histórica que regula los stablecoins, consolidando al país como líder mundial en la regulación de criptoactivos. Esta legislación proporciona un marco claro para empresas que emiten stablecoins, fomentando la innovación mientras protege a los consumidores.</p><p>La aprobación de esta ley es un hito importante en la adopción mainstream de criptoactivos. Al proporcionar claridad regulatoria, EE.UU. posiciona a sus instituciones financieras y startups como jugadores clave en la economía digital global. Los stablecoins, respaldados por este marco legal, se espera que jueguen un papel crucial en la transformación del sistema de pagos internacional.</p>',
  'EE.UU. aprueba marco regulatorio para stablecoins',
  'Stablecoin',
  TRUE,
  '2025-07-17T00:00:00Z',
  TIMEZONE('utc'::text, NOW()),
  TIMEZONE('utc'::text, NOW())
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;
