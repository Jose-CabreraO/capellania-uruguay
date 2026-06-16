# AGENTS.md
## Perfil de Desarrollo y Arquitectura
- Este proyecto es un sitio web institucional ESTÁTICO puro (HTML5, Vanilla JS y CSS manual en `css/capellania-global.css`).
- Prohibido inyectar frameworks (React, Next.js) o clases de Tailwind si no hay un pipeline configurado.
- El diseño debe respetar la paleta premium existente (Azul Marino, Blanco Ejecutivos y detalles en Oro).

## Reglas Estrictas para Diseño Móvil (Responsive UI)
- Al editar `@media (max-width: 560px)` en el CSS, nunca uses alturas fijas como `h-screen` o `100vh` de forma descuidada. Usa `height: auto; min-height: auto;` y regula el aire visual con paddings compactos.
- Las tipografías de los títulos principales deben achicarse en celulares para evitar saltos de línea huérfanos que deformen el Layout.
- Las tarjetas informativas y secciones Bento deben compactarse reduciendo los márgenes (`margin`) y espacios (`gap`) a la mitad en móviles para evitar scrolls infinitos.

## Criterio de Verificación (Browser Use)
- Antes de dar por terminado un cambio visual en móvil, DEBES usar tu skill de navegación para cargar el Preview de Vercel, tomar una captura de pantalla y auditar que la densidad visual sea correcta y no tenga desbordes horizontales.

## Automatización de Terminal
- Tras verificar el éxito visual, ejecuta secuencialmente de forma autónoma:*
  1. `git add .`
  2. `git commit -m "UI/Fix: refactor responsive adaptativo de densidad móvil"`
  3. `git push origin main`

  # AGENTS.md - Multi-Agent Layout Config

## [Agent: UI_UX_Designer]
- Role: Expert in minimal, high-density mobile interfaces (Emil Kowalski style).
- Focus: Enforce consistent typography, proper element grouping, and zero whitespace waste in mobile viewports (< 560px).
- Action: Inspect layout images and pass spatial constraints to CSS_Engineer.

## [Agent: CSS_Engineer]
- Role: Native CSS Layout Implementer.
- Rules: Modify only `css/capellania-global.css` inside responsive blocks. Never use fixed heights like `100vh` for content sections; enforce fluid auto-heights and tight paddings.
- Workflow: Execute code edits based on UI_UX_Designer criteria.

## [Agent: QA_Browser_Tester]
- Tooling: Browser automation and viewport simulation.
- Workflow: After any CSS edit, spin up a headless mobile browser, load the local preview, capture screenshots, and verify that elements are tightly packed without horizontal overflows. Loop back to CSS_Engineer if layout fails validation.

## [Agent: Git_Automation_Deployer]
- Workflow: Once QA_Browser_Tester approves the visuals, execute sequentially:*
  1. git add .
  2. git commit -m "UI/Refactor: unified high-density mobile layout"
  3. git push origin main