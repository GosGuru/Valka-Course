import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, CheckCircle2, Menu, X, Bot, FileText, Table } from "lucide-react";

/**
 * Página de Curso – Valka (React + Tailwind + Framer Motion)
 * ---------------------------------------------------------
 * • Paleta en grises con acentos morados sutiles (violet-*)
 * • Lista de módulos a la izquierda (sticky) + detalle a la derecha
 * • Acordeón en mobile, panel con video (YouTube o archivo mp4) en desktop
 * • Micro-animaciones y estados accesibles (focus-visible)
 * • Videos se integran manualmente: reemplaza las URLs en MODULES
 */

// ---- Datos de ejemplo (reemplaza por tus propios videos/manual) ----
const MODULES: Module[] = [
  {
    id: "mod-1",
    title: "Módulo 1 · Fundamentos",
    durationMin: 18,
    video: { type: "youtube", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    summary:
      "Qué es una rutina efectiva, principios de progreso y errores comunes.",
    body:
      "Estructura mínima viable, series efectivas, RPE y registro de progreso.",
    resources: [
      { type: "pdf", label: "Guía rápida (PDF)", href: "#" },
      { type: "sheet", label: "Plantilla progresión (Sheets)", href: "#" },
    ],
  },
  {
    id: "mod-2",
    title: "Módulo 2 · Técnica de básicos",
    durationMin: 26,
  // Reemplazado a YouTube temporal porque el archivo local no existe en /public/videos
  video: { type: "youtube", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    summary:
      "Puntos de rendimiento para sentadilla, press, dominadas y bisagra.",
    body:
      "Detecta fallos técnicos y usa video-feedback con checklist por patrón.",
    resources: [{ type: "pdf", label: "Checklist imprimible", href: "#" }],
  },
  {
    id: "mod-3",
    title: "Módulo 3 · Plan semanal",
    durationMin: 14,
    video: { type: "youtube", url: "https://www.youtube.com/embed/YbJOTdZBX1g" },
    summary: "Microciclos de 2, 3 y 4 días y cómo adaptarlos a tu agenda.",
    body:
      "Tres plantillas + reglas simples para ajustar tiempo, fatiga y preferencias.",
    resources: [{ type: "sheet", label: "Plantillas 2-3-4 días", href: "#" }],
  },
  {
    id: "mod-4",
    title: "Módulo 4 · Nutrición base",
    durationMin: 21,
  // Reemplazado a YouTube temporal porque el archivo local no existe en /public/videos
  video: { type: "youtube", url: "https://www.youtube.com/embed/YbJOTdZBX1g" },
    summary: "Macros sin apps: comer para rendir y recuperarte.",
    body:
      "Estimá porciones con reglas prácticas para mejorar adherencia.",
    resources: [{ type: "pdf", label: "Infografía de porciones", href: "#" }],
  },
];

// ---- Tipos ----
interface Module {
  id: string;
  title: string;
  durationMin?: number;
  video: { type: "youtube" | "file"; url: string };
  summary?: string;
  body?: string;
  resources?: { type: "pdf" | "sheet"; label: string; href: string }[];
}

export default function CoursePage() {
  const [activeId, setActiveId] = useState<string | null>(MODULES[0]?.id ?? null);
  const [chatOpen, setChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'bot', timestamp: Date}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const active = useMemo(() => MODULES.find((m) => m.id === activeId) || null, [
    activeId,
  ]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Mobile: al cambiar de módulo, scrollea al detalle
  useEffect(() => {
    if (!active) return;
    const el = document.getElementById("module-detail");
    if (el && window.innerWidth < 768) el.scrollIntoView({ behavior: "smooth" });
  }, [active]);

  // Función para enviar mensaje al agente N8N
  const sendMessageToN8N = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // URL de tu webhook de N8N - actualizada con tu URL real
      const N8N_WEBHOOK_URL = "https://n8n.srv952620.hstgr.cloud/webhook/a8d1d9e3-3708-43ec-a938-41b26bffdfec";
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            currentModule: active?.id,
            moduleTitle: active?.title,
            userId: "user-123", // Reemplaza con ID real del usuario
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error al comunicarse con el agente');
      }

      const data = await response.json();
      
      // Agregar respuesta del bot
      const botMessage = {
        id: Date.now().toString() + '-bot',
        text: data.response || "Lo siento, no pude procesar tu mensaje.",
        sender: 'bot' as const,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error:', error);
      
      // Mensaje de error
      const errorMessage = {
        id: Date.now().toString() + '-error',
        text: "Lo siento, hubo un error conectando con el asistente. Intenta nuevamente.",
        sender: 'bot' as const,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now().toString() + '-user',
      text: message.trim(),
      sender: 'user' as const,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = message.trim();
    setMessage("");

    // Enviar a N8N
    await sendMessageToN8N(messageToSend);
  };

  // helpers
  function goToNext(id: string) {
    const idx = MODULES.findIndex((m) => m.id === id);
    if (idx >= 0 && idx < MODULES.length - 1) setActiveId(MODULES[idx + 1].id);
  }

  function goToPrev(id: string) {
    const idx = MODULES.findIndex((m) => m.id === id);
    if (idx > 0) setActiveId(MODULES[idx - 1].id);
  }

  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-zinc-50">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 border-b border-zinc-800">
          <div className="flex items-center max-w-6xl gap-3 px-4 py-3 mx-auto">
            <div className="flex items-center gap-2">
              <a 
                href="#" 
                onClick={() => window.location.hash = ''}
                className="transition-opacity hover:opacity-80"
              >
                <img
                  className="w-auto h-8"
                  src="/logo.png"
                  alt="Valka Logo"
                />
              </a>
              <div className="flex flex-col leading-tight">
                <span className="text-sm tracking-wider uppercase">Aprende a entrenar</span>
                <span className="w-16 h-1 rounded bg-gradient-to-r from-violet-600 to-violet-500" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="items-center justify-center flex-1 hidden md:flex">
              <a 
                href="#" 
                onClick={() => window.location.hash = ''}
                className="text-white text-lg font-['Bebas_Neue'] tracking-wider hover:text-stone-300 transition-colors"
              >
                HOME
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="z-10 p-2 ml-auto text-white transition-colors rounded-md md:hidden hover:bg-zinc-800"
              aria-label="Menú"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            {/* Desktop Menu Icon (non-functional, just visual) */}
            <button className="hidden ml-auto transition md:block opacity-70 hover:opacity-100" aria-label="Menú">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center md:hidden bg-black/95 backdrop-blur-sm">
            <nav className="space-y-8 text-center">
              <a 
                href="#" 
                onClick={() => {
                  window.location.hash = '';
                  toggleMenu();
                }}
                className="block text-white text-3xl font-['Bebas_Neue'] tracking-wider hover:text-stone-300 transition-colors"
              >
                HOME
              </a>
              <div className="text-zinc-400 text-lg font-['Bebas_Neue'] tracking-wider">
                CURSOS (ACTUAL)
              </div>
            </nav>
          </div>
        )}

        {/* Layout principal */}
        <main className="mx-auto max-w-6xl px-4 py-6 grid gap-6 md:grid-cols-[360px_1fr]">
          {/* Índice de módulos */}
          <nav aria-label="Lista de módulos" className="md:self-start md:sticky md:top-[72px]">
            <h2 className="mb-3 text-lg font-extrabold tracking-tight">Módulos</h2>
            <ul className="flex flex-col gap-3">
              {MODULES.map((m, i) => (
                <li key={m.id}>
                  <ModuleRow
                    module={m}
                    index={i}
                    active={activeId === m.id}
                    onOpen={() => setActiveId(m.id)}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Panel de contenido */}
          <section id="module-detail" aria-live="polite">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6 shadow-[0_8px_36px_-14px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-violet-400" />
                    <h3 className="text-base font-semibold tracking-tight md:text-lg">
                      {active.title}
                    </h3>
                    {active.durationMin ? (
                      <span className="ml-auto text-xs text-zinc-400">
                        {active.durationMin} min
                      </span>
                    ) : null}
                  </div>

                  {/* Video */}
                  <div className="relative w-full overflow-hidden border aspect-video rounded-xl border-zinc-800 bg-zinc-800/50">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-violet-700/70 to-transparent" />
                    {active.video.type === "youtube" ? (
                      <iframe
                        className="w-full h-full"
                        src={active.video.url}
                        title={active.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <video className="w-full h-full" controls preload="metadata">
                        <source src={active.video.url} />
                        Tu navegador no soporta el video HTML5.
                      </video>
                    )}
                  </div>

                  {/* Texto */}
                  {active.summary || active.body ? (
                    <div className="mt-4 space-y-2 text-sm text-zinc-300">
                      {active.summary ? (
                        <p className="font-medium text-zinc-200">{active.summary}</p>
                      ) : null}
                      {active.body ? <p className="leading-relaxed">{active.body}</p> : null}
                    </div>
                  ) : null}

                  {/* Recursos */}
                  {active.resources && active.resources.length > 0 ? (
                    <div className="mt-4">
                      <div className="mb-2 text-xs tracking-wide uppercase text-zinc-400">
                        Recursos
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {active.resources.map((r, idx) => (
                          <a
                            key={idx}
                            href={r.href}
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm hover:border-violet-400 hover:shadow-[0_8px_24px_-12px_rgba(46,16,101,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                          >
                            {r.type === "pdf" ? (
                              <FileText className="w-4 h-4 text-violet-300" />
                            ) : (
                              <Table className="w-4 h-4 text-violet-300" />
                            )}
                            {r.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Footer acciones */}
                  <div className="flex flex-col-reverse gap-3 mt-6 sm:flex-row sm:items-center">
                    <button
                      onClick={() => goToPrev(active.id)}
                      className="px-4 py-2 text-sm border rounded-lg border-zinc-700 bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                    >
                      Anterior
                    </button>
                    <div className="sm:ml-auto" />
                    <button
                      onClick={() => goToNext(active.id)}
                      className="px-4 py-2 text-sm font-semibold rounded-lg bg-violet-600 text-zinc-50 hover:bg-violet-500 active:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                    >
                      Siguiente
                    </button>
                  </div>

                  {/* Progreso + sugerencia */}
                  <div className="grid gap-4 mt-8 md:grid-cols-3">
                    <div>
                      <div className="mb-2 text-xs tracking-wide uppercase text-zinc-400">Progreso</div>
                      <Progress value={percentComplete(activeId)} />
                      <div className="mt-2 text-xs text-zinc-400">{percentComplete(activeId)}% completado</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="mb-2 text-xs tracking-wide uppercase text-zinc-400">Sugerencia</div>
                      <div className="flex items-start gap-2 p-3 border rounded-xl border-zinc-800 bg-zinc-900">
                        <Bot className="w-4 h-4 mt-1 text-violet-300" />
                        <p className="text-sm text-zinc-300">
                          Guardá una nota rápida al terminar cada video: qué salió fácil, qué costó y cuántas repeticiones efectivas hiciste.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 text-sm border border-dashed rounded-2xl border-zinc-800 bg-zinc-900/50 text-zinc-400"
                >
                  Selecciona un módulo para ver el contenido.
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>

        {/* Botón flotante de chat */}
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full border border-violet-500/70 bg-zinc-900/80 backdrop-blur text-zinc-50 shadow-[0_12px_36px_-12px_rgba(46,16,101,0.45)] hover:scale-[1.03] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          aria-label="Abrir asistente"
        >
          <Bot className="w-6 h-6 m-auto text-violet-300" />
        </button>

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.18 }}
              className="fixed bottom-24 right-6 w-[360px] max-w-[92vw] rounded-2xl border border-zinc-800 bg-zinc-900 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.6)]"
              role="dialog" 
              aria-modal="true"
            >
              <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
                <Bot className="w-5 h-5 text-violet-300" />
                <div className="font-semibold">Asistente Valka</div>
                <button 
                  className="ml-auto opacity-70 hover:opacity-100" 
                  onClick={() => setChatOpen(false)} 
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="h-64 p-4 space-y-3 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="py-8 text-sm text-center text-zinc-400">
                    ¡Hola! Soy tu asistente de Valka. Preguntame algo sobre el módulo actual.
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          msg.sender === 'user'
                            ? 'bg-violet-600 text-zinc-50'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 text-sm rounded-lg bg-zinc-800 text-zinc-300">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 rounded-full animate-spin border-violet-300 border-t-transparent"></div>
                        Escribiendo...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu pregunta..."
                    className="flex-1 px-3 py-2 text-sm border rounded-lg bg-zinc-800 border-zinc-700 focus:outline-none focus:border-violet-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="px-4 py-2 text-sm rounded-lg bg-violet-600 text-zinc-50 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ---- Subcomponentes ----
function ModuleRow({ module, index, active, onOpen }: { module: Module; index: number; active: boolean; onOpen: () => void }) {
  return (
    <div className={`group relative rounded-xl border overflow-hidden ${active ? "border-violet-500/40 bg-zinc-900" : "border-zinc-800 bg-zinc-900"}`}>
      {/* Rail morado cuando está activo */}
      <div className={`absolute left-0 top-0 h-full w-[4px] ${active ? "bg-gradient-to-b from-violet-700 to-violet-500" : "bg-transparent"}`} />

      <button
        onClick={onOpen}
        aria-pressed={active}
        className="flex items-center w-full gap-3 px-4 py-3 text-left hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        <div className="flex items-center justify-center w-6 h-6 text-xs border rounded-md border-zinc-700 bg-zinc-800 text-zinc-300">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate text-zinc-100">{module.title}</div>
          {module.durationMin ? <div className="text-xs text-zinc-400">{module.durationMin} min</div> : null}
        </div>
        <motion.div
          animate={{ rotate: active ? 90 : 0 }}
          transition={{ duration: 0.18 }}
          className={`opacity-80 ${active ? "text-violet-300" : "text-zinc-300"}`}
          aria-hidden
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Overlay morado sutil al activo (estético) */}
      {active && <div className="absolute inset-0 pointer-events-none bg-violet-500/8" />}
    </div>
  );
}

function Progress({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2 overflow-hidden rounded-full bg-zinc-800">
      <div className="h-full bg-violet-600" style={{ width: `${pct}%` }} />
    </div>
  );
}

function percentComplete(activeId: string | null): number {
  if (!activeId) return 0;
  const idx = MODULES.findIndex((m) => m.id === activeId);
  const done = Math.max(0, idx);
  return Math.round(((done + 1) / MODULES.length) * 100);
}
