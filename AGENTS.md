# AGENTS.md — Legnosur

Sitio estático de una sola página para Legnosur (fábrica de bases de sommier y
colchones). Sin framework, sin bundler, sin dependencias.

## Reglas de trabajo (obligatorias)

- **Nunca** hacer push a `main` ni merge. Trabajar en una rama nueva con el
  nombre indicado.
- No borrar ni mover archivos. Si algo parece sobrar, listarlo y preguntar.
- No instalar programas ni dependencias, ni agregar frameworks.
- Antes de cambiar muchos archivos, mostrar el plan y esperar OK.
- El repo es **público**: no subir listas de precios mayoristas, contratos ni
  claves.
- Cambios mínimos: editar lo existente, no reescribir archivos completos.
- No inventar datos ni textos. Lo que falte va como `TODO:` y se lista al final.
- Responder en español simple, máximo 10 líneas.

## Producción

- **Sitio:** https://legnosur.com.ar
- **Hosting:** Vercel, sirve los archivos estáticos del repo de GitHub
  `gisellekaplun/legnosur`, rama `main`.
- **Deploy:** se dispara al subir a `main`. No hay build step.

## Estructura

```
index.html          # página única (header, hero, beneficios, nosotros, productos,
                    # catálogo, contacto, footer). La sección "Marcas" está
                    # comentada a propósito (ver "Pendientes")
styles.css          # todo el CSS, un solo archivo
main.js             # toggle del menú mobile + ocultar nav/banner al scrollear
favicon.ico         # OJO: va en la RAÍZ, no en assets/img
assets/
  catalogo.pdf      # catálogo descargable (ver "Pendientes")
  fonts/            # teXgyrebonum-*.otf, poppins-*.woff2
  img/              # fotos, logos, favicon-16/32/48/192/512.png, apple-touch-icon.png
```

`index.html` carga `styles.css` y `main.js` con rutas **relativas** desde la
raíz. Las páginas nuevas van en subcarpetas con su propio `index.html` (ej.
`/productos/colchones/espuma/index.html`) y deben usar rutas **desde la raíz**
(`/styles.css`, `/assets/img/...`), no relativas. Migrar las rutas relativas
actuales es un pendiente (ver "Pendientes").

## Cómo previsualizar

No hay servidor de desarrollo. El sitio anda abriendo el archivo directo:

```sh
open -a "Google Chrome" index.html
```

No hay `npm install`, `npm run dev`, tests ni linter. No inventar scripts.

## Deploy

1. Editar archivos localmente.
2. Subirlos al repo de GitHub (rama `main`).
3. Vercel redeploya solo.

**No se puede usar `git` en esta máquina:** falta el Command Line Tools de Xcode
(`xcode-select -p` falla). La subida se hace por la interfaz web de GitHub.
Tampoco hay `python3`, `node`, `npm`, `imagemagick` ni `fontforge`.

## Verificación de cambios

La forma de verificar es Chrome headless. Ruta del binario:

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

Ejemplo: extraer estilos computados y contrastes reales del DOM renderizado:

```sh
cp index.html /tmp/check.html
cat >> /tmp/check.html <<'EOF'
<pre id="R"></pre><script>
window.addEventListener('load', async () => {
  await document.fonts.ready;
  const cs = s => getComputedStyle(document.querySelector(s));
  document.getElementById('R').textContent =
    'titulo=' + cs('.hero__title').fontFamily +
    ' fondo=' + cs('body').backgroundColor;
});
</script>
EOF
"$CHROME" --headless=new --disable-gpu --window-size=1440,900 \
  --virtual-time-budget=6000 --dump-dom "file:///tmp/check.html" \
  2>/dev/null | sed -n '/<pre id="R">/,/<\/pre>/p' | sed 's/<[^>]*>//g'
```

**Trampas conocidas de Chrome headless (me costaron diagnósticos falsos):**

- `--window-size` tiene un **mínimo de 500px** de `innerWidth`. No se pueden
  probar media queries de ≤420px directamente; hay que copiar el CSS a `/tmp`
  y subir el breakpoint para simularlo.
- El reloj virtual **no avanza las transiciones CSS**. Un menú que "no abre"
  puede estar funcionando: leer `classList` en vez de `getPropertyValue('right')`.
- `document.scrollWidth` reporta overflow de elementos `position: fixed` que
  **no generan scroll real**. La prueba válida es `window.scrollTo(9999,0)`
  seguido de `window.scrollX`.
- Los scripts `<script>` se ejecutan en orden: las variables globales hay que
  definirlas en un `<script>` **anterior** al que las usa.

**Con imágenes:** no hay ImageMagick, pero sí `sips` (nativo de macOS), que
redimensiona y escribe PNG y `com.microsoft.ico`. Para un `.ico` multi-tamaño
hay que armar el contenedor a mano (header + directorio + PNGs embebidos),
porque `sips` solo genera un tamaño por archivo.

## Diseño

### Colores (tokens en `:root` de `styles.css`)

Paleta de marca: teal `#719196`, ámbar `#F4B74A`, teal profundo `#2E4A4F`
(propuesto), blanco.

| Token | Valor | Uso |
|---|---|---|
| `--azure` | `#719196` | teal de marca. Hoy NO se usa de fondo |
| `--azure-light` | `#A9C0C3` | variante clara del teal |
| `--teal-profundo` | `#2E4A4F` | **propuesto, sin uso todavía**. Texto sobre fondos claros |
| `--dark` | `#2B4A52` | fondo principal |
| `--dark-soft` | `#24474F` | fondo de secciones alternas |
| `--dark-card` | `#1B3A44` | fondo de tarjetas |
| `--dark-border` | `#6C9BA2` | bordes |
| `--gold` | `#F4B74A` | ámbar: botones, acentos, íconos |
| `--gold-light` | `#F8CE7D` | extremo del gradiente de botones |
| `--ink` | `#0E2429` | texto sobre ámbar y sobre fondos claros |
| `--gray` | `#DCE7E9` | texto principal |
| `--gray-soft` | `#AFC4C8` | texto secundario |

**Reglas de color:**

- El sitio es **oscuro**: fondo oscuro con texto claro. La regla "texto teal
  profundo sobre fondo claro" aplica **solo a tarjetas o secciones claras
  nuevas**, no es un rediseño.
- Botones: fondo ámbar + texto teal profundo. Hoy usan `--ink` (`#0E2429`);
  pasarlos a `--teal-profundo` es un pendiente.
- No unificar los azules sin autorización: `--dark`, `--dark-soft`,
  `--dark-card` y los hardcodeados `#33565E` y `#2F525A` se mantienen.

**Contraste (AA) — regla dura:**

- Texto normal necesita **4.5:1**; íconos y texto ≥24px (o ≥18.66px en negrita),
  **3:1**.
- El ámbar `#F4B74A` **solo se lee sobre fondos oscuros**. Sobre `--azure`
  (`#719196`) da **1.89:1** y es ilegible; nunca poner ámbar sobre azul claro.
- Blanco sobre ámbar da **1.79:1**: nunca.
- Medido en el sitio real (muestreo de píxeles del fondo), los **20 usos de
  ámbar** (sin contar el banner) van de **5.21 a 9.38**, todos cumplen AA. Por
  eso el brief dice "evitar ámbar como texto", pero donde ya existe se
  mantiene: no es un problema de contraste. El banner superior es una
  **excepción aprobada**.
- Antes de cambiar un color de fondo o de texto, medir el contraste real como
  se muestra en "Verificación de cambios". No confiar en el valor a ojo.

### Tipografía

- **Títulos** (`.hero__title`, `.section-title`, `.beneficio__title`,
  `.stat__num`, `.producto-card__title`, `.catalogo__title`): TeX Gyre Bonum,
  `font-family: var(--font-display)`, peso **700**.
- **Todo el resto** (cuerpo, navegación, botones, párrafos): Poppins,
  `font-family: var(--font-sans)`. Pesos disponibles: 300, 400, 500.
- TeX Gyre Bonum está en **OTF** (`assets/fonts/texgyrebonum-*.otf`), no en
  WOFF2, porque no hay conversor en esta máquina. Bonum solo tiene pesos
  **400 y 700**; pedir 500 o 600 cae a 400 y los títulos pierden cuerpo.
- Poppins está en WOFF2 (300/400/500) descargado de Google Fonts.

### Marca y contenido

- **Voseo rioplatense**: "Conocé", "Escribinos", "despejá". No usar tuteo.
- Usar la frase **"Fabricación propia"**.
- **Bases de sommier: solo mayoristas.** Colchones y sommiers se venden por
  mayor y menor. El sitio NO es solo mayorista.
- **Sin banners de descuento.**
- Estilo visual de referencia: saatva.com (mucho aire, fotos grandes y
  luminosas).
- **No mostrar logos de terceros** (La Cardeuse, Springwall) sin autorización
  confirmada.
- Contacto: Alejandro Korn, Buenos Aires · Instagram `@legnosur.arg`.
- WhatsApp: `https://wa.me/5491135466210?text=<mensaje codificado>`.

## Convenciones

- CSS en un solo archivo `styles.css`, con variables para todo lo repetible.
- Nombres tipo BEM: `.bloque__elemento`, `.bloque--modificador`.
- **No agregar comentarios** salvo que sean necesarios para explicar una
  decisión no obvia (por ejemplo, el porqué de un color por contraste).
- Textos, comentarios y nombres de clases en español.
- Al cambiar `styles.css`, preferir los tokens de `:root` antes que colores
  hardcodeados.

## Pendientes conocidos

- **Redirecciones temporales a WhatsApp.** Todo enlace cuyo destino todavía no
  existe apunta a `https://wa.me/5491135466210`. Son dos grupos, cada uno con
  un `TODO` en el HTML que indica a dónde volver:
  - *Catálogo* (nav, hero y sección catálogo) → `assets/catalogo.pdf`, que hoy
    es un **PDF vacío** (193 B, una página en blanco). Falta el definitivo.
  - *Modelos de producto* (las 3 tarjetas: colchones, sommiers, bases) → una
    futura sección de modelos dentro de la página.
- `favicon-192.png` y `favicon-512.png` no están referenciados porque no hay
  `manifest.json`. Si se quiere soporte de PWA/Android, crear el manifest.
- **Sección "Marcas" oculta.** Por falta de autorización para mostrar logos de
  terceros, en `index.html` quedaron comentados: los 2 logos, la sección
  completa y el ítem "Marcas" del nav. Los archivos `la-cardeuse.png` y
  `springwall.png` siguen en `assets/img/`. Para reactivar: quitar los
  delimitadores de comentario de la sección y descomentar el ítem del nav.
- `--teal-profundo: #2E4A4F` está declarado pero **sin uso**. Falta definir
  dónde se aplica.
- Los botones (`.btn--primary`, `.nav__link--cta`) usan texto `--ink`; el brief
  pide `--teal-profundo`.
- Migrar las rutas relativas de `index.html` y `styles.css` a rutas desde la
  raíz, para que funcionen las subcarpetas de productos.
- Archivos sin usar en el repo (**NO borrar**: solo listar y preguntar): en la
  raíz `V2sinfoto.png` (2.4 MB), `banner-v2.jpg`, `la-cardeuse.png`,
  `springwall.png`; en `assets/img/` un `index.html`, `main.js` y `styles.css`
  viejos (con la paleta anterior) y los `switzer-*.woff2`.
