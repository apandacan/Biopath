// Build step: concatenate source files into a single self-contained index.html
// Run: node build.js
//
// SOURCES (edit these — never edit index.html directly):
//   style.css     — all styles
//   body.html     — page body markup (sidebar + canvas containers)
//   data.js       — NODES, EDGES, PATHWAYS, PANELS, WATERMARKS, TITLE
//   clinical.js   — CLIN, CLIN_PATHWAY, CLIN_VITAMIN, VIT_COLOR
//   tutor.js      — TUTOR (ordered lesson array for guided walkthrough)
//   app.js        — rendering + interaction + pan/zoom + tutor state machine
//
// OUTPUT:
//   index.html (everything inlined so the preview panel can load it)

const fs = require('fs');
const path = require('path');
const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Step 1 Biochem — Integrated Metabolic Map</title>
<style>
${read('style.css')}
</style>
</head>
<body>
${read('body.html')}
<script>
${read('data.js')}
${read('clinical.js')}
${read('tutor.js')}
${read('app.js')}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log('Built index.html  ·  ' + html.length.toLocaleString() + ' bytes');
