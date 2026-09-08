# AGENTS.md

## Proyecto y prioridad de instrucciones

Este repositorio desarrolla Capellanía Empresarial Uruguay. El código procede de
Capellanía Empresarial Paraguay como base técnica y referencia visual, no como
fuente automática de contenido institucional para Uruguay.

Las instrucciones explícitas del usuario delimitan el alcance autorizado. Dentro
de las instrucciones del repositorio, esta guía prevalece sobre `.codexrules` y
las reglas genéricas de las Skills cuando exista una contradicción.
`.codexrules` se conserva únicamente como referencia histórica: sus mandatos de
arquitectura, diseño o publicación no sustituyen esta guía.

## Arquitectura

- Mantener HTML5 estático, CSS propio y JavaScript nativo.
- Reutilizar `css/capellania-global.css`, componentes y patrones existentes.
- No introducir React, Next.js, Vue, Tailwind u otro framework sin autorización.
- Añadir dependencias solo ante una necesidad concreta y aprobada. No instalarlas
  automáticamente por sugerencia de una Skill; comprobar antes las existentes.

## Estrategia de diseño: REDESIGN / PRESERVE

El sitio actual es la referencia visual. No rediseñar desde cero salvo solicitud
expresa. Conservar como punto de partida azul marino, blanco, detalles dorados,
lenguaje sobrio y empresarial, tipografía existente y su jerarquía, espaciados
generosos, bordes y radios, sombras discretas, tarjetas y composiciones
asimétricas, calidad del Hero, responsive y sensación profesional.

La identidad definitiva podrá ajustarse con material oficial de Uruguay y dentro
del alcance aprobado. No cambiar fuentes, imponer modo oscuro, generar imágenes,
añadir efectos ni migrar arquitectura para cumplir preferencias genéricas de una
Skill. No aplicar automáticamente sus valores base de variación, movimiento o
densidad. Partir del diseño existente y adaptar solo lo necesario.

## Skills

- `$design-taste-frontend`: referencia principal para tareas visuales, siempre en
  modo de conservación del diseño existente.
- `$emil-design-eng`: referencia para interacciones, movimiento, menú móvil,
  botones y transiciones; aplicar sus principios con CSS y JavaScript nativos.
- `full-output-enforcement`: utilizar solamente cuando el usuario lo solicite
  explícitamente. La información institucional pendiente no debe inventarse para
  cumplir una exigencia de completitud.
- No utilizar `design-taste-frontend-v1` por defecto ni junto a la versión actual
  salvo solicitud explícita.
- Aplicar únicamente las partes pertinentes de cada Skill. Esta guía resuelve
  contradicciones con sus reglas genéricas y con `.codexrules`.

## Contenido: NO INVENTAR INFORMACIÓN

No inventar nombres, autoridades, teléfonos, emails, direcciones, empresas,
estadísticas, años, historia, servicios, misión, visión, valores, testimonios,
actividades, fotografías presentadas como reales ni enlaces sociales.

Cuando falte información, utilizar internamente un marcador claro de contenido
pendiente o solicitar el dato. Nunca publicar información ficticia como real ni
presentar marcadores internos como contenido definitivo.

## Paraguay y Uruguay

Todo contenido específico de Paraguay es heredado hasta que se confirme su
aplicabilidad a Uruguay. No asumir que comparten historia, estadísticas,
contactos, dirigentes, empresas, eventos, Congreso, Impulso+, fotografías,
testimonios, misión, visión, valores o servicios específicos.

Los elementos reutilizables son principalmente la arquitectura y el lenguaje
visual. Confirmar la identidad institucional y el uso de recursos antes de
presentarlos como propios de Uruguay.

## Responsive

La versión móvil tiene la misma importancia que escritorio.

- Mantener el Hero con altura automática en móvil.
- Evitar scroll horizontal y corregir su causa, sin limitarse a ocultarlo.
- Usar tipografías proporcionales y contenido legible en teléfonos pequeños.
- Compactar el espaciado sin perder jerarquía ni comodidad de lectura.
- Mantener botones táctiles suficientemente grandes y navegación móvil clara.
- Reorganizar tarjetas y columnas según el contenido de cada sección.
- No aplicar fórmulas automáticas como reducir siempre los espacios a la mitad
  ni forzar contenido a ocupar una pantalla completa.

## Movimiento

Las animaciones deben ser discretas, funcionales, rápidas y naturales.
Priorizar `transform` y `opacity`, con transiciones sobre propiedades concretas
en lugar de `transition: all`. Evitar movimiento decorativo innecesario y
animaciones continuas sin una razón clara.

Mantener `prefers-reduced-motion`. No bloquear la interacción esperando una
animación. Limitar efectos hover a dispositivos adecuados cuando corresponda.

## Accesibilidad

Mantener o mejorar HTML semántico, contraste, foco visible, navegación por teclado,
`aria-expanded` cuando corresponda, labels reales, textos alternativos, estados
de error comprensibles y soporte de movimiento reducido. No sustituir labels por
placeholders ni sacrificar legibilidad para cumplir límites estéticos de líneas.

## Imágenes y recursos

Reutilizar recursos apropiados y confirmados. No presentar fotografías de Paraguay,
stock o imágenes generadas como evidencia de actividades reales de Uruguay.
Optimizar formatos y dimensiones cuando corresponda, conservar textos alternativos
y reservar espacio para evitar saltos de contenido. Usar carga diferida para
recursos fuera de la vista inicial, sin aplicarla indiscriminadamente al Hero.

## SEO

Al adaptar una página, revisar `title`, meta description, canonical, Open Graph,
Twitter Card, favicon, alt de imágenes, URLs absolutas, robots y sitemap cuando
corresponda. Nunca dejar URLs de Paraguay accidentalmente en producción. Si el
dominio o un dato necesario no están confirmados, registrarlos como pendientes.

## Calidad visual

Antes de considerar terminada una sección:

1. Revisar composición.
2. Revisar jerarquía.
3. Revisar espaciado.
4. Revisar escritorio.
5. Revisar tablet.
6. Revisar móvil.
7. Revisar desbordes.
8. Revisar estados hover y focus.
9. Revisar movimiento reducido.
10. Revisar enlaces y recursos.

Para cambios visuales, comprobar la sección en navegador y usar capturas cuando
ayuden a evaluar el resultado. La revisión puede realizarse localmente o en una
vista previa autorizada; no exige publicar en Vercel. Informar expresamente si
alguna comprobación no pudo realizarse, sin afirmar resultados no observados.

Evitar apariencia de plantilla genérica. La página debe parecer diseñada
deliberadamente y mantener el nivel visual de la web original.

## Forma de trabajo

Trabajar por etapas y secciones. Antes de cambios estructurales importantes,
analizar, explicar y proponer; después implementar solamente el alcance aprobado.
No aprovechar una tarea pequeña para rediseñar partes no solicitadas.

Una tarea de análisis no autoriza ediciones. Una tarea de instrucciones no autoriza
cambios en HTML, CSS, JavaScript, assets, metadatos, formularios ni contenido
público. No crear, modificar o reinstalar Skills sin una solicitud que lo autorice.

## Git y publicación

No ejecutar automáticamente `git add .`, `git commit`, `git push`, merge ni deploy.
Nunca hacer push automático a `main`. Se puede mostrar el estado de Git y sugerir
un mensaje de commit, pero guardar en Git o publicar requiere decisión del usuario.

Solo realizar operaciones de escritura en Git dentro del alcance expresamente
autorizado, por ejemplo un `git mv` solicitado para normalizar un nombre. Esa
operación no autoriza staging adicional, commit ni push. Verificar el remoto antes
de cualquier publicación autorizada; este proyecto es independiente del original.

## Dependencias y servicios externos

No ejecutar formularios heredados contra servicios reales de Paraguay. No modificar
ni probar integraciones externas sin autorización. No enviar datos de prueba a
correos, WhatsApp, Apps Script u otros destinos heredados.

No instalar dependencias automáticamente salvo que sean necesarias para una tarea
aprobada y que su incorporación esté autorizada.

## Finalización de tareas

Al finalizar una implementación informar qué se modificó, qué archivos cambiaron,
qué se verificó, qué queda pendiente y los riesgos o datos faltantes relevantes.

Cuando sea posible, ejecutar una validación local o build apropiado antes de dar
por terminada la implementación, siempre que respete el alcance y no envíe
información a servicios externos. Para tareas exclusivamente documentales basta
revisar contenido, diferencias y estado de Git; no ejecutar builds que generen
archivos ajenos al alcance. No sustituir verificaciones por afirmaciones genéricas.
