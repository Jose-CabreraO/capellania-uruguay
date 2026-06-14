# Comparativo SEO integral

Proyecto: sitio unificado de Capellania Empresarial y Congreso Cristiano Paraguay  
Fecha de auditoria: 2026-06-13  
Metodo: intento de navegador integrado no disponible por bloqueo del sandbox de Windows; extraccion realizada con `Invoke-WebRequest` sobre las webs originales y lectura directa de los HTML locales.

## Resumen ejecutivo

La nueva estructura mejora de forma clara la higiene SEO respecto a los sitios originales. Los sitios legacy usan titulos genericos, descripciones cruzadas o poco especificas, multiples dependencias visuales pesadas y no exponen OpenGraph completo en la home inspeccionada. El sitio nuevo separa la intencion de busqueda por pagina, evita metadata cruzada entre Capellania y Congreso, define un H1 unico por documento y agrega OpenGraph contextual para Home, Congreso 2026, Inscripcion y Galeria.

Mejora estimada:

| Area | Estado legacy | Estado nuevo | Mejora |
| --- | --- | --- | --- |
| Titles | Genericos por marca | Especificos por seccion e intencion | Alta |
| Meta descriptions | Una description cruzada en Capellania y una institucional extensa en Congreso | Descripciones accionables por ruta | Alta |
| H1/H2 | H1 visual dentro de sliders y contenido con encabezados vacios | Un H1 principal y H2 de secciones semanticas | Alta |
| OpenGraph | No se observaron tags OG principales en las homes inspeccionadas | `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url` por pagina | Alta |
| Arquitectura de dominio | Dos dominios con narrativa fragmentada | Estructura unificada bajo `capellania.org.py` | Alta |
| Performance SEO | Swiper, WOW, jQuery, Jarallax, Owl, Fancybox y otros vendors | CSS global propio y JS nativo minimo | Alta |

## Sitios originales auditados

### capellania.org.py

Tags detectados:

| Tag | Valor |
| --- | --- |
| Title | `Capellania Empresarial` |
| Meta description | `15° Congreso Cristiano de Ejecutivos y Lideres` |
| H1 | No se detecto H1 semantico claro en la home inspeccionada; el hero usa `h2`. |
| H2 principal visible | `SERVICIO CON PRINCIPIOS CRISTIANOS QUE CONTRIBUYEN A LA CALIDAD DE VIDA DEL COLABORADOR` en slider |
| OpenGraph | No se observaron `og:title`, `og:description`, `og:url` ni `og:type` en el head inspeccionado. |
| Canonical | No observado. |

Hallazgo critico: la description de la home institucional apunta a un Congreso anterior. Esto cruza intencion SEO, debilita la relevancia de marca de Capellania y puede generar snippets incorrectos.

### congresocristianopy.org.py

Tags detectados:

| Tag | Valor |
| --- | --- |
| Title | `Congreso Cristiano Paraguay` |
| Meta description | Texto institucional largo sobre la fundacion del Congreso en 2005. |
| H1 | No se detecto H1 semantico claro en la home inspeccionada; el hero usa `h2`. |
| H2 principal visible | `XVIII CONGRESO CRISTIANO DE EJECUTIVOS Y LIDERES` en slider |
| OpenGraph | No se observaron `og:title`, `og:description`, `og:url` ni `og:type` en el head inspeccionado. |
| Canonical | No observado. |

Hallazgo critico: el Congreso 2026 esta presente en contenido visual, pero el title sigue siendo generico y no captura lema, fecha, lugar ni conversion a inscripcion.

## Nuevo sitio unificado auditado

### `/index.html`

| Tag | Valor |
| --- | --- |
| Title | `Capellania Empresarial | Acompanamiento cristiano para empresas` |
| Meta description | Describe servicios: reflexion, consejeria, capacitacion y visitas. |
| H1 | `Acompanamos el mundo del trabajo con principios cristianos y cuidado integral.` |
| H2 | Servicios, Impacto 2025, Video institucional, Congreso destacado. |
| OpenGraph | `website`, site name Capellania, title/description/url especificos. |

Mejora: la Home deja de competir con Congreso y se posiciona como pagina institucional de servicios empresariales.

### `/congreso/2026.html`

| Tag | Valor |
| --- | --- |
| Title | `XVIII Congreso Cristiano 2026 | Liderar transformando` |
| Meta description | Incluye programa, horarios, costos, fecha y sede. |
| H1 | `XVIII Congreso Cristiano de Ejecutivos y Lideres` |
| H2 | Horarios del Congreso, Costos de participacion, Estacionamiento. |
| OpenGraph | `event`, Congreso Cristiano Paraguay, title/description/url especificos. |

Mejora: captura busquedas de marca, edicion anual, lema e intencion informativa antes de conversion.

### `/congreso/inscripcion.html`

| Tag | Valor |
| --- | --- |
| Title | `Inscripcion Congreso Cristiano 2026 | Reservar mi lugar` |
| Meta description | Orientada a completar datos y adjuntar comprobante. |
| H1 | `Inscripcion al Congreso` |
| H2 | Resumen del Congreso en tarjeta lateral. |
| OpenGraph | `website`, Congreso Cristiano Paraguay, title/description/url especificos. |

Mejora: pagina de conversion con metadata separada de la pagina informativa del Congreso. Evita repetir metadata institucional generica.

### `/congreso/fotos.html`

| Tag | Valor |
| --- | --- |
| Title | `Fotos y eventos | Capellania Empresarial` |
| Meta description | Galeria de congresos, almuerzos ejecutivos y retiros. |
| H1 | Galeria institucional de eventos y memoria visual. |
| H2 | Tarjetas por evento: Congreso 2025, Almuerzos Ejecutivos 2026 y Retiro. |
| OpenGraph | `website`, Capellania Empresarial, title/description/url especificos. |

Mejora: convierte la galeria en una pagina indexable y filtrable, no en miniaturas dispersas de footer.

## Mejoras tecnicas adicionales

- Se elimina dependencia editorial de sliders para contenido principal.
- Se evita parallax y animaciones pesadas que perjudican Core Web Vitals.
- La informacion de contacto queda consolidada: WhatsApp `0983 310 202` y `eventos@capellania.org.py`.
- La arquitectura queda clara: Home institucional, landing del Congreso, inscripcion y memoria de eventos.
- La metadata ya no esta cruzada entre Capellania y Congreso.
- Los CTA tienen rutas dedicadas y semantica consistente.

## Brechas pendientes recomendadas

1. Agregar `link rel="canonical"` por pagina antes de publicar.
2. Definir `og:image` optimizada para Home, Congreso 2026 y Galeria.
3. Crear `sitemap.xml` y `robots.txt` al cerrar contenido final.
4. Considerar JSON-LD `Organization` para Capellania y `Event` para Congreso 2026.
5. Revisar encoding final en servidor para garantizar UTF-8 correcto en todos los acentos.

## Conclusion

El sitio nuevo presenta una mejora SEO sustancial: pasa de dos sitios con titles genericos, metadata cruzada y poco OpenGraph a una arquitectura de informacion separada por intencion, con cabeceras semanticas y metadata contextual. La mejora mas importante es estrategica: Capellania recupera su posicionamiento institucional y el Congreso 2026 queda como flujo independiente de informacion y conversion bajo el mismo dominio.
