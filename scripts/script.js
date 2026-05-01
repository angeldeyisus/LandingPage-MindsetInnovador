document.addEventListener('DOMContentLoaded', () => {
    // 1. Definición de las Secciones, Rangos de Imágenes y Colores
    // Nota: Ajusté la sección 1 a terminar en 31 para que no choque con la sección 2.
    const secciones = [
        { id: 1, min: 8, max: 31, color: "#10B981" },   // Verde (La Semilla)
        { id: 2, min: 34, max: 61, color: "#F59E0B" },  // Amarillo (Ideación)
        { id: 3, min: 64, max: 85, color: "#3B82F6" },  // Azul (En Acción)
        { id: 4, min: 88, max: 106, color: "#FF5C35" }, // Naranja/Rojo (Lanzar)
        { id: 5, min: 109, max: 125, color: "#8B5CF6" } // Morado (Aprendizaje)
    ];

    // 2. Generar un arreglo con todos los números de imagen válidos
    let imagenesValidas = [];
    secciones.forEach(sec => {
        for (let i = sec.min; i <= sec.max; i++) {
            imagenesValidas.push({ numero: i, color: sec.color, seccion: sec.id });
        }
    });

    // Variables de control
    let clics = 0;
    const clicsParaDescarga = -1;
    let isOpen = false;
    let mostroFormulario = false;

    // Elementos del DOM
    const origamiWrapper = document.getElementById('origami-btn');
    const origamiPaper = document.getElementById('origami-paper');
    const origamiBack = document.getElementById('origami-back-container');
    const imagenFrase = document.getElementById('frase-imagen');
    const contadorTexto = document.getElementById('contador-frases');
    const downloadTrigger = document.getElementById('download-trigger');
    const btnAhoraNo = document.getElementById('btn-ahora-no');

    // 3. Lógica principal al hacer clic
    origamiWrapper.addEventListener('click', () => {
        if (!isOpen) {
            // Elegir una imagen PNG al azar
            const seleccionAleatoria = imagenesValidas[Math.floor(Math.random() * imagenesValidas.length)];
            
            // Asignar la ruta de la imagen (Asegúrate de que la carpeta se llame "imagenes")
            imagenFrase.src = `img/${seleccionAleatoria.numero}.png`;
            imagenFrase.style.display = 'block';

            // Aplicar el color correspondiente a la sección
            origamiBack.style.borderColor = seleccionAleatoria.color;
            origamiBack.style.boxShadow = `0 10px 30px ${seleccionAleatoria.color}33`; // Sombra suave del color

            // Animación de desdoblar
            origamiPaper.classList.add('is-open');
            clics++;
            
            // Lógica del contador
            if (!mostroFormulario && clics <= clicsParaDescarga) {
                contadorTexto.textContent = `Ideas descubiertas: ${clics} / ${clicsParaDescarga}`;
            } else {
                contadorTexto.textContent = `Ideas descubiertas: ${clics}`;
            }

            isOpen = true;

            // Revisar límite para el formulario
            if (clics === clicsParaDescarga && !mostroFormulario) {
                setTimeout(() => {
                    origamiWrapper.style.display = 'none';
                    contadorTexto.style.display = 'none';
                    downloadTrigger.style.display = 'block';
                    mostroFormulario = true;
                }, 1500); 
            }
        } else {
            // Doblar el papel (cerrar)
            origamiPaper.classList.remove('is-open');
            // Ocultar imagen brevemente para que no se vea al girar
            setTimeout(() => { 
              imagenFrase.style.display = 'none';
            }, 300);
            isOpen = false;
        }
    });

    // 4. Lógica del botón "Ahora no"
    if (btnAhoraNo) {
        btnAhoraNo.addEventListener('click', () => {
            // Ocultar formulario
            downloadTrigger.style.display = 'none';

            // Mostrar origami otra vez
            origamiWrapper.style.display = 'block';
            contadorTexto.style.display = 'block';

            // REINICIAR VARIABLES
            clics = 0;
            mostroFormulario = false;

            // Reset visual
            contadorTexto.textContent = `Ideas descubiertas: 0`;
            imagenFrase.style.display = 'none';
            origamiPaper.classList.remove('is-open');
            isOpen = false;

            // (opcional) quitar color anterior
            origamiBack.style.borderColor = "";
            origamiBack.style.boxShadow = "";
        });
    }
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
    .then(() => {
      container.innerHTML = `<match-game></match-game>`; // ✅ usamos el componente
      container.dataset.loaded = "true";
    })
    .catch(err => console.error("Error cargando microfrontend:", err));
}




document.addEventListener("DOMContentLoaded", () => {
  mostrarVista("juego");
});

document.addEventListener("DOMContentLoaded", () => {
    const btnCoffee = document.querySelector(".btn-coffee");

    if (btnCoffee) {
        btnCoffee.addEventListener("click", () => {
            alert("Gracias por tu interés 🙌\nPróximamente podrás apoyar al autor.");
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const btnCoffee = document.querySelector(".btn-contactame");

    if (btnCoffee) {
        btnCoffee.addEventListener("click", () => {
            alert("Este es mi correo");
        });
    }
});

document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
        const item = header.parentElement;

        document.querySelectorAll(".accordion-item").forEach(i => {
            if (i !== item) i.classList.remove("active");
        });

        item.classList.toggle("active");
    });
});