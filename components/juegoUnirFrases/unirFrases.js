export function render(container) {
  const pairs = [
    { left: "Innovar es sembrar preguntas", right: "donde otros siembran respuestas" },
    { left: "El fracaso es un maestro caro,", right: "pero sus lecciones duran toda la vida" },
    { left: "Cada innovación es semilla:", right: "algunas germinan, otras fertilizan futuros intentos" },
    { left: "La mejor métrica de impacto", right: "es la sonrisa del usuario que percibe el valor entregado" },
    { left: "El final de una innovación", right: "es el comienzo de la siguiente" },
    { left: "El innovador no busca el aplauso,", right: "busca el impacto positivo" }

  ];

  let selectedLeft = null;
  let selectedRight = null;

  const states = new Map();

  container.innerHTML = `
    <div class="match-game">
      <h2>Conecta las frases</h2>

      <button class="btn-secondary" id="restart-game">
        🔄
      </button>

      <div class="game-board">
        <div class="column left"></div>
        <div class="column right"></div>
      </div>
    </div>
  `;

  const leftCol = container.querySelector(".left");
  const rightCol = container.querySelector(".right");

  // 🔀 shuffle correcto (Fisher-Yates)
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function clearSelection(side) {
    const buttons = container.querySelectorAll(`.${side} .match-btn`);
    buttons.forEach(btn => btn.classList.remove("selected"));
  }

  function resetSelection() {
    selectedLeft = null;
    selectedRight = null;
  }

  function checkMatch() {
    if (!selectedLeft || !selectedRight) return;

    const isMatch = pairs.some(
      p =>
        p.left === selectedLeft.text &&
        p.right === selectedRight.text
    );

    if (isMatch) {
      selectedLeft.btn.classList.add("correct");
      selectedRight.btn.classList.add("correct");

      states.set(selectedLeft.text, "locked");
      states.set(selectedRight.text, "locked");

      resetSelection();
    } else {
      selectedLeft.btn.classList.add("wrong");
      selectedRight.btn.classList.add("wrong");

      setTimeout(() => {
        selectedLeft.btn.classList.remove("wrong", "selected");
        selectedRight.btn.classList.remove("wrong", "selected");
        resetSelection();
      }, 800);
    }
  }

  function createButton(text, side) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.classList.add("match-btn");

    btn.addEventListener("click", () => {
      if (states.get(text) === "locked") return;

      if (side === "left") {
        clearSelection("left");
        selectedLeft = { text, btn };
      } else {
        clearSelection("right");
        selectedRight = { text, btn };
      }

      btn.classList.add("selected");
      checkMatch();
    });

    return btn;
  }

  function initGame() {
    leftCol.innerHTML = "";
    rightCol.innerHTML = "";

    selectedLeft = null;
    selectedRight = null;
    states.clear();

    // 🔥 1. mezclar TODOS los pares
    const shuffledPairs = shuffle(pairs);

    // 🔥 2. tomar solo 4
    const selectedPairs = shuffledPairs.slice(0, 4);

    // 🔥 3. separar izquierda y derecha
    const leftItems = selectedPairs.map(p => p.left);
    const rightItems = selectedPairs.map(p => p.right);

    // 🔀 mezclar lados independiente
    const shuffledLeft = shuffle(leftItems);
    const shuffledRight = shuffle(rightItems);

    // render izquierda
    shuffledLeft.forEach(text => {
      leftCol.appendChild(createButton(text, "left"));
    });

    // render derecha
    shuffledRight.forEach(text => {
      rightCol.appendChild(createButton(text, "right"));
    });
  }

  container.querySelector("#restart-game")
    .addEventListener("click", initGame);

  initGame();
}

