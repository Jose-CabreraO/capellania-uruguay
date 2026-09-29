# Trabajo de imágenes para la galería

Lee y respeta `AGENTS.md` antes de realizar cambios.

Tu responsabilidad en esta tarea se limita a las imágenes de la galería de
Capellanía Empresarial Uruguay:

- Coloca las imágenes aprobadas en `assets/images/galeria/`.
- Convierte fotografías a WebP, conserva una calidad visual alta y evita archivos
  innecesariamente pesados.
- Usa nombres en minúsculas, sin espacios y descriptivos.
- No presentes fotografías de Paraguay, stock o material no confirmado como
  actividades de Uruguay.
- No inventes títulos, fechas, categorías, descripciones ni textos alternativos.
- Completa `assets/data/galeria.json` únicamente con información proporcionada o
  validada por el usuario.
- No modifiques `index.html`, `galeria/index.html`, CSS, JavaScript, contactos,
  metadatos ni otras páginas para esta tarea.
- No hagas `git add`, commit, push ni deploy sin autorización explícita.

Cada elemento de `assets/data/galeria.json` requiere `src` y un texto `alt`
objetivo que describa solamente lo visible. Los demás campos son opcionales y
solo deben agregarse cuando exista información confirmada:

```json
{
  "src": "/assets/images/galeria/nombre-confirmado.webp",
  "alt": "Descripción objetiva de lo visible en la fotografía",
  "title": "Título confirmado opcional",
  "category": "identificador-en-minusculas",
  "categoryLabel": "Etiqueta visible confirmada",
  "date": "Fecha confirmada o cadena vacía",
  "description": "Descripción confirmada o cadena vacía"
}
```

Después de incorporar imágenes, ejecuta `npm run build` y comprueba `/galeria/`
en escritorio y móvil. La página debe seguir funcionando si el JSON está vacío.
