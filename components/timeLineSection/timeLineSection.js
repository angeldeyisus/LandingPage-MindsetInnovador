class InnovationTimeline extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href=".//components/timeLineSection/timeLineSection.css">

      <section class="timeline">

        ${this.renderSection("🌱", "Antes de innovar: La semilla",
        "Toda innovación comienza antes de existir. Nace en la curiosidad, en cuestionar lo establecido y en mirar donde otros no miran.",
        "Aquí no buscas respuestas, buscas mejores preguntas. Es el momento de observar, empatizar y abrir posibilidades.",
        "left", "#eef6ff")}

        ${this.renderSection("⚡", "Encender la chispa",
        "Las ideas comienzan a tomar forma. Es el espacio del caos creativo donde experimentar vale más que acertar.",
        "Aquí se conecta, se prueba, se rompe y se vuelve a intentar. La creatividad aparece cuando dejas de buscar perfección.",
        "right", "#fff7ed")}

        ${this.renderSection("🔍", "Desarrollo y validación",
        "La idea sale al mundo y deja de ser tuya. Ahora importa lo que otros sienten y experimentan.",
        "Validar no es confirmar, es descubrir cómo mejorar. Aquí se ajusta, se aprende y se redefine.",
        "left", "#f0fdf4")}

        ${this.renderSection("🚀", "Implementación",
        "La innovación se convierte en impacto cuando se implementa y llega a las personas.",
        "Aquí es donde transforma realidades y genera valor colectivo.",
        "right", "#ecfdf5")}

        ${this.renderSection("🔄", "Aprendizaje",
        "Cada innovación abre la puerta a la siguiente. Nada termina realmente.",
        "Reflexionar convierte la experiencia en crecimiento y nuevas oportunidades.",
        "left", "#f5f3ff")}

      </section>
    `;
  }

  renderSection(icon, title, text1, text2, side, bg) {
    return `
      <div class="section ${side}" style="background:${bg}">
        
        <div class="visual">
          <span class="icon">${icon}</span>
        </div>

        <div class="content">
          <h2>${title}</h2>
          <p>${text1}</p>
          <p>${text2}</p>
        </div>

      </div>
    `;
  }
}

if (!customElements.get("innovation-timeline")) {
  customElements.define("innovation-timeline", InnovationTimeline);
}