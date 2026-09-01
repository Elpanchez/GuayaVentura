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

function render() {
  app.innerHTML = "";
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
    <div class="hero__emoji">🍬🍈</div>
    <h1>GuayaVentura</h1>
    <p class="hero__tagline">El camino del bocadillo veleño</p>
    <p>
      Aprende, paso a paso y jugando, cómo se elabora el bocadillo veleño:
      desde la selección de la guayaba hasta que llega empacado a tus manos.
      Supera las 6 etapas respondiendo correctamente para avanzar.
    </p>
  `;
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = "Comenzar";
  btn.addEventListener("click", () => {
    state.screen = "map";
    render();
  });
  hero.appendChild(btn);
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
      <span class="node__badge">${isDone ? "✓" : index + 1}</span>
      <span class="node__text">
        <div class="node__title">Módulo ${mod.id}</div>
        <div class="node__stage">${mod.stage}</div>
      </span>
      <span class="node__status">${isUnlocked ? (isDone ? "🟢" : "▶️") : "🔒"}</span>
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
    back.textContent = "Volver al mapa";
    back.addEventListener("click", () => {
      state.screen = "map";
      render();
    });
    const start = document.createElement("button");
    start.className = "btn btn--leaf";
    start.textContent = "Empezar preguntas";
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
      next.textContent = isLastQuestion ? "Terminar módulo" : "Siguiente pregunta";
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
      retry.textContent = "Intentar de nuevo";
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
    <div class="finish__emoji">🎉🍬</div>
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
  restart.textContent = "Jugar de nuevo";
  restart.addEventListener("click", () => {
    state.screen = "home";
    state.unlockedIndex = 0;
    state.completed = [];
    state.currentModuleIndex = null;
    state.currentQuestionIndex = 0;
    state.selectedOption = null;
    state.feedback = null;
    state.introDismissed = false;
    render();
  });
  wrap.appendChild(restart);

  app.appendChild(wrap);
}

render();
