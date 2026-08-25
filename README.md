# VoltBici

Comparativa de bicicletas eléctricas para Amazon.it (proyecto React + Vite).

## 1. Antes de publicar

- Abre `src/App.jsx`, busca la línea `const AFFILIATE_TAG = "tuotag-21";` cerca del principio y sustitúyela por tu Tracking ID real de Amazon Associates Italia (termina en `-21`).
- Revisa `/mnt/... legale` (la página "Legale" dentro de la app) — ya incluye el aviso de afiliación obligatorio, pero cambia el email de contacto de ejemplo por el tuyo real.
- Los precios y algunas especificaciones marcadas "~" son estimaciones: verifícalas en Amazon antes de publicar.

## 2. Probar en local (necesitas Node.js 18+ instalado)

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`).

## 3. Subir a GitHub

```bash
git init
git add .
git commit -m "VoltBici - primera versión"
```

Crea un repositorio nuevo en GitHub (puede ser privado) y sigue las instrucciones que te da GitHub para conectar tu carpeta local:

```bash
git remote add origin https://github.com/TU-USUARIO/voltbici.git
git branch -M main
git push -u origin main
```

## 4. Desplegar gratis en Vercel (recomendado, lo más rápido)

1. Ve a https://vercel.com y entra con tu cuenta de GitHub.
2. "Add New Project" → elige el repositorio `voltbici`.
3. Vercel detecta automáticamente que es un proyecto Vite. No necesitas cambiar nada, solo pulsa "Deploy".
4. En 1-2 minutos te dará una URL pública tipo `https://voltbici.vercel.app`.
5. Esa es la URL que puedes poner en el formulario de Amazon Associates ("Your Websites and Mobile Apps").

### Alternativa: Netlify

1. https://netlify.com → "Add new site" → "Import an existing project" → conecta el repo.
2. Build command: `npm run build`  ·  Publish directory: `dist`
3. Deploy.

## 5. Dominio propio (opcional pero recomendable)

Tanto Vercel como Netlify permiten conectar un dominio propio (ej. `voltbici.it`) gratis en su plan gratuito, desde la pestaña "Domains" del proyecto. Un dominio `.it` cuesta unos 10-15€/año en registradores como Namecheap o Register.it.

## 6. Después de publicar

- Vuelve al formulario de Amazon Associates y pon la URL final.
- Amazon te dará una cuenta "en prueba": tienes 180 días para conseguir 3 ventas cualificadas o te dan de baja del programa, así que conviene solicitarlo cuando la web ya esté online.
- Recuerda que el catálogo (`BIKES` dentro de `src/App.jsx`) usa enlaces de búsqueda a Amazon con tu tag; en cuanto tengas los ASIN reales de cada producto, puedes cambiar la función `buyLink()` para apuntar directo a la ficha de cada producto.
