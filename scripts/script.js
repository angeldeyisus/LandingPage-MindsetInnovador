document.addEventListener('DOMContentLoaded', () => {
    // 1. Definición de las Secciones, Rangos de Imágenes y Colores
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

    // --- AQUÍ ESTABA EL ERROR: Agregamos las variables faltantes ---
    let clics = 0;
    let isOpen = false;
    // ---------------------------------------------------------------

    const clicsParaDescarga = 5;
    let mostroFormulario = false;

    // Elementos del DOM
    const origamiWrapper = document.getElementById('origami-btn');
    const origamiPaper = document.getElementById('origami-paper');
    const origamiBack = document.getElementById('origami-back-container');
    const imagenFrase = document.getElementById('frase-imagen');
    const contadorTexto = document.getElementById('contador-frases');
    const downloadTrigger = document.getElementById('download-trigger');
    const btnAhoraNo = document.getElementById('btn-ahora-no');
    
    const likeBtn = document.querySelector('.like-btn');
    const heartIcon = likeBtn.querySelector('.heart-icon');
    const likeCountTexto = likeBtn.querySelector('.like-count');

    // --- VARIABLES PARA EL MODAL DE COMPARTIR ---
    const shareBtn = document.querySelector('.share-btn');
    const shareModal = document.getElementById('share-modal');
    const closeShareModal = document.getElementById('close-share-modal');
    const sharePreviewImg = document.getElementById('share-preview-img');

    let imagenActualId = null;

    // --- SIMULADOR DE BASE DE DATOS (LocalStorage) ---
    // Carga los likes totales guardados (ej. { "35": 12, "88": 5 })
    let likesDB = JSON.parse(localStorage.getItem('ebook_likes_totales')) || {};
    // Carga qué frases a las que ESTE usuario ya le dio like (ej. [35, 88])
    let misLikes = JSON.parse(localStorage.getItem('ebook_mis_likes')) || [];
    
    // --- AQUÍ ESTABA EL OTRO ERROR: Faltaba llamar a la barra de interacciones ---
    const barraInteracciones = document.getElementById('origami-interactions');
    // -----------------------------------------------------------------------------

    // 3. Lógica principal al hacer clic
    if (origamiWrapper) {
        origamiWrapper.addEventListener('click', () => {
            if (!isOpen) {
                // Elegir una imagen PNG al azar
                const seleccionAleatoria = imagenesValidas[Math.floor(Math.random() * imagenesValidas.length)];
                
                // Asignar la ruta de la imagen
                imagenFrase.src = `Img/${seleccionAleatoria.numero}.png`;
                imagenFrase.style.display = 'block';
                
                // Mostrar barra si existe
                if (barraInteracciones) barraInteracciones.style.display = 'flex';

                imagenActualId = seleccionAleatoria.numero;

                // Si la frase no tiene likes en la BD, le ponemos 0
                if (!likesDB[imagenActualId]) {
                  likesDB[imagenActualId] = 0;
                  }
                likeCountTexto.textContent = likesDB[imagenActualId];

                // Revisar si YO (el usuario actual) ya le di like a esta frase antes
            if (misLikes.includes(imagenActualId)) {
                heartIcon.classList.remove('far'); // Quita el corazón vacío
                heartIcon.classList.add('fas');    // Pone el corazón lleno
                heartIcon.style.color = '#EF4444'; // Lo pinta rojo
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                heartIcon.style.color = ''; // Color gris por defecto
            }

                // Aplicar el color correspondiente a la sección
                origamiBack.style.borderColor = seleccionAleatoria.color;
                origamiBack.style.boxShadow = `0 10px 30px ${seleccionAleatoria.color}33`;

                // Animación de desdoblar
                origamiPaper.classList.add('is-open');
                clics++;
                
                // Contador infinito
                if (contadorTexto) contadorTexto.textContent = `Ideas descubiertas: ${clics}`;

                isOpen = true;
                
            } else {
                // Doblar el papel (cerrar)
                origamiPaper.classList.remove('is-open');
                // Ocultar imagen e interacciones brevemente para que no se vean al girar
                setTimeout(() => { 
                    imagenFrase.style.display = 'none'; 
                    if (barraInteracciones) barraInteracciones.style.display = 'none'; 
                }, 300);
                isOpen = false;
            }
        });
    }

    // --- LÓGICA DEL BOTÓN ME GUSTA ---
    if (likeBtn) {
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // MÁGIA: Evita que el clic cierre el origami

            if (!imagenActualId) return; // Si no hay imagen, no hace nada

            // Si el usuario ya le había dado like, se lo quitamos (-1)
            if (misLikes.includes(imagenActualId)) {
                likesDB[imagenActualId]--;
                // Quitamos el ID de la lista de mis likes
                misLikes = misLikes.filter(id => id !== imagenActualId); 
                
                // Efecto visual: Corazón vacío
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                heartIcon.style.color = ''; 
            } 
            // Si NO le había dado like, se lo sumamos (+1)
            else {
                likesDB[imagenActualId]++;
                // Agregamos el ID a mis likes
                misLikes.push(imagenActualId);
                
                // Efecto visual: Corazón rojo y lleno
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                heartIcon.style.color = '#EF4444';
                
                // (Opcional) Pequeña animación CSS al dar like
                heartIcon.style.transform = 'scale(1.3)';
                setTimeout(() => heartIcon.style.transform = 'scale(1)', 200);
            }

            // Actualizamos el número en la pantalla
            likeCountTexto.textContent = likesDB[imagenActualId];

            // Guardamos los cambios en la "Base de datos" (LocalStorage)
            localStorage.setItem('ebook_likes_totales', JSON.stringify(likesDB));
            localStorage.setItem('ebook_mis_likes', JSON.stringify(misLikes));
        });
    }

    // 1. ABRIR EL MODAL AL DAR CLIC EN COMPARTIR
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // ¡Vital! Evita que la tarjeta del origami se cierre

            // Obtenemos la ruta de la imagen que se está mostrando en ese momento
            const rutaImagenActual = imagenFrase.src;

            // Ponemos esa misma imagen en el pop-up
            sharePreviewImg.src = rutaImagenActual;

            // Mostramos el pop-up en la pantalla
            shareModal.style.display = 'flex';
        });
    }

    // 2. CERRAR EL MODAL AL DAR CLIC EN LA "X"
    if (closeShareModal) {
        closeShareModal.addEventListener('click', () => {
            shareModal.style.display = 'none';
        });
    }

    // 3. CERRAR EL MODAL SI HACEN CLIC AFUERA (en lo oscuro)
    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.style.display = 'none';
            }
        });
    }

    // 4. Lógica del botón "Ahora no"
    if (btnAhoraNo) {
        btnAhoraNo.addEventListener('click', () => {
            // Ocultar formulario
            if (downloadTrigger) downloadTrigger.style.display = 'none';

            // Mostrar origami otra vez
            if (origamiWrapper) origamiWrapper.style.display = 'block';
            if (contadorTexto) {
                contadorTexto.style.display = 'block';
                contadorTexto.textContent = `Ideas descubiertas: 0`;
            }

            // REINICIAR VARIABLES
            clics = 0;
            mostroFormulario = false;

            // Reset visual
            imagenFrase.style.display = 'none';
            origamiPaper.classList.remove('is-open');
            isOpen = false;

            // Quitar color anterior
            origamiBack.style.borderColor = "";
            origamiBack.style.boxShadow = "";
        });
    }
});


// -----------------------------------------------------
// EL RESTO DE TU CÓDIGO (Scroll, Menú, Juegos, etc.)
// -----------------------------------------------------

const hero = document.querySelector("#hero");
const btn = document.querySelector("#floating-ebook-btn");

if (hero && btn) {
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
}


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

    if (juegos && extra) {
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


document.addEventListener("DOMContentLoaded", () => {
    const btnCoffee = document.querySelector(".btn-coffee");

    if (btnCoffee) {
        btnCoffee.addEventListener("click", () => {
            alert("Gracias por tu interés 🙌\nPróximamente podrás apoyar al autor.");
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const btnContactame = document.querySelector(".btn-contactame");

    if (btnContactame) {
        btnContactame.addEventListener("click", () => {
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