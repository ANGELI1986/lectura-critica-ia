# Lectura Crítica Aumentada con IA

Plataforma web del proyecto pedagógico integrador.
**I.E. María Antonia Penagos** · Palmira, Valle del Cauca.

## Despliegue en Vercel (paso a paso)

### Opción A: Desde GitHub (recomendado)

1. Crea una cuenta en [GitHub](https://github.com) si no tienes una.
2. Crea un repositorio nuevo y sube esta carpeta completa.
3. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
4. Haz clic en **"Add New Project"**.
5. Selecciona el repositorio que acabas de crear.
6. Vercel detectará automáticamente que es un proyecto Vite+React.
7. Haz clic en **"Deploy"** y espera unos segundos.
8. Vercel te dará una URL pública (ejemplo: `lectura-critica-ia.vercel.app`).

### Opción B: Desde tu computador con CLI

1. Instala Node.js desde [nodejs.org](https://nodejs.org) (versión 18+).
2. Abre la terminal y navega a esta carpeta:
   ```bash
   cd lectura-critica-ia
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Para probar localmente:
   ```bash
   npm run dev
   ```
5. Instala Vercel CLI:
   ```bash
   npm install -g vercel
   ```
6. Despliega:
   ```bash
   vercel
   ```
7. Sigue las instrucciones en pantalla. Vercel te dará la URL pública.

## Estructura del proyecto

```
lectura-critica-ia/
├── index.html          ← Página HTML principal
├── package.json        ← Dependencias
├── vite.config.js      ← Configuración de Vite
├── vercel.json         ← Configuración de Vercel
├── public/             ← Archivos estáticos
└── src/
    ├── main.jsx        ← Punto de entrada React
    ├── App.jsx         ← Componente principal (toda la app)
    └── index.css       ← Estilos globales
```

## Funcionalidades

- **Inicio**: Landing del proyecto con información general.
- **Estudiantes**: Actividades, guía de prompts, trivia interactiva, diario de IA, matriz comparativa, sistema de insignias.
- **Docentes**: Panel con KPIs, tablero Scrum, rúbrica de referencia, últimos diarios.
- **Familias**: Información accesible, preguntas frecuentes, datos de contacto.

## Notas técnicas

- Los datos de estudiantes (diarios, trivias, matrices) se guardan en **localStorage** del navegador.
- La trivia tiene 15 preguntas en tres niveles que se muestran aleatoriamente (8 por ronda).
- No requiere backend ni base de datos.
- Funciona en móviles y computadores.
