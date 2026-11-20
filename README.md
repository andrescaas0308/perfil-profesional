# Portafolio · Andres Cañas

Sitio web estático de perfil profesional (HTML, CSS y JavaScript, sin build ni dependencias).

## Estructura

```
index.html            Estructura semántica, SEO y datos estructurados
css/styles.css        Estilos (mobile-first)
js/main.js            Carrusel de proyectos, menú activo, tema, formulario
assets/               Imágenes (WebP/JPG ligeras) e imagen para redes (og.jpg)
robots.txt, sitemap.xml
scripts/check.mjs     Pruebas automáticas antes de publicar
.github/workflows/    Ejecuta las pruebas en cada push
```

## Fundamentos técnicos aplicados

Tomados de la presentación "Tu Sede Digital Central".

| Fundamento | Cómo se aplica en el código |
|---|---|
| **Anatomía de una página web** (HTML como base, red de enlaces, activos multimedia) | HTML semántico: `main`, `section` con `aria-labelledby`, `article`, `nav`, `footer`. Enlaces internos por ancla y externos con `rel="noopener"`. Imágenes con `alt`, `width` y `height`. |
| **Web estática** (ideal para portafolios) | Sin servidor ni base de datos: solo archivos. El formulario arma un correo (`mailto:`) en vez de usar un backend. |
| **Mobile-first** (diseño responsivo, navegación táctil, carga ligera) | El CSS base es el de móvil y `min-width` agrega tablet (481px) y escritorio (861px). Botones y enlaces de al menos 44 px. Imágenes WebP/JPG pequeñas, `loading="lazy"`, `decoding="async"`, `fetchpriority="high"` y precarga en la foto principal. |
| **SEO** (arquitectura optimizada para buscadores) | `title`, `meta description`, `canonical`, Open Graph y Twitter Card, datos estructurados JSON-LD (`Person`), `robots.txt`, `sitemap.xml`, un solo `h1`. |
| **Atención al cliente** (formulario directo y contacto) | Formulario de contacto, WhatsApp, correo, teléfono con botón de copiar. |
| **Analítica** | Bloque de Google Analytics 4 listo en `index.html`, comentado. Ponle tu ID para activarlo. |
| **Propiedad vs. alquiler** (dominio y control propios) | El sitio no depende de una red social. Se puede mover a un dominio propio con un archivo `CNAME`. |
| **Hosting** (elegir según necesidad) | Sitio estático con tráfico moderado: GitHub Pages (gratis) es suficiente. |
| **Planos de construcción** (objetivos → investigación → wireframes → contenido → pruebas) | Ver "Pruebas" abajo. |

## Pruebas (paso 5 del plano)

```bash
node scripts/check.mjs
```

Verifica: `lang`, título, descripción, viewport, un solo `h1` y un solo `main`, `alt`/`width`/`height` en imágenes, anclas con destino, archivos locales existentes y `rel="noopener"` en enlaces externos.

Antes de publicar revisa también a mano:

- [ ] Se ve bien en móvil (390 px), tablet y escritorio.
- [ ] El carrusel de proyectos se desliza con el dedo.
- [ ] El formulario abre el correo con el mensaje armado.
- [ ] Los enlaces a Noriant Studio, Certiobra, GitHub y LinkedIn abren bien.
- [ ] Lighthouse (Chrome DevTools) con buen puntaje en Rendimiento, Accesibilidad y SEO.

## Ver en local

Abre `index.html` en el navegador. Las fuentes (Google Fonts) necesitan internet.

## Publicar con GitHub Pages

1. Sube el contenido al repositorio `perfil-profesional`.
2. En GitHub: Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/ (root)`.
3. El sitio queda en `https://andrescaas0308.github.io/perfil-profesional/`.

## Pendiente de completar

- Confirmar el texto de "Qué pidieron" de cada proyecto.
- ID de Google Analytics, si quieres medir visitas.
- El enlace de WhatsApp asume el prefijo de Colombia (+57).
