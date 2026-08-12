const IPM = {};

IPM.CONFIG = {
  gameName: "IdealPM",
  width: 800,
  height: 450,
  globalRules: {
    attemptsPerMinigame: 7,
    aciertosToComplete: 4
  },
  cameraModes: {
    basketball: "side_view_half_court",
    football: "behind_kicker_or_side_penalty",
    archery: "first_person_target"
  },
  slider: {
    speed: 0.42,
    green: [0.42, 0.58],
    yellow: [0.27, 0.42, 0.58, 0.73]
  },
  fontScale: 1.32,
  spriteURLs: {},
  timings: {
    intro: 1.0,
    result: 2.4,
    fail: 1.3,
    clear: 2.0
  }
};

IPM.MINIGAMES = [
  {
    id: "basketball",
    name: "Basketball IdealPM",
    emoji: "🏀",
    intro: "HABILIDADES TÉCNICAS Y BLANDAS",
    shots: 7,
    needed: 4,
    achievements: [
      { type: "TÉCNICA", title: "Gestión de Riesgos", desc: "Anticipar problemas ahorra presupuesto y tiempo, asegurando entregables de alta calidad." },
      { type: "TÉCNICA", title: "Planificación y Estimación", desc: "Cronogramas y presupuestos realistas para controlar alcance, tiempo y costos." },
      { type: "TÉCNICA", title: "Metodologías Ágiles y Predictivas", desc: "Scrum, Kanban o Waterfall: saber elegir el marco según el contexto del proyecto." },
      { type: "TÉCNICA", title: "Dominio de Herramientas de Gestión", desc: "Jira, MS Project, Notion y tableros que hacen visible el avance del equipo." },
      { type: "BLANDA", title: "Liderazgo Situacional", desc: "Inspirar y guiar a cada integrante según su madurez y la etapa del proyecto." },
      { type: "BLANDA", title: "Comunicación Asertiva", desc: "Puente entre desarrolladores, clientes y directivos. Si falla, todo falla." },
      { type: "BLANDA", title: "Empatía e Inteligencia Emocional", desc: "Pensamiento crítico y humano para liderar equipos y resolver conflictos." }
    ]
  },
  {
    id: "football",
    name: "Fútbol Penaltis IdealPM",
    emoji: "⚽",
    intro: "COMPETENCIAS CLAVE Y ATRIBUTOS",
    shots: 7,
    needed: 4,
    achievements: [
      { type: "COMPETENCIA", title: "Optimización del Tiempo", desc: "Priorizar y secuenciar tareas para cumplir deadlines sin sacrificar calidad." },
      { type: "COMPETENCIA", title: "Negociación de Expectativas", desc: "Alinear intereses con stakeholders y comunicar avances con transparencia." },
      { type: "COMPETENCIA", title: "Decisiones bajo Presión", desc: "Elegir con datos y calma en escenarios críticos de la ejecución." },
      { type: "COMPETENCIA", title: "Análisis de Datos y KPIs", desc: "Medir avance y desviaciones para corregir el rumbo a tiempo." },
      { type: "ATRIBUTO", title: "Adaptabilidad y Flexibilidad", desc: "Ajustar planes ante cambios sin perder de vista el objetivo." },
      { type: "ATRIBUTO", title: "Proactividad y Soluciones", desc: "Anticipar problemas y proponer soluciones antes de que escalen." },
      { type: "ATRIBUTO", title: "Resiliencia y Accountability", desc: "Asumir responsabilidad, mantener la integridad y sostener al equipo." }
    ]
  },
  {
    id: "archery",
    name: "Tiro al Blanco IdealPM",
    emoji: "🎯",
    intro: "CERTIFICACIONES",
    shots: 7,
    needed: 4,
    achievements: [
      { type: "CERTIFICACIÓN", title: "PMP®", desc: "Project Management Professional, el estándar global de PMI para dirigir proyectos." },
      { type: "CERTIFICACIÓN", title: "CSM® / PSM I", desc: "Certified Scrum Master: dominio de Scrum para equipos ágiles." },
      { type: "CERTIFICACIÓN", title: "CAPM®", desc: "Certified Associate in PM: puerta de entrada oficial al mundo de la gestión." },
      { type: "CERTIFICACIÓN", title: "PMI-ACP®", desc: "Agile Certified Practitioner: agilidad aplicada a escala real." },
      { type: "CERTIFICACIÓN", title: "PM2 Essentials & Advanced", desc: "Metodología oficial de la Unión Europea, abierta y práctica." },
      { type: "CERTIFICACIÓN", title: "IPMA (Nivel C-D)", desc: "Competencias reconocidas internacionalmente por IPMA." },
      { type: "CERTIFICACIÓN", title: "Máxima Acreditación Integral", desc: "PMP + ACP + Agile + Governance: el perfil completo del PM ideal." }
    ]
  }
];

IPM.PODIUM = {
  title: "PERFIL DEL PM IDEAL",
  intro: "Con los 12 aciertos se completa el perfil del Project Manager ideal.",
  essentials: {
    title: "1 · IMPRESCINDIBLES",
    items: [
      "Comunicación Asertiva: puente entre desarrolladores, clientes y directivos. Si falla la comunicación, el proyecto fracasa sin importar la tecnología.",
      "Gestión de Riesgos y Planificación: anticipar problemas ahorra presupuesto y tiempo, asegurando entregables de calidad.",
      "Adaptabilidad: la rigidez destruye la dinámica de trabajo y retrasa el producto final."
    ]
  },
  industry: {
    title: "2 · MÁS MENCIONADAS",
    items: [
      "Liderazgo y Comunicación: el motor diario del PM para guiar y mover al equipo.",
      "Manejo del Tiempo y Organización: vital para garantizar los deadlines.",
      "Gestión de Riesgos: la habilidad técnica más valorada para proteger rentabilidad y alcance."
    ]
  },
  context: {
    title: "3 · EL CONTEXTO PRIORIZA",
    items: [
      "Software/Tech: agilidad (Scrum), iteraciones rápidas y comprensión técnica.",
      "Construcción: control de costos, gestión predictiva, contratos y normativas.",
      "Startup: PM todoterreno y versátil. Corporación: diplomacia, procesos y PMP."
    ]
  }
};
