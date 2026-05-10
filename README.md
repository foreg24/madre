# 💝 Mother's Day Interactive Experience

Página web interactiva para el Día de las Madres con animaciones, regalo flotante, sobre giratorio, carta con flores animadas y collage de fotos dinámico.

## 📁 Estructura

```
mothers-day/
├── index1.html      # Versión 1 (Mamá)
├── index2.html      # Versión 2 (Personalizable)
├── style.css        # Estilos compartidos
├── script.js        # JavaScript compartido
├── assets1/         # Fotos y config para index1
│   ├── config.json
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── ...
└── assets2/         # Fotos y config para index2
    ├── config.json
    ├── photo1.jpg
    └── ...
```

## 🚀 Cómo usar

### 1. Agregar fotos

Coloca tus fotos en la carpeta `assets1/` (para index1) o `assets2/` (para index2).

**Nombres de archivo:**
- `photo1.jpg`, `photo2.jpg`, `photo3.jpg`... hasta `photo20.jpg`
- Formatos soportados: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

### 2. Configurar textos (opcional)

Edita `config.json` en cada carpeta assets:

```json
{
  "photos": [
    {"filename": "photo1.jpg", "caption": "Mi descripción"},
    {"filename": "photo2.jpg", "caption": "Otra foto"}
  ]
}
```

### 3. Personalizar textos

Edita `index1.html` o `index2.html` y modifica el atributo `data-config`:

```html
<script 
  src="script.js" 
  data-config='{
    "assetsPath": "./assets1",
    "envelopeTo": "Para: Mi hermosa mamá",
    "envelopeFrom": "De: Tu hij@ favorit@",
    "letterTitle": "¡Eres la mejor mamá!",
    "letterSubtitle": "Gracias por tu amor infinito",
    "letterText": [
      "Querida mamá,",
      "Tu texto personalizado aquí...",
      "Más párrafos..."
    ],
    "collageTitle": "Nuestros Momentos",
    "collageSubtitle": "Cada foto es un recuerdo lleno de amor"
  }'
></script>
```

## 📱 Responsive

- Diseño optimizado para móviles
- Touch events habilitados
- Viewport lock para evitar zoom accidental
- Soporte para orientación landscape
- `prefers-reduced-motion` para accesibilidad

## 🎨 Características

1. **Regalo flotante** - Animación de flotación con partículas doradas
2. **Sobre rojo** - Estilo postal con sello de corazón, se abre al tocar
3. **Carta** - Papel crema con texto personalizado y flores animadas
4. **Collage** - Grid dinámico que se adapta a la cantidad de fotos (1-12+)
5. **Lightbox** - Click en fotos para ver en pantalla completa
6. **Corazones flotantes** - Decoración animada en el collage
7. **Confetti** - Explosión de confeti al abrir el regalo

## 🖼️ Layout del collage según cantidad de fotos

| Fotos | Layout (móvil) | Layout (desktop) |
|-------|----------------|------------------|
| 1     | 1 columna      | 1 columna        |
| 2     | 2 columnas     | 2 columnas       |
| 3     | 2 cols (1 grande) | 3 columnas    |
| 4     | 2 columnas     | 2 columnas       |
| 5     | 2 cols (1 grande) | 3 columnas    |
| 6     | 2 columnas     | 3 columnas       |
| 7     | 2 cols (1 grande) | 3 columnas    |
| 8     | 2 columnas     | 4 columnas       |
| 9     | 3 columnas     | 3 columnas       |
| 10    | 2 columnas     | 5 columnas       |
| 11    | 3 columnas     | 4 columnas       |
| 12    | 3 columnas     | 4 columnas       |

## ⚡ Compartir JS y CSS

**¡Solo necesitas un `style.css` y un `script.js` para ambas versiones!**

La diferencia entre `index1` e `index2` está solo en:
- La carpeta de assets (`assets1` vs `assets2`)
- Los textos personalizados (pasados vía `data-config`)

No necesitas crear archivos JS/CSS separados.

## 🌐 Despliegue

Sube todo a GitHub Pages, Netlify, Vercel o cualquier hosting estático:

```bash
# Ejemplo con GitHub Pages
git init
git add .
git commit -m "Mother's Day page"
git push origin main
```

## 📝 Licencia

Uso personal libre. ¡Feliz Día de las Madres! 💕
