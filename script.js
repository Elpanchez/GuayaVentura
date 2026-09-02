/* ============================================================
   El Camino del Bocadillo
   Juego educativo de gamificación sobre el proceso de
   elaboración del bocadillo veleño (dulce de guayaba).
   HTML + CSS + JS puro, sin backend ni dependencias externas.
   ============================================================ */

const MODULES = [
  {
    id: 1,
    stage: "Selección y recepción de la guayaba",
    intro:
      "Al llegar la guayaba a la fábrica se inspecciona, se clasifica por variedad y grado de madurez (blanca, roja o verde) y se lava, descartando la fruta que no cumple los estándares de calidad.",
    questions: [
      {
        type: "mc",
        prompt: "¿Qué variedades de guayaba se seleccionan para elaborar el bocadillo?",
        options: [
          "Blanca, roja y verde",
          "Solo guayaba verde",
          "Solo guayaba importada",
          "No se selecciona, se usa toda por igual",
        ],
        correct: 0,
        hint: "El bocadillo veleño se elabora combinando distintas variedades de guayaba, no una sola.",
      },
      {
        type: "yn",
        prompt: "¿Antes de despulpar, se debe lavar y clasificar la guayaba según su madurez?",
        correct: true,
        hint: "La selección y el lavado son el primer filtro de calidad del proceso.",
      },
    ],
  },
  {
    id: 2,
    stage: "Despulpado",
    intro:
      "Mediante despulpadoras mecánicas se retiran la cáscara y las semillas de la guayaba, obteniendo una pasta acuosa (pulpa) lista para la cocción.",
    questions: [
      {
        type: "mc",
        prompt: "¿Qué se obtiene al despulpar la guayaba?",
        options: [
          "Una pasta acuosa sin semillas ni cáscara",
          "Jugo embotellado listo para vender",
          "Guayaba deshidratada",
          "Mermelada lista para empacar",
        ],
        correct: 0,
        hint: "El despulpado separa la parte aprovechable de la fruta de las semillas y la cáscara.",
      },
      {
        type: "yn",
        prompt: "¿El despulpado se realiza antes de mezclar la fruta con el azúcar?",
        correct: true,
        hint: "Primero se obtiene la pulpa; la mezcla con azúcar viene en la siguiente etapa.",
      },
    ],
  },
  {
    id: 3,
    stage: "Formulación y cocción",
    intro:
      "La pulpa se mezcla con azúcar en proporciones definidas y se cocina en pailas con agitación constante hasta evaporar el agua y alcanzar el punto óptimo de concentración.",
    questions: [
      {
        type: "mc",
        prompt: "¿Qué ingrediente se agrega a la pulpa antes de cocinarla?",
        options: ["Azúcar", "Sal", "Vinagre", "Colorante artificial"],
        correct: 0,
        hint: "El bocadillo tradicional se elabora solo con guayaba y azúcar.",
      },
      {
        type: "yn",
        prompt: "¿La cocción busca evaporar el agua hasta alcanzar el punto justo de concentración?",
        correct: true,
        hint: "Si falta o sobra cocción, el bocadillo no toma la consistencia correcta.",
      },
    ],
  },
  {
    id: 4,
    stage: "Moldeado y enfriamiento",
    intro:
      "La pasta caliente se vierte en moldes o bateas, se alisa la superficie y se deja enfriar entre 24 y 30 horas en un área ventilada, hasta que toma firmeza.",
    questions: [
      {
        type: "mc",
        prompt: "¿Cuánto tiempo aproximado necesita el bocadillo para enfriarse después del moldeado?",
        options: ["24 a 30 horas", "10 minutos", "Una semana completa", "No necesita enfriarse"],
        correct: 0,
        hint: "El enfriamiento es lento: se deja reposar alrededor de un día completo.",
      },
      {
        type: "yn",
        prompt: "¿La pasta se vierte caliente en moldes o bateas para darle forma?",
        correct: true,
        hint: "El moldeado se hace mientras la pasta todavía está caliente y maleable.",
      },
    ],
  },
  {
    id: 5,
    stage: "Corte",
    intro:
      "Una vez frío y firme, el bloque de bocadillo se corta con máquinas o herramientas especializadas en las porciones y tamaños deseados.",
    questions: [
      {
        type: "mc",
        prompt: "¿Cuándo se corta el bocadillo?",
        options: [
          "Cuando ya está frío y firme",
          "Apenas sale de la paila, hirviendo",
          "Antes de cocinarlo",
          "Nunca se corta, se vende en bloque",
        ],
        correct: 0,
        hint: "Cortar la pasta caliente la deformaría; hay que esperar a que enfríe.",
      },
      {
        type: "yn",
        prompt: "¿El tamaño de las porciones depende de cómo se corte el bloque?",
        correct: true,
        hint: "El corte es el que define el tamaño final de cada bocadillo.",
      },
    ],
  },
  {
    id: 6,
    stage: "Empaque y conservación",
    intro:
      "El producto se envuelve, tradicionalmente en hoja de bijao, para preservar su sabor, humedad e inocuidad durante el almacenamiento y la distribución.",
    questions: [
      {
        type: "mc",
        prompt: "¿Con qué se envuelve tradicionalmente el bocadillo veleño?",
        options: ["Hoja de bijao", "Papel periódico", "Plástico de burbujas", "Papel aluminio grueso"],
        correct: 0,
        hint: "Es un envoltorio vegetal tradicional, típico de los dulces de la región santandereana.",
      },
      {
        type: "yn",
        prompt: "¿El empaque ayuda a conservar el sabor y la humedad del producto?",
        correct: true,
        hint: "El empaque no es solo estético: protege la calidad del bocadillo hasta que llega al consumidor.",
      },
    ],
  },
];

const TOTAL_MODULES = MODULES.length;

/* Estado en memoria (sin localStorage): se reinicia al recargar la página */
const state = {
  screen: "home", // home | map | module | finish
  unlockedIndex: 0, // índice (0-based) del último módulo desbloqueado
  completed: [], // ids de módulos completados
  currentModuleIndex: null,
  currentQuestionIndex: 0,
  selectedOption: null,
  feedback: null, // { correct: bool, text: string }
};

const app = document.getElementById("app");

function resetToHome() {
  state.screen = "home";
  state.unlockedIndex = 0;
  state.completed = [];
  state.currentModuleIndex = null;
  state.currentQuestionIndex = 0;
  state.selectedOption = null;
  state.feedback = null;
  state.introDismissed = false;
  render();
}

function render() {
  app.innerHTML = "";

  const homeButton = document.createElement("button");
  homeButton.className = "floating-home";
  homeButton.type = "button";
  homeButton.innerHTML = "<i class='fa-solid fa-house'></i> Inicio";
  homeButton.setAttribute("aria-label", "Volver al inicio");
  homeButton.addEventListener("click", resetToHome);

  app.appendChild(homeButton);

  if (state.screen === "home") return renderHome();
  if (state.screen === "map") return renderMap();
  if (state.screen === "module") return renderModule();
  if (state.screen === "finish") return renderFinish();
}

/* ---------------- Pantalla de inicio ---------------- */
function renderHome() {
  const hero = document.createElement("section");
  hero.className = "hero";

  hero.innerHTML = `
    <div class="hero__content">
      <div class="hero__copy">
        <span class="hero__badge">Bocadillo veleño</span>
        <h1>GuayaVentura</h1>
        <p class="hero__tagline">El camino del bocadillo veleño</p>
        <p>
          Descubre cómo la guayaba pasa por un proceso artesanal y cuidadoso:
          selección, despulpado, cocción, moldeado, corte y empaque. Cada etapa
          te acerca a entender el sabor y la tradición de esta delicia.
        </p>

        <div class="hero__actions">
          <button class="btn" type="button">Comenzar</button>
          <button class="btn btn--ghost" type="button">Ver proceso</button>
        </div>

        <div class="feature-list" aria-label="Características del proyecto">
          <span class="feature-pill"><i class="fa-solid fa-apple-whole"></i> Guayaba fresca</span>
          <span class="feature-pill"><i class="fa-solid fa-candy-cane"></i> Proceso artesanal</span>
          <span class="feature-pill"><i class="fa-solid fa-leaf"></i> Tradición</span>
        </div>
      </div>

      <div class="hero__visual" aria-label="Ilustración del proceso del bocadillo">
        <div class="visual-card visual-card--primary">
          <div class="visual-card__header">
            <span class="visual-card__tag">Proceso</span>
            <span aria-hidden="true"><i class="fa-solid fa-route"></i></span>
          </div>
          <svg class="guava-art" viewBox="0 0 220 620" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Línea de tiempo: selección de la guayaba, despulpado, cocción en paila y bocadillo terminado">
            <defs>
              <linearGradient id="guavaGradient" x1="0" x2="1">
                <stop offset="0%" stop-color="#f7b3c4" />
                <stop offset="100%" stop-color="#d95d82" />
              </linearGradient>
              <linearGradient id="leafGradient" x1="0" x2="1">
                <stop offset="0%" stop-color="#6fb57d" />
                <stop offset="100%" stop-color="#3f7d52" />
              </linearGradient>
              <linearGradient id="skinGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#c8dc7a" />
                <stop offset="100%" stop-color="#7fae4a" />
              </linearGradient>
              <radialGradient id="pulpRadial" cx="35%" cy="35%" r="75%">
                <stop offset="0%" stop-color="#ffd9e3" />
                <stop offset="55%" stop-color="#f2879f" />
                <stop offset="100%" stop-color="#c14f72" />
              </radialGradient>
              <linearGradient id="copperGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#e0a468" />
                <stop offset="100%" stop-color="#b5652c" />
              </linearGradient>
            </defs>

            <!-- línea de tiempo serpenteante -->
            <path d="M35 70C35 150 185 150 185 230C185 310 35 310 35 380C35 460 185 460 185 530"
              stroke="#c97b3c" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" fill="none" opacity="0.45"/>
            <circle cx="35" cy="70" r="13" fill="#b83f60"/>
            <text x="35" y="75" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="sans-serif">1</text>
            <circle cx="185" cy="230" r="13" fill="#b83f60"/>
            <text x="185" y="235" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="sans-serif">2</text>
            <circle cx="35" cy="380" r="13" fill="#b83f60"/>
            <text x="35" y="385" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="sans-serif">3</text>
            <circle cx="185" cy="530" r="13" fill="#b83f60"/>
            <text x="185" y="535" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="sans-serif">4</text>

            <!-- 1. Selección: rama con hojas y guayaba entera unida a ella -->
            <path d="M55 26C80 14 140 14 165 28" stroke="#3f7d52" stroke-width="3" fill="none" stroke-linecap="round"/>
            <ellipse cx="70" cy="20" rx="13" ry="6" fill="url(#leafGradient)" transform="rotate(-20 70 20)"/>
            <ellipse cx="110" cy="14" rx="13" ry="6" fill="url(#leafGradient)" transform="rotate(3 110 14)"/>
            <ellipse cx="150" cy="22" rx="13" ry="6" fill="url(#leafGradient)" transform="rotate(20 150 22)"/>
            <path d="M110 16v30" stroke="#3f7d52" stroke-width="3" fill="none"/>
            <circle cx="110" cy="78" r="32" fill="url(#skinGradient)"/>
            <ellipse cx="98" cy="64" rx="10" ry="7" fill="#fff" opacity="0.25" transform="rotate(-20 98 64)"/>
            <circle cx="110" cy="106" r="2.2" fill="#5c7d34"/>

            <!-- 2. Despulpado: guayaba cortada con volumen (sombreado radial + sombra + brillo) -->
            <ellipse cx="110" cy="266" rx="46" ry="9" fill="#f1e6dc"/>
            <path d="M100 196A34 34 0 1 1 100 264Z" fill="url(#skinGradient)" stroke="#5c8a34" stroke-width="1"/>
            <path d="M100 200A30 30 0 1 1 100 260Z" fill="#f6ecd9"/>
            <path d="M100 204A26 26 0 1 1 100 256Z" fill="url(#pulpRadial)"/>
            <path d="M84 210a30 30 0 0 1 10-20" stroke="#fff" stroke-width="2" fill="none" opacity="0.35" stroke-linecap="round"/>
            <circle cx="107" cy="214" r="1.8" fill="#e8b84b"/>
            <circle cx="118" cy="222" r="1.8" fill="#e8b84b"/>
            <circle cx="113" cy="234" r="1.8" fill="#e8b84b"/>
            <circle cx="103" cy="242" r="1.8" fill="#e8b84b"/>
            <circle cx="120" cy="246" r="1.8" fill="#e8b84b"/>
            <circle cx="109" cy="252" r="1.8" fill="#e8b84b"/>

            <!-- 3. Cocción: paila de cobre al fuego con paleta y vapor -->
            <path d="M95 425c-6-10-2-18 4-24-1 8 4 10 4 16 0 6-4 10-8 8Z" fill="#ff8a3d"/>
            <path d="M115 428c-6-9-2-16 4-22-1 7 4 9 4 14 0 6-4 9-8 8Z" fill="#ff6b35"/>
            <path d="M105 431c-5-8-1-14 4-19-1 6 3 8 3 12 0 5-3 8-7 7Z" fill="#ffb347"/>
            <path d="M55 372A55 16 0 0 0 165 372L160 396A50 14 0 0 1 60 396Z" fill="#b5652c"/>
            <ellipse cx="110" cy="372" rx="55" ry="16" fill="url(#copperGradient)" stroke="#8a4f22" stroke-width="2"/>
            <ellipse cx="110" cy="374" rx="46" ry="12" fill="#c1416a"/>
            <ellipse cx="98" cy="370" rx="14" ry="5" fill="#e07d96" opacity="0.5"/>
            <path d="M15 350L95 372" stroke="#a9723c" stroke-width="6" stroke-linecap="round"/>
            <ellipse cx="95" cy="372" rx="10" ry="5" fill="#c98a52" transform="rotate(-18 95 372)"/>
            <path d="M90 350c-6-8 6-12 0-20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
            <path d="M110 346c-6-8 6-12 0-20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4"/>
            <path d="M130 350c-6-8 6-12 0-20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>

            <!-- 4. Producto final: bocadillo envuelto -->
            <ellipse cx="110" cy="562" rx="55" ry="8" fill="#f1e6dc"/>
            <path d="M70 552c20 10 90 10 110 0v8c-20 10-90 10-110 0Z" fill="url(#leafGradient)" opacity="0.9"/>
            <rect x="75" y="505" width="70" height="26" rx="5" fill="#c97b3c"/>
            <rect x="75" y="508" width="70" height="6" rx="3" fill="#e6af77" opacity="0.75"/>
            <rect x="85" y="525" width="70" height="26" rx="5" fill="#b8692f"/>
            <rect x="85" y="528" width="70" height="6" rx="3" fill="#d99a5c" opacity="0.75"/>
          </svg>
        </div>

        <div class="visual-card visual-card--secondary">
          <div class="process-steps" aria-label="Etapas del proceso">
            <div class="process-step">
              <span class="process-step__icon" aria-hidden="true"><i class="fa-solid fa-seedling"></i></span>
              <div class="process-step__label">Selección</div>
            </div>
            <div class="process-step">
              <span class="process-step__icon" aria-hidden="true"><i class="fa-solid fa-bowl-food"></i></span>
              <div class="process-step__label">Despulpado</div>
            </div>
            <div class="process-step">
              <span class="process-step__icon" aria-hidden="true"><i class="fa-solid fa-fire-burner"></i></span>
              <div class="process-step__label">Cocción</div>
            </div>
            <div class="process-step">
              <span class="process-step__icon" aria-hidden="true"><i class="fa-solid fa-box"></i></span>
              <div class="process-step__label">Producto final</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const startButton = hero.querySelector(".btn");
  const processButton = hero.querySelector(".btn--ghost");

  startButton.addEventListener("click", () => {
    state.currentModuleIndex = 0;
    state.currentQuestionIndex = 0;
    state.selectedOption = null;
    state.feedback = null;
    state.screen = "module";
    state.introDismissed = false;
    render();
  });

  processButton.addEventListener("click", () => {
    state.screen = "map";
    render();
  });

  app.appendChild(hero);
}

/* ---------------- Mapa de módulos ---------------- */
function renderMap() {
  const wrap = document.createElement("section");

  const title = document.createElement("h2");
  title.className = "map-title";
  title.textContent = "Proceso del bocadillo veleño";
  wrap.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.className = "map-subtitle";
  subtitle.textContent = `Módulos completados: ${state.completed.length} de ${TOTAL_MODULES}`;
  wrap.appendChild(subtitle);

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  const fill = document.createElement("div");
  fill.className = "progress-bar__fill";
  fill.style.width = `${(state.completed.length / TOTAL_MODULES) * 100}%`;
  progressBar.appendChild(fill);
  wrap.appendChild(progressBar);

  const path = document.createElement("div");
  path.className = "path";

  MODULES.forEach((mod, index) => {
    const isDone = state.completed.includes(mod.id);
    const isUnlocked = index <= state.unlockedIndex;
    const isCurrent = isUnlocked && !isDone;

    const node = document.createElement("button");
    node.className =
      "node" + (isDone ? " node--done" : "") + (isCurrent ? " node--current" : "");
    node.disabled = !isUnlocked;

    node.innerHTML = `
      <span class="node__badge">${isDone ? "<i class='fa-solid fa-check'></i>" : index + 1}</span>
      <span class="node__text">
        <div class="node__title">Módulo ${mod.id}</div>
        <div class="node__stage">${mod.stage}</div>
      </span>
      <span class="node__status">${isUnlocked ? (isDone ? "<i class='fa-solid fa-circle-check'></i>" : "<i class='fa-solid fa-play'></i>") : "<i class='fa-solid fa-lock'></i>"}</span>
    `;

    if (isUnlocked) {
      node.addEventListener("click", () => {
        state.currentModuleIndex = index;
        state.currentQuestionIndex = 0;
        state.selectedOption = null;
        state.feedback = null;
        state.screen = "module";
        render();
      });
    }

    path.appendChild(node);
  });

  wrap.appendChild(path);
  app.appendChild(wrap);
}

/* ---------------- Pantalla de módulo ---------------- */
function renderModule() {
  const mod = MODULES[state.currentModuleIndex];
  const q = mod.questions[state.currentQuestionIndex];
  const isIntro = state.currentQuestionIndex === 0 && state.feedback === null && state.introShown !== mod.id;

  const card = document.createElement("section");
  card.className = "card";

  const eyebrow = document.createElement("div");
  eyebrow.className = "card__eyebrow";
  eyebrow.textContent = `Módulo ${mod.id} de ${TOTAL_MODULES}`;
  card.appendChild(eyebrow);

  const h2 = document.createElement("h2");
  h2.textContent = mod.stage;
  card.appendChild(h2);

  // Mostrar la introducción del módulo solo antes de la primera pregunta
  if (state.currentQuestionIndex === 0 && !state.introDismissed) {
    const p = document.createElement("p");
    p.textContent = mod.intro;
    card.appendChild(p);

    const actions = document.createElement("div");
    actions.className = "card__actions";
    const back = document.createElement("button");
    back.className = "btn btn--ghost";
    back.innerHTML = "<i class='fa-solid fa-arrow-left'></i> Volver al mapa";
    back.addEventListener("click", () => {
      state.screen = "map";
      render();
    });
    const start = document.createElement("button");
    start.className = "btn btn--leaf";
    start.innerHTML = "<i class='fa-solid fa-arrow-right'></i> Empezar preguntas";
    start.addEventListener("click", () => {
      state.introDismissed = true;
      render();
    });
    actions.appendChild(back);
    actions.appendChild(start);
    card.appendChild(actions);

    app.appendChild(card);
    return;
  }

  // Indicador de progreso de preguntas dentro del módulo
  const dots = document.createElement("div");
  dots.className = "question-progress";
  mod.questions.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className =
      "question-progress__dot" +
      (i < state.currentQuestionIndex ? " question-progress__dot--done" : "") +
      (i === state.currentQuestionIndex ? " question-progress__dot--current" : "");
    dots.appendChild(dot);
  });
  card.appendChild(dots);

  const prompt = document.createElement("p");
  prompt.textContent = q.prompt;
  card.appendChild(prompt);

  const options = document.createElement("div");
  options.className = "options";

  const optionList =
    q.type === "mc" ? q.options : ["Sí", "No"];

  optionList.forEach((label, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = label;

    const isCorrectOption =
      q.type === "mc" ? i === q.correct : (i === 0) === q.correct;

    if (state.feedback) {
      if (state.selectedOption === i && state.feedback.correct) {
        btn.classList.add("option--correct");
      } else if (state.selectedOption === i && !state.feedback.correct) {
        btn.classList.add("option--incorrect");
      } else if (!state.feedback.correct && isCorrectOption) {
        // no revelamos la respuesta correcta al fallar, solo la pista
      }
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => {
        state.selectedOption = i;
        state.feedback = {
          correct: isCorrectOption,
          text: isCorrectOption
            ? "¡Correcto! Vas por buen camino."
            : q.hint,
        };
        render();
      });
    }

    options.appendChild(btn);
  });

  card.appendChild(options);

  if (state.feedback) {
    const fb = document.createElement("div");
    fb.className = "feedback " + (state.feedback.correct ? "feedback--ok" : "feedback--hint");
    fb.textContent = state.feedback.text;
    card.appendChild(fb);

    const actions = document.createElement("div");
    actions.className = "card__actions";

    if (state.feedback.correct) {
      const next = document.createElement("button");
      next.className = "btn btn--leaf";
      const isLastQuestion = state.currentQuestionIndex === mod.questions.length - 1;
      next.innerHTML = isLastQuestion ? "<i class='fa-solid fa-check'></i> Terminar módulo" : "<i class='fa-solid fa-arrow-right'></i> Siguiente pregunta";
      next.addEventListener("click", () => {
        if (isLastQuestion) {
          completeModule(mod);
        } else {
          state.currentQuestionIndex += 1;
          state.selectedOption = null;
          state.feedback = null;
          render();
        }
      });
      actions.appendChild(next);
    } else {
      const retry = document.createElement("button");
      retry.className = "btn";
      retry.innerHTML = "<i class='fa-solid fa-rotate-right'></i> Intentar de nuevo";
      retry.addEventListener("click", () => {
        state.selectedOption = null;
        state.feedback = null;
        render();
      });
      actions.appendChild(retry);
    }

    card.appendChild(actions);
  }

  app.appendChild(card);
}

function completeModule(mod) {
  if (!state.completed.includes(mod.id)) {
    state.completed.push(mod.id);
  }
  state.unlockedIndex = Math.min(state.unlockedIndex + 1, TOTAL_MODULES - 1);
  state.introDismissed = false;

  if (state.completed.length === TOTAL_MODULES) {
    state.screen = "finish";
  } else {
    state.screen = "map";
  }
  render();
}

/* ---------------- Pantalla final ---------------- */
function renderFinish() {
  const wrap = document.createElement("section");
  wrap.className = "finish";
  wrap.innerHTML = `
    <div class="finish__emoji"><i class="fa-solid fa-trophy"></i></div>
    <h2>¡Completaste el proceso del bocadillo veleño!</h2>
    <p>Repasa aquí las 6 etapas que acabas de aprender:</p>
  `;

  const summary = document.createElement("div");
  summary.className = "summary";
  MODULES.forEach((mod) => {
    const item = document.createElement("div");
    item.className = "summary__item";
    item.innerHTML = `<b>${mod.id}. ${mod.stage}:</b> ${mod.intro}`;
    summary.appendChild(item);
  });
  wrap.appendChild(summary);

  const restart = document.createElement("button");
  restart.className = "btn btn--caramel";
  restart.innerHTML = "<i class='fa-solid fa-rotate-left'></i> Jugar de nuevo";
  restart.addEventListener("click", resetToHome);
  wrap.appendChild(restart);

  app.appendChild(wrap);
}

render();
