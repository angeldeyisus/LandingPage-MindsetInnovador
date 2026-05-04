class ebookSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const isCompact = this.hasAttribute("compact");

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/ebookSection/ebookSection.css">

      <div class="container ${isCompact ? "compact" : ""}">
        <div class="content">
          <div class="image">
            <img src="/Img/ebook_portada.png" alt="ebook">
          </div>

          <div class="text">
            <h1>${isCompact ? "Obtén el ebook 🚀" : "DESCUBRE EL MINDSET INNOVADOR"}</h1>

            <p class="${isCompact ? "hide" : ""}">
              Una colección de mas de 100 frases creadas para inspirar creatividad, reflexión y acción en estudiantes, emprendedores, líderes y personas que buscan transformar su entorno.
            </p>

            <div class="form">
            ${
              isCompact
                ? `<button id="go-to-ebook">Ver Ebook</button>`
                : `
                  <input type="text" placeholder="Tu nombre ">
                  <input type="email" placeholder="Email">
                  <button>Descarga e-book gratis</button>
                `
            }
          </div>

            <div class="footer ${isCompact ? "hide" : ""}">
              
            </div>
          </div>
        </div>
      </div>
    `;



  const btn = this.shadowRoot.querySelector("button");

  if (btn) {
    btn.addEventListener("click", () => {
      window.track("click_descargar");
    });
  }

if (isCompact) {
  const btn = this.shadowRoot.querySelector("#go-to-ebook");

  btn.addEventListener("click", () => {
    const hero = document.querySelector("#hero");

    hero.scrollIntoView({
      behavior: "smooth"
    });
  });
}

    
  }
}

customElements.define("ebook-section", ebookSection);