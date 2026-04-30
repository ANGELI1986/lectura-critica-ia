import { useState, useEffect } from "react";

// ==================== DATA ====================
const TRIVIA_BANK = [
  { q: "¿Cuál es la función principal de una idea secundaria en un texto?", opts: ["Contradecir la idea principal", "Ampliar, explicar o ejemplificar la idea principal", "Resumir el texto completo", "Presentar la opinión del autor"], correct: 1, level: "Literal" },
  { q: "¿Qué significa 'contrastar fuentes'?", opts: ["Leer un solo texto con atención", "Comparar la información de dos o más fuentes para encontrar similitudes y diferencias", "Copiar la información de internet", "Buscar la fuente más reciente"], correct: 1, level: "Literal" },
  { q: "¿Qué es un 'sesgo' en una fuente de información?", opts: ["Un error de ortografía", "Una tendencia a favorecer cierta perspectiva sobre otras", "Un resumen muy corto", "Una opinión popular"], correct: 1, level: "Literal" },
  { q: "¿Cuál de estas es una pregunta literal sobre un texto?", opts: ["¿Qué quiso decir el autor realmente?", "¿En qué año ocurrió el evento mencionado?", "¿Qué habría pasado si el evento no hubiera ocurrido?", "¿Está el autor sesgado?"], correct: 1, level: "Literal" },
  { q: "¿Qué tipo de fuente es un testimonio oral de un sobreviviente?", opts: ["Fuente secundaria", "Fuente terciaria", "Fuente primaria", "Fuente ficticia"], correct: 2, level: "Literal" },
  { q: "Si un texto sobre el conflicto colombiano solo menciona acciones de un grupo armado y omite las de otro, ¿qué puedes inferir?", opts: ["El otro grupo no existió", "El autor podría tener un sesgo o una perspectiva parcial", "El texto es muy corto", "Solo un grupo fue responsable"], correct: 1, level: "Inferencial" },
  { q: "Un autor escribe: 'El progreso llegó inevitablemente a la región'. ¿Qué palabra revela una posición subjetiva?", opts: ["Progreso", "Región", "Llegó", "Inevitablemente"], correct: 3, level: "Inferencial" },
  { q: "Si NotebookLM responde diferente a Claude sobre el mismo evento histórico, ¿a qué se debe probablemente?", opts: ["Una de las dos está dañada", "NotebookLM responde solo con los documentos cargados mientras Claude usa conocimiento general", "Claude siempre tiene razón", "Las dos copian de Wikipedia"], correct: 1, level: "Inferencial" },
  { q: "Un estudiante formula la pregunta '¿Qué pasó en el Bogotazo?' y obtiene un resumen general. ¿Cómo podría reformular para obtener información más profunda?", opts: ["Hacer la misma pregunta en mayúsculas", "Preguntar '¿Qué versiones contradictorias existen sobre quién inició la violencia el 9 de abril?'", "Preguntar '¿Es verdad el Bogotazo?'", "Copiar la respuesta y pedir más"], correct: 1, level: "Inferencial" },
  { q: "Si la IA dice que un evento 'fue positivo para el país' sin matices, ¿qué debería hacer un lector crítico?", opts: ["Aceptarlo porque la IA tiene mucha información", "Preguntar: ¿positivo para quién? ¿Hubo afectados negativamente?", "Ignorar esa parte", "Cambiar de IA"], correct: 1, level: "Inferencial" },
  { q: "¿Por qué es importante que el estudiante escriba su hipótesis ANTES de consultar la IA?", opts: ["Para tener algo que copiar después", "Porque así demuestra que puede pensar independientemente y luego contrasta con la IA", "Porque el docente lo exige", "Para ahorrar tiempo"], correct: 1, level: "Crítico" },
  { q: "¿Cuándo es más riesgoso confiar en la IA sin verificar?", opts: ["Cuando responde rápido", "Cuando da cifras específicas, nombres o datos verificables sobre eventos complejos", "Cuando la respuesta es corta", "Cuando usa un lenguaje formal"], correct: 1, level: "Crítico" },
  { q: "Un estudiante copia la respuesta de ChatGPT, le cambia tres palabras y la presenta como propia. ¿Esto es honestidad académica?", opts: ["Sí, porque cambió palabras", "No, porque no transformó la información ni la contrastó con fuentes", "Sí, si la respuesta es correcta", "Depende de la materia"], correct: 1, level: "Crítico" },
  { q: "¿Qué limitación fundamental tiene la IA generativa como fuente de información histórica?", opts: ["No sabe leer", "Puede generar información plausible pero incorrecta (alucinaciones) y no distingue entre fuentes confiables e inconfiables", "Solo funciona en inglés", "Siempre da la misma respuesta"], correct: 1, level: "Crítico" },
  { q: "Si pudieras usar solo UNA estrategia para verificar lo que dice la IA, ¿cuál sería la más efectiva?", opts: ["Preguntar a otra IA", "Buscar la misma información en una fuente académica reconocida", "Leer la respuesta con cuidado", "Confiar si suena bien escrita"], correct: 1, level: "Crítico" },
];

const PROMPTS_GUIDE = [
  { title: "Pregunta vaga vs. pregunta precisa", bad: "¿Qué pasó en Colombia?", good: "¿Cuáles fueron las tres principales causas económicas del conflicto armado colombiano entre 1948 y 1958 según fuentes académicas?", why: "La pregunta precisa delimita tema, período, enfoque y tipo de fuente. La IA responde con más profundidad y menos generalidades." },
  { title: "Pedir perspectivas múltiples", bad: "¿El Frente Nacional fue bueno?", good: "¿Qué argumentos dan los defensores y los críticos del Frente Nacional? ¿Qué grupos se beneficiaron y cuáles quedaron excluidos?", why: "Pedir múltiples perspectivas evita que la IA dé una sola versión. Te obliga a ti a evaluar las diferentes posiciones." },
  { title: "Detectar lo que falta", bad: "Resúmeme este tema", good: "¿Qué información importante podría estar faltando en tu respuesta? ¿Qué voces o perspectivas no estás incluyendo?", why: "Esta pregunta metacognitiva hace que la IA reconozca sus propias limitaciones, lo que te da pistas sobre dónde buscar más." },
  { title: "Verificación cruzada", bad: "¿Es verdad que...?", good: "Según fuentes académicas, ¿qué evidencia existe a favor y en contra de la afirmación de que [X]?", why: "En lugar de pedir confirmación (la IA tiende a confirmar), pides evidencia en ambas direcciones, lo que te permite formar tu propia opinión." },
  { title: "Reformular cuando la respuesta es pobre", bad: "(Conformarse con la primera respuesta)", good: "Tu respuesta es muy general. Dame ejemplos específicos con nombres, fechas y fuentes. Si no los tienes, dímelo.", why: "La IA mejora cuando le das retroalimentación. Reformular es una habilidad clave: no aceptes la primera respuesta como definitiva." },
];

const BADGES = [
  { name: "Lector Atento", icon: "📖", req: "80%+ en preguntas literales (3 trivias)", color: "#3182CE", key: "literal" },
  { name: "Detective de Ideas", icon: "🔍", req: "70%+ en preguntas inferenciales (3 trivias)", color: "#805AD5", key: "inferencial" },
  { name: "Pensador Crítico", icon: "🧠", req: "70%+ en preguntas críticas (3 trivias)", color: "#D69E2E", key: "critico" },
  { name: "Maestro de la IA", icon: "🤖", req: "5 diarios de interacción con calidad", color: "#0D7377", key: "diarios" },
];

const ACTIVITIES = [
  { title: "Investigadores del Pasado", grade: "Grado 9°", tool: "NotebookLM", color: "#0D7377", desc: "Analiza fuentes históricas, formula preguntas a la IA y compara con tu lectura propia.", steps: ["Lee las 3 fuentes del docente con atención", "Subraya ideas principales y contradicciones", "Formula 5 preguntas que vayan más allá de lo literal", "Escribe tu hipótesis ANTES de consultar la IA", "Ingresa a NotebookLM y formula tus preguntas", "Compara cada respuesta con tu lectura propia", "Escribe tu texto argumentativo (mín. 15 líneas)"] },
  { title: "El Detector de Sesgos", grade: "Grado 8°", tool: "ChatGPT + Claude", color: "#C8962E", desc: "Compara respuestas de dos IAs a la misma pregunta. Detecta sesgos, omisiones y enfoques.", steps: ["Acuerda con tu grupo la pregunta central", "Formula la misma pregunta en ChatGPT y Claude", "Completa la Matriz de Análisis (pestaña Matriz)", "Verifica un dato con fuente académica confiable", "Escribe tu conclusión personal (mín. 10 líneas)", "Participa en la reflexión grupal"] },
  { title: "Desafío de Lectura Crítica", grade: "Grados 6°-9°", tool: "Trivia con IA", color: "#1B3A5C", desc: "Trivia interactiva con preguntas en tres niveles. Acumula puntos y gana insignias.", steps: ["Lee el texto de la semana", "Responde la trivia (pestaña Trivia)", "Revisa tus errores y entiende por qué", "Acumula puntos para tus insignias"] },
];

// ==================== STORAGE ====================
function loadData(key, fallback) {
  try {
    const d = localStorage.getItem(`lca_${key}`);
    return d ? JSON.parse(d) : fallback;
  } catch { return fallback; }
}
function saveData(key, value) {
  try { localStorage.setItem(`lca_${key}`, JSON.stringify(value)); } catch {}
}

// ==================== COMPONENTS ====================
function Nav({ page, setPage }) {
  const items = [
    { key: "home", label: "Inicio", icon: "🏠" },
    { key: "students", label: "Estudiantes", icon: "📚" },
    { key: "teachers", label: "Docentes", icon: "📊" },
    { key: "families", label: "Familias", icon: "👨‍👩‍👧" },
  ];
  return (
    <nav className="nav">
      <div className="nav-brand">
        <span className="nav-brand-icon">🎯</span>
        <span className="nav-brand-name">LCA con IA</span>
      </div>
      <div className="nav-links">
        {items.map(it => (
          <button key={it.key} className={`nav-btn ${page === it.key ? 'active' : ''}`} onClick={() => setPage(it.key)}>
            <span className="nav-btn-icon">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function Home({ setPage }) {
  return (
    <div>
      <div className="hero" style={{ background: 'linear-gradient(135deg, #0F2440 0%, #1B3A5C 50%, #0D7377 100%)', padding: '70px 20px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(200,150,46,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: '#E8B84D', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 14, fontWeight: 600 }}>Diplomado en Gestión de Proyectos · Talento Tech</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 5vw, 46px)', color: '#fff', margin: '0 0 14px', lineHeight: 1.15, fontWeight: 800 }}>
            Lectura Crítica<br /><span style={{ color: '#E8B84D' }}>Aumentada con IA</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, lineHeight: 1.6, maxWidth: 540, margin: '0 auto 30px' }}>
            Estrategia pedagógica que transforma el uso de la IA en el aula: de copiar respuestas a pensar críticamente. Ciencias Sociales + Tecnología.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setPage('students')} style={{ background: '#C8962E', color: '#fff', border: 'none', padding: '13px 26px', borderRadius: 10, fontSize: 14, fontWeight: 700, boxShadow: '0 4px 15px rgba(200,150,46,0.35)' }}>Soy Estudiante →</button>
            <button onClick={() => setPage('teachers')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '13px 26px', borderRadius: 10, fontSize: 14, fontWeight: 600, backdropFilter: 'blur(4px)' }}>Panel Docente →</button>
            <button onClick={() => setPage('families')} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)', padding: '13px 26px', borderRadius: 10, fontSize: 14, fontWeight: 500 }}>Familias</button>
          </div>
        </div>
      </div>
      <div className="stats-grid" style={{ maxWidth: 880, margin: '0 auto', padding: '36px 20px 0' }}>
        {[{ n: '1.000+', l: 'Estudiantes', i: '👩‍🎓' }, { n: '2', l: 'Áreas articuladas', i: '🔗' }, { n: '3', l: 'Herramientas IA', i: '🤖' }, { n: '18', l: 'Semanas', i: '📅' }].map((s, i) => (
          <div key={i} className="card stat-card"><div style={{ fontSize: 26 }}>{s.i}</div><div className="stat-number" style={{ color: 'var(--navy)' }}>{s.n}</div><div className="stat-label">{s.l}</div></div>
        ))}
      </div>
      <div className="page" style={{ paddingTop: 12 }}>
        <h2 style={{ fontSize: 26, textAlign: 'center', marginBottom: 20 }}>¿Cómo funciona?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { t: 'Leer', d: 'Textos seleccionados por el docente: fuentes históricas, artículos, documentos.', i: '📖', c: '#0D7377' },
            { t: 'Preguntar', d: 'Formular preguntas precisas a la IA. Aprender a hacer buenos prompts.', i: '❓', c: '#C8962E' },
            { t: 'Contrastar', d: 'Comparar respuestas de la IA con las fuentes. Detectar sesgos y errores.', i: '⚖️', c: '#805AD5' },
            { t: 'Argumentar', d: 'Escribir conclusiones propias con evidencia. La IA es herramienta, no reemplazo.', i: '✍️', c: '#1B3A5C' },
          ].map((c, i) => (
            <div key={i} className="card" style={{ padding: 22, borderTop: `4px solid ${c.c}` }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.i}</div>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>{c.t}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.6 }}>{c.d}</p>
            </div>
          ))}
        </div>
        <h2 style={{ fontSize: 22, textAlign: 'center', marginBottom: 16 }}>Herramientas de IA</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { n: 'NotebookLM', r: 'Análisis de fuentes controladas', w: 'Solo responde con documentos cargados', i: '📓' },
            { n: 'ChatGPT', r: 'Contraste de perspectivas', w: 'Conocimiento general amplio', i: '💬' },
            { n: 'Claude', r: 'Diseño pedagógico + contraste', w: 'Respuestas matizadas y extensas', i: '🧩' },
          ].map((t, i) => (
            <div key={i} style={{ background: 'var(--warm)', borderRadius: 12, padding: 18, border: '1px solid rgba(200,150,46,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span style={{ fontSize: 20 }}>{t.i}</span><strong style={{ color: 'var(--navy)', fontSize: 14 }}>{t.n}</strong></div>
              <p style={{ fontSize: 13, color: 'var(--text)', margin: '0 0 4px', fontWeight: 600 }}>{t.r}</p>
              <p style={{ fontSize: 12, color: 'var(--text-light)', margin: 0 }}>{t.w}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, textAlign: 'center', padding: '20px 0', borderTop: '2px solid #E2E8F0' }}>
          <p style={{ fontSize: 14, color: 'var(--text-light)' }}>I.E. María Antonia Penagos · Palmira, Valle del Cauca</p>
          <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>Angélica Echeverry & Claudia Narváez · 2025</p>
        </div>
      </div>
    </div>
  );
}

function Students() {
  const [tab, setTab] = useState('activities');
  // Persistent state
  const [diaryEntries, setDiaryEntries] = useState(() => loadData('diaries', []));
  const [triviaHistory, setTriviaHistory] = useState(() => loadData('trivia_history', []));
  const [matrixEntries, setMatrixEntries] = useState(() => loadData('matrices', []));

  // Trivia state
  const [triviaQuestions, setTriviaQuestions] = useState([]);
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaAnswers, setTriviaAnswers] = useState([]);
  const [triviaFinished, setTriviaFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Diary form
  const [diary, setDiary] = useState({ question: '', response: '', useful: '', discarded: '', reformulated: '', learned: '' });
  // Matrix form
  const [matrix, setMatrix] = useState({ topic: '', ia1_main: '', ia1_emphasis: '', ia1_omits: '', ia1_errors: '', ia2_main: '', ia2_emphasis: '', ia2_omits: '', ia2_errors: '', conclusion: '' });

  useEffect(() => { saveData('diaries', diaryEntries); }, [diaryEntries]);
  useEffect(() => { saveData('trivia_history', triviaHistory); }, [triviaHistory]);
  useEffect(() => { saveData('matrices', matrixEntries); }, [matrixEntries]);

  const startTrivia = () => {
    const shuffled = [...TRIVIA_BANK].sort(() => Math.random() - 0.5).slice(0, 8);
    setTriviaQuestions(shuffled);
    setTriviaIdx(0); setTriviaScore(0); setTriviaAnswers([]); setTriviaFinished(false); setSelectedAnswer(null);
  };

  const answerTrivia = (idx) => {
    if (selectedAnswer !== null) return;
    const q = triviaQuestions[triviaIdx];
    const correct = idx === q.correct;
    setSelectedAnswer(idx);
    const newAnswers = [...triviaAnswers, { q: q.q, level: q.level, correct }];
    const newScore = triviaScore + (correct ? 1 : 0);
    setTimeout(() => {
      if (triviaIdx + 1 >= triviaQuestions.length) {
        const result = { date: new Date().toISOString(), score: newScore, total: triviaQuestions.length, answers: newAnswers };
        setTriviaHistory(prev => [...prev, result]);
        setTriviaAnswers(newAnswers); setTriviaScore(newScore); setTriviaFinished(true);
      } else {
        setTriviaIdx(triviaIdx + 1); setTriviaAnswers(newAnswers); setTriviaScore(newScore);
      }
      setSelectedAnswer(null);
    }, 1200);
  };

  const saveDiary = () => {
    if (!diary.question.trim()) return;
    setDiaryEntries(prev => [...prev, { ...diary, date: new Date().toISOString() }]);
    setDiary({ question: '', response: '', useful: '', discarded: '', reformulated: '', learned: '' });
  };

  const saveMatrix = () => {
    if (!matrix.topic.trim()) return;
    setMatrixEntries(prev => [...prev, { ...matrix, date: new Date().toISOString() }]);
    setMatrix({ topic: '', ia1_main: '', ia1_emphasis: '', ia1_omits: '', ia1_errors: '', ia2_main: '', ia2_emphasis: '', ia2_omits: '', ia2_errors: '', conclusion: '' });
  };

  // Badge progress
  const getBadgeProgress = () => {
    const allAnswers = triviaHistory.flatMap(t => t.answers);
    const byLevel = { Literal: { total: 0, correct: 0 }, Inferencial: { total: 0, correct: 0 }, 'Crítico': { total: 0, correct: 0 } };
    allAnswers.forEach(a => { if (byLevel[a.level]) { byLevel[a.level].total++; if (a.correct) byLevel[a.level].correct++; } });
    return {
      literal: byLevel.Literal.total > 0 ? Math.round((byLevel.Literal.correct / byLevel.Literal.total) * 100) : 0,
      inferencial: byLevel.Inferencial.total > 0 ? Math.round((byLevel.Inferencial.correct / byLevel.Inferencial.total) * 100) : 0,
      critico: byLevel['Crítico'].total > 0 ? Math.round((byLevel['Crítico'].correct / byLevel['Crítico'].total) * 100) : 0,
      diarios: Math.min(100, (diaryEntries.length / 5) * 100),
    };
  };
  const progress = getBadgeProgress();

  const tabs = [
    { key: 'activities', label: 'Actividades', icon: '📝' },
    { key: 'prompts', label: 'Guía de Prompts', icon: '💡' },
    { key: 'trivia', label: 'Trivia', icon: '🎮' },
    { key: 'diary', label: 'Diario IA', icon: '📓' },
    { key: 'matrix', label: 'Matriz', icon: '📊' },
    { key: 'badges', label: 'Insignias', icon: '🏅' },
  ];

  return (
    <div className="page">
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>Zona de Estudiantes</h1>
      <p style={{ color: 'var(--text-light)', fontSize: 15, marginBottom: 24 }}>Herramientas para tus actividades de lectura crítica con IA.</p>
      <div className="tabs">
        {tabs.map(t => <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}><span>{t.icon}</span>{t.label}</button>)}
      </div>

      {/* ACTIVITIES */}
      {tab === 'activities' && (
        <div style={{ display: 'grid', gap: 18 }}>
          {ACTIVITIES.map((act, i) => (
            <div key={i} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ background: act.color, padding: '14px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>{act.title}</h3>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>{act.grade}</span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>{act.tool}</span>
                </div>
              </div>
              <div style={{ padding: 22 }}>
                <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{act.desc}</p>
                <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 16 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 10 }}>Pasos:</p>
                  {act.steps.map((s, j) => (
                    <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 7 }}>
                      <span style={{ background: act.color, color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{j + 1}</span>
                      <span style={{ fontSize: 13, lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className="callout"><strong>Recuerda: </strong>la IA es tu herramienta, no tu reemplazo. Tu docente puede pedirte que expliques oralmente cómo llegaste a tus conclusiones.</div>
        </div>
      )}

      {/* PROMPTS GUIDE */}
      {tab === 'prompts' && (
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>💡 Guía de Prompts: cómo hacerle buenas preguntas a la IA</h2>
            <p style={{ color: 'var(--text-light)', fontSize: 14, lineHeight: 1.6 }}>La calidad de la respuesta de la IA depende de la calidad de tu pregunta. Aquí aprenderás a formular prompts que te ayuden a pensar, no a copiar.</p>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {PROMPTS_GUIDE.map((p, i) => (
              <div key={i} className="card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 16, color: 'var(--teal)', marginBottom: 14 }}>{i + 1}. {p.title}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div style={{ background: '#FFF5F5', borderRadius: 10, padding: 14, borderLeft: '3px solid var(--danger)' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)', marginBottom: 6 }}>❌ PREGUNTA DÉBIL</p>
                    <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, fontStyle: 'italic' }}>"{p.bad}"</p>
                  </div>
                  <div style={{ background: '#F0FFF4', borderRadius: 10, padding: 14, borderLeft: '3px solid var(--success)' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', marginBottom: 6 }}>✅ PREGUNTA FUERTE</p>
                    <p style={{ fontSize: 13, color: 'var(--text)', margin: 0, fontStyle: 'italic' }}>"{p.good}"</p>
                  </div>
                </div>
                <div className="callout" style={{ margin: 0 }}><strong>¿Por qué funciona mejor? </strong>{p.why}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRIVIA */}
      {tab === 'trivia' && (
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 22, marginBottom: 4 }}>🎮 Desafío de Lectura Crítica</h2>
          {triviaQuestions.length === 0 && !triviaFinished ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: 44, marginBottom: 12 }}>🧠</p>
              <p style={{ color: 'var(--text-light)', fontSize: 15, marginBottom: 6 }}>8 preguntas aleatorias en 3 niveles: literal, inferencial y crítico.</p>
              <p style={{ color: 'var(--text-light)', fontSize: 13, marginBottom: 24 }}>Trivias completadas: <strong>{triviaHistory.length}</strong></p>
              <button onClick={startTrivia} style={{ background: 'var(--teal)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>Comenzar trivia →</button>
            </div>
          ) : triviaFinished ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>{triviaScore >= 7 ? '🏆' : triviaScore >= 5 ? '👏' : '💪'}</div>
              <h3 style={{ fontSize: 24, marginBottom: 6 }}>Resultado: {triviaScore}/{triviaQuestions.length}</h3>
              <p style={{ color: 'var(--text-light)', fontSize: 14, marginBottom: 20 }}>
                {triviaScore >= 7 ? '¡Excelente! Lectura crítica sólida.' : triviaScore >= 5 ? '¡Bien! Sigue practicando el nivel crítico.' : 'Hay oportunidad de mejorar. Revisa las fuentes.'}
              </p>
              <div style={{ display: 'grid', gap: 6, textAlign: 'left', maxWidth: 520, margin: '0 auto 20px' }}>
                {triviaAnswers.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: a.correct ? '#F0FFF4' : '#FFF5F5', fontSize: 13 }}>
                    <span>{a.correct ? '✅' : '❌'}</span>
                    <span className="badge" style={{ background: a.level === 'Literal' ? '#3182CE' : a.level === 'Inferencial' ? '#805AD5' : '#D69E2E', color: '#fff' }}>{a.level}</span>
                    <span style={{ flex: 1 }}>{a.q.substring(0, 55)}...</span>
                  </div>
                ))}
              </div>
              <button onClick={startTrivia} style={{ background: 'var(--teal)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>Otra trivia</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
                <span style={{ fontSize: 13, color: 'var(--text-light)' }}>Pregunta {triviaIdx + 1} / {triviaQuestions.length}</span>
                <span className="badge" style={{ background: triviaQuestions[triviaIdx].level === 'Literal' ? '#3182CE' : triviaQuestions[triviaIdx].level === 'Inferencial' ? '#805AD5' : '#D69E2E', color: '#fff' }}>{triviaQuestions[triviaIdx].level}</span>
              </div>
              <div className="progress" style={{ marginBottom: 22 }}><div className="progress-fill" style={{ background: 'var(--teal)', width: `${(triviaIdx / triviaQuestions.length) * 100}%` }} /></div>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.5, marginBottom: 20 }}>{triviaQuestions[triviaIdx].q}</p>
              <div style={{ display: 'grid', gap: 8 }}>
                {triviaQuestions[triviaIdx].opts.map((opt, i) => {
                  let bg = 'var(--bg)'; let bdr = 'transparent';
                  if (selectedAnswer !== null) {
                    if (i === triviaQuestions[triviaIdx].correct) { bg = '#F0FFF4'; bdr = 'var(--success)'; }
                    else if (i === selectedAnswer) { bg = '#FFF5F5'; bdr = 'var(--danger)'; }
                  }
                  return (
                    <button key={i} onClick={() => answerTrivia(i)} disabled={selectedAnswer !== null}
                      style={{ background: bg, border: `2px solid ${bdr}`, padding: '13px 16px', borderRadius: 10, textAlign: 'left', fontSize: 14, color: 'var(--text)', fontWeight: 500, opacity: selectedAnswer !== null && i !== selectedAnswer && i !== triviaQuestions[triviaIdx].correct ? 0.5 : 1 }}>
                      <span style={{ fontWeight: 700, color: 'var(--teal)', marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>{opt}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* DIARY */}
      {tab === 'diary' && (
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, marginBottom: 4 }}>📓 Diario de Interacción con IA</h2>
            <p style={{ color: 'var(--text-light)', fontSize: 14 }}>Registra tu experiencia semanal. Entradas guardadas: <strong style={{ color: 'var(--teal)' }}>{diaryEntries.length}</strong></p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            {[
              { key: 'question', label: '¿Qué le preguntaste a la IA?', ph: 'Escribe la pregunta exacta...' },
              { key: 'response', label: '¿Qué respuesta obtuviste? (resumen)', ph: 'Resume en tus palabras...' },
              { key: 'useful', label: '¿Qué fue útil?', ph: '¿Qué parte te ayudó realmente?' },
              { key: 'discarded', label: '¿Qué descartaste o corregiste?', ph: '¿Errores, omisiones, irrelevancias?' },
              { key: 'reformulated', label: '¿Reformulaste tu pregunta?', ph: '¿Cómo la mejoraste?' },
              { key: 'learned', label: '¿Qué aprendiste hoy sobre usar IA?', ph: '¿Qué harías diferente?' },
            ].map(f => (
              <div key={f.key} className="field">
                <label>{f.label}</label>
                <textarea value={diary[f.key]} onChange={e => setDiary({ ...diary, [f.key]: e.target.value })} placeholder={f.ph} />
              </div>
            ))}
            <button onClick={saveDiary} style={{ background: 'var(--teal)', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, width: '100%' }}>Guardar entrada ✓</button>
          </div>
          {diaryEntries.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 12, color: 'var(--navy)' }}>Entradas anteriores</h3>
              {diaryEntries.slice().reverse().slice(0, 5).map((d, i) => (
                <div key={i} className="card" style={{ padding: 16, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <strong style={{ fontSize: 13, color: 'var(--teal)' }}>Pregunta: {d.question.substring(0, 60)}...</strong>
                    <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{new Date(d.date).toLocaleDateString('es-CO')}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', margin: 0 }}>Aprendizaje: {d.learned.substring(0, 80)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MATRIX */}
      {tab === 'matrix' && (
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, marginBottom: 4 }}>📊 Matriz de Análisis Comparativo</h2>
            <p style={{ color: 'var(--text-light)', fontSize: 14 }}>Compara respuestas de dos IAs. Matrices guardadas: <strong style={{ color: 'var(--teal)' }}>{matrixEntries.length}</strong></p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div className="field"><label>Tema / Pregunta formulada</label><input value={matrix.topic} onChange={e => setMatrix({ ...matrix, topic: e.target.value })} placeholder="Ej: ¿Cuáles fueron las causas del conflicto armado?" style={{ minHeight: 40 }} /></div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                <thead>
                  <tr>
                    <th style={{ background: 'var(--navy)', color: '#fff', padding: '10px 14px', fontSize: 13, textAlign: 'left', width: '24%' }}>Aspecto</th>
                    <th style={{ background: 'var(--teal)', color: '#fff', padding: '10px 14px', fontSize: 13, textAlign: 'left' }}>IA 1</th>
                    <th style={{ background: 'var(--gold)', color: '#fff', padding: '10px 14px', fontSize: 13, textAlign: 'left' }}>IA 2</th>
                  </tr>
                </thead>
                <tbody>
                  {[{ k: 'main', l: 'Idea principal' }, { k: 'emphasis', l: '¿Qué enfatiza?' }, { k: 'omits', l: '¿Qué omite?' }, { k: 'errors', l: '¿Errores?' }].map(r => (
                    <tr key={r.k}>
                      <td style={{ padding: '8px 14px', background: 'var(--bg)', fontWeight: 600, fontSize: 13, color: 'var(--navy)', borderBottom: '1px solid #E2E8F0' }}>{r.l}</td>
                      <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0' }}><textarea value={matrix[`ia1_${r.k}`]} onChange={e => setMatrix({ ...matrix, [`ia1_${r.k}`]: e.target.value })} style={{ width: '100%', minHeight: 48, padding: 8, borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }} /></td>
                      <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0' }}><textarea value={matrix[`ia2_${r.k}`]} onChange={e => setMatrix({ ...matrix, [`ia2_${r.k}`]: e.target.value })} style={{ width: '100%', minHeight: 48, padding: 8, borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="field" style={{ marginTop: 16 }}><label>Conclusión: ¿Puedes confiar en la IA?</label><textarea value={matrix.conclusion} onChange={e => setMatrix({ ...matrix, conclusion: e.target.value })} placeholder="Después de comparar y verificar..." /></div>
            <button onClick={saveMatrix} style={{ background: 'var(--teal)', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, width: '100%' }}>Guardar matriz ✓</button>
          </div>
        </div>
      )}

      {/* BADGES */}
      {tab === 'badges' && (
        <div>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>🏅 Tus Insignias</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {BADGES.map((b, i) => {
              const pct = progress[b.key] || 0;
              const earned = (b.key === 'diarios' && pct >= 100) || (b.key === 'literal' && pct >= 80) || (b.key === 'inferencial' && pct >= 70) || (b.key === 'critico' && pct >= 70);
              return (
                <div key={i} className="card" style={{ padding: 22, textAlign: 'center', border: earned ? `2px solid ${b.color}` : '2px solid transparent', opacity: earned ? 1 : 0.75 }}>
                  <div style={{ fontSize: 40, marginBottom: 10, filter: earned ? 'none' : 'grayscale(0.4)' }}>{b.icon}</div>
                  <h3 style={{ fontSize: 15, color: b.color, marginBottom: 6 }}>{b.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', lineHeight: 1.4, marginBottom: 12 }}>{b.req}</p>
                  <div className="progress"><div className="progress-fill" style={{ background: b.color, width: `${Math.min(100, pct)}%` }} /></div>
                  <span style={{ fontSize: 12, color: earned ? b.color : 'var(--text-light)', fontWeight: earned ? 700 : 400, marginTop: 6, display: 'block' }}>{earned ? '✅ ¡Conseguida!' : `${Math.round(pct)}%`}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, fontSize: 13, color: 'var(--text-light)' }}>
            <p>Trivias completadas: <strong>{triviaHistory.length}</strong> · Diarios escritos: <strong>{diaryEntries.length}</strong> · Matrices completadas: <strong>{matrixEntries.length}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

function Teachers() {
  const diaryEntries = loadData('diaries', []);
  const triviaHistory = loadData('trivia_history', []);
  const matrixEntries = loadData('matrices', []);

  const avgTriviaScore = triviaHistory.length > 0 ? (triviaHistory.reduce((s, t) => s + (t.score / t.total) * 5, 0) / triviaHistory.length).toFixed(1) : '—';

  return (
    <div className="page">
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>Panel Docente</h1>
      <p style={{ color: 'var(--text-light)', fontSize: 15, marginBottom: 24 }}>Seguimiento del proyecto. Los datos se actualizan con la actividad de este navegador.</p>
      <div className="stats-grid">
        {[
          { l: 'Diarios escritos', v: diaryEntries.length, c: 'var(--teal)', i: '📓' },
          { l: 'Trivias completadas', v: triviaHistory.length, c: 'var(--gold)', i: '🎮' },
          { l: 'Promedio trivia (sobre 5.0)', v: avgTriviaScore, c: 'var(--navy)', i: '📊' },
          { l: 'Matrices completadas', v: matrixEntries.length, c: '#805AD5', i: '📋' },
        ].map((k, i) => (
          <div key={i} className="card stat-card"><div style={{ fontSize: 24 }}>{k.i}</div><div className="stat-number" style={{ color: k.c }}>{k.v}</div><div className="stat-label">{k.l}</div></div>
        ))}
      </div>

      <h2 style={{ fontSize: 20, marginBottom: 14 }}>Tablero Scrum</h2>
      <div className="scrum-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
        {[
          { t: 'Por hacer', c: 'var(--text-light)', items: ['Sem. 4: Investigadores v2', 'Sem. 5: Detector Sesgos v2', 'Preparar trivia Sem. 4'] },
          { t: 'En progreso', c: 'var(--gold)', items: ['Revisión diarios Sem. 3', 'Ajuste rúbrica contraste'] },
          { t: 'Completado', c: 'var(--success)', items: ['Sem. 1: Investigadores', 'Sem. 2: Detector Sesgos', 'Sem. 3: Trivia + Diario', 'Circular enviada'] },
        ].map((col, i) => (
          <div key={i} style={{ background: 'var(--bg)', borderRadius: 14, padding: 14, minHeight: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.c }} />
              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>{col.t}</span>
              <span style={{ background: 'var(--card)', borderRadius: 10, padding: '2px 8px', fontSize: 11, color: 'var(--text-light)', fontWeight: 600 }}>{col.items.length}</span>
            </div>
            {col.items.map((item, j) => (
              <div key={j} style={{ background: 'var(--card)', borderRadius: 8, padding: '9px 12px', marginBottom: 6, fontSize: 13, borderLeft: `3px solid ${col.c}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>{item}</div>
            ))}
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 20, marginBottom: 14 }}>Rúbrica de referencia</h2>
      <div className="card" style={{ padding: 20, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>{['Criterio', 'Superior (4.6-5.0)', 'Alto (4.0-4.5)', 'Básico (3.0-3.9)', 'Bajo (1.0-2.9)'].map((h, i) => <th key={i} style={{ background: 'var(--navy)', color: '#fff', padding: '10px 12px', textAlign: 'left' }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ['Ideas clave', 'Precisa + relaciones', 'Clara, parcial', 'Algunas ideas', 'No identifica'],
              ['Preguntas a IA', 'Profundas + reformula', 'Pertinentes', 'Básicas', 'Irrelevantes'],
              ['Contraste crítico', 'Completo + verifica', 'Parcial', 'Superficial', 'No contrasta'],
              ['Argumentación', 'Clara + evidencia + posición', 'Coherente parcial', 'Opinión sin estructura', 'Incoherente'],
              ['Uso ético IA', 'Documenta + cita + transforma', 'Parcial', 'Reproduce sin transformar', 'Copia directa'],
            ].map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j} style={{ padding: '8px 12px', borderBottom: '1px solid var(--bg)', background: j === 0 ? 'var(--bg)' : 'transparent', fontWeight: j === 0 ? 600 : 400, color: j === 0 ? 'var(--navy)' : 'var(--text)' }}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>

      {diaryEntries.length > 0 && (
        <>
          <h2 style={{ fontSize: 20, margin: '28px 0 14px' }}>Últimos diarios recibidos</h2>
          {diaryEntries.slice().reverse().slice(0, 3).map((d, i) => (
            <div key={i} className="card" style={{ padding: 16, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <strong style={{ fontSize: 13 }}>Pregunta: {d.question.substring(0, 70)}</strong>
                <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{new Date(d.date).toLocaleDateString('es-CO')}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-light)', margin: '4px 0 0' }}>Útil: {d.useful.substring(0, 80)} · Descartó: {d.discarded.substring(0, 60)}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function Families() {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { q: '¿Qué es la inteligencia artificial?', a: 'Son programas que procesan información y generan textos. Aquí la usamos como herramienta de apoyo para que los estudiantes aprendan a leer mejor y pensar críticamente. NO reemplaza al docente ni al pensamiento del estudiante.' },
    { q: '¿Es seguro para mi hijo(a)?', a: 'Sí. No se ingresan datos personales (nombre, documento, fotos, dirección). Las actividades usan cuentas institucionales bajo supervisión docente. Los trabajos se guardan en Google Classroom.' },
    { q: '¿Qué pasa si no quiero que use IA?', a: 'Su hijo(a) hará las mismas actividades de lectura y análisis con materiales impresos. La calificación evalúa comprensión lectora, no tecnología. No habrá penalización.' },
    { q: '¿La IA hará las tareas por mi hijo(a)?', a: 'No. Los estudiantes deben leer primero, escribir sus ideas antes de consultar la IA, comparar respuestas con las fuentes y escribir conclusiones propias. Si copian, el docente lo detecta con verificación oral.' },
    { q: '¿Qué necesito firmar?', a: 'Un formato de consentimiento informado. Puede autorizar o no la participación. Devuélvalo firmado al director de grupo.' },
  ];

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>👨‍👩‍👧‍👦</div>
        <h1 style={{ fontSize: 30, marginBottom: 6 }}>Información para Familias</h1>
        <p style={{ color: 'var(--text-light)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>Todo sobre el proyecto "Lectura Crítica Aumentada con IA"</p>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>¿De qué se trata?</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>El colegio desarrolla un proyecto donde los estudiantes de grados 6° a 9° aprenden a <strong>usar la inteligencia artificial de manera responsable</strong> en Ciencias Sociales y Tecnología.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>El objetivo NO es que la IA haga el trabajo. Los estudiantes aprenden a <strong>leer críticamente, formular buenas preguntas, comparar información y pensar por sí mismos</strong>.</p>
      </div>

      <div style={{ background: 'var(--warm)', borderRadius: 14, padding: 28, marginBottom: 20, borderLeft: '4px solid var(--gold)' }}>
        <h2 style={{ fontSize: 18, marginBottom: 14, color: 'var(--navy)' }}>¿Qué hace mi hijo(a) en clase?</h2>
        {[
          { s: 1, t: 'Lee un texto seleccionado por el docente', i: '📖' },
          { s: 2, t: 'Escribe sus propias ideas ANTES de consultar la IA', i: '✍️' },
          { s: 3, t: 'Le hace preguntas a la IA y compara con el texto original', i: '🔍' },
          { s: 4, t: 'Verifica la información con fuentes confiables', i: '✅' },
          { s: 5, t: 'Escribe sus conclusiones con sus propias palabras', i: '📝' },
        ].map(s => (
          <div key={s.s} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ background: 'var(--gold)', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{s.s}</div>
            <span style={{ fontSize: 14 }}>{s.i} {s.t}</span>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 20, marginBottom: 14 }}>Preguntas frecuentes</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        {faqs.map((f, i) => (
          <div key={i} className="card" style={{ overflow: 'hidden' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '14px 18px', border: 'none', background: 'transparent', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--navy)' }}>{f.q}</span>
              <span style={{ fontSize: 18, color: 'var(--teal)', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 8 }}>+</span>
            </button>
            {openFaq === i && <div style={{ padding: '0 18px 14px', fontSize: 14, lineHeight: 1.7 }}>{f.a}</div>}
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--navy)', borderRadius: 14, padding: 28, marginTop: 28, textAlign: 'center', color: '#fff' }}>
        <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 10 }}>¿Tiene preguntas?</h3>
        <p style={{ color: 'var(--gold-light)', fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Angélica Echeverry · Ciencias Sociales</p>
        <p style={{ color: 'var(--gold-light)', fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Claudia Narváez · Tecnología</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>I.E. María Antonia Penagos · Palmira</p>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [page, setPage] = useState('home');
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <div>
      <Nav page={page} setPage={setPage} />
      {page === 'home' && <Home setPage={setPage} />}
      {page === 'students' && <Students />}
      {page === 'teachers' && <Teachers />}
      {page === 'families' && <Families />}
    </div>
  );
}
