document.addEventListener('DOMContentLoaded', () => {
    // Array simulando las frases
    const frasesInnovacion = [
        "La innovación distingue a los líderes de los seguidores.",
        "No puedes agotar la creatividad. Mientras más la usas, más tienes.",
        "El mayor riesgo es no correr ningún riesgo.",
        "Si buscas resultados distintos, no hagas siempre lo mismo.",
        "La creatividad es la inteligencia divirtiéndose.",
        "Un problema bien planteado es un problema medio resuelto.",
        "La innovación nace de la curiosidad, no de la certeza.",
        "Falla rápido, aprende más rápido."
    ];

    // Variables de control
    let clics = 0;
    const clicsParaDescarga = -1;
    let isOpen = false;
    let mostroFormulario = false; // Nueva bandera para saber si ya lo interrumpimos

    // Elementos del DOM
    const origamiWrapper = document.getElementById('origami-btn');
    const origamiPaper = document.getElementById('origami-paper');
    const textoFrase = document.getElementById('frase-texto');
    const contadorTexto = document.getElementById('contador-frases');
    const downloadTrigger = document.getElementById('download-trigger');
    const btnAhoraNo = document.getElementById('btn-ahora-no'); // Nuevo botón

    // Lógica al hacer clic en el Origami
    origamiWrapper.addEventListener('click', () => {
        // Si está cerrado, lo abrimos y mostramos una frase
        if (!isOpen) {
            // Elegir frase aleatoria
            const fraseAleatoria = frasesInnovacion[Math.floor(Math.random() * frasesInnovacion.length)];
            textoFrase.textContent = `"${fraseAleatoria}"`;
            
            // Animación de desdoblar
            origamiPaper.classList.add('is-open');
            clics++;
            
            // Actualizar texto del contador
            if (!mostroFormulario && clics <= clicsParaDescarga) {
                contadorTexto.textContent = `Ideas descubiertas: ${clics} / ${clicsParaDescarga}`;
            } else {
                contadorTexto.textContent = `Ideas descubiertas: ${clics}`; // Contador infinito
            }

            isOpen = true;

            // Revisar si llegamos a 5 clics por primera vez
            if (clics === clicsParaDescarga && !mostroFormulario) {
                setTimeout(() => {
                    // Ocultar el origami y mostrar formulario
                    origamiWrapper.style.display = 'none';
                    contadorTexto.style.display = 'none';
                    downloadTrigger.style.display = 'block';
                    mostroFormulario = true; // Marcamos que ya se le ofreció descargar
                }, 1500); 
            }
        } else {
            // Si está abierto, lo volvemos a doblar
            origamiPaper.classList.remove('is-open');
            isOpen = false;
        }
    });

    // Lógica para el botón "Ahora no"
    btnAhoraNo.addEventListener('click', () => {
        // Ocultar el formulario
        downloadTrigger.style.display = 'none';
        
        // Volver a mostrar el origami y el contador
        origamiWrapper.style.display = 'block';
        contadorTexto.style.display = 'block';
        contadorTexto.textContent = `Ideas descubiertas: ${clics}`;
        
        // Doblar el papel para que esté listo para el siguiente clic
        origamiPaper.classList.remove('is-open');
        isOpen = false;
    });
});





const hero = document.querySelector("#hero");
const btn = document.querySelector("#floating-ebook-btn");

window.addEventListener("scroll", () => {
  const heroBottom = hero.getBoundingClientRect().bottom;

  if (heroBottom < 0) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
});

// scroll al volver
btn.addEventListener("click", () => {
  hero.scrollIntoView({
    behavior: "smooth"
  });
});





// Para que la barra de navegacion este seleccionada en la seccion actual
const sections = document.querySelectorAll("section, header");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    // cuando la sección está visible (ajusta 100 a tu navbar)
    if (rect.top <= 86 && rect.bottom >= 86) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});





//Funcion para la seccion de juegos
function mostrarVista(vista) {
  const juegos = document.getElementById("juegos");
  const extra = document.getElementById("extra");

  if (vista === "juego") {
    juegos.classList.remove("oculto");
    extra.classList.add("oculto");
  }

  if (vista === "extra") {
    juegos.classList.add("oculto");
    extra.classList.remove("oculto");
    cargarMicrofrontend();
  }
}



function cargarMicrofrontend() {
  const container = document.getElementById("micro-app");

  if (!container) return;
  if (container.dataset.loaded) return;

  import("/components/juegoUnirFrases/UnirFrases.js")
    .then(module => {
      module.render(container);
      container.dataset.loaded = "true";
    })
    .catch(err => console.error("Error cargando microfrontend:", err));
}





document.addEventListener("DOMContentLoaded", () => {
  mostrarVista("juego");
});