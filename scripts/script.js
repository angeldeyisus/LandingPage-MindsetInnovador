let ebookBackend = null;

try {
  ebookBackend = new window.EbookBackend({
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY
  });
  ebookBackend.init();
} catch (error) {
  console.warn('EbookBackend no inicializado:', error.message);
}

document.addEventListener('DOMContentLoaded', () => {

    const secciones = [ 
        { id: 1, min: 8, max: 31, color: "#10B981" },   // Verde (La Semilla)
        { id: 2, min: 34, max: 61, color: "#F59E0B" },  // Amarillo (IdeaciÃ³n)
        { id: 3, min: 64, max: 85, color: "#3B82F6" },  // Azul (En AcciÃ³n)
        { id: 4, min: 88, max: 106, color: "#FF5C35" }, // Naranja/Rojo (Lanzar)
        { id: 5, min: 109, max: 125, color: "#8B5CF6" } // Morado (Aprendizaje)
    ];

    // Función para compartir en Instagram Stories
    const shareToInstagramStory = (imagePath) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const instagramScheme = 'instagram://story-camera';
        const instagramWeb = 'https://www.instagram.com';

        const openInstagram = () => {
            window.location.href = instagramScheme;
            setTimeout(() => {
                window.open(instagramWeb, '_blank');
            }, 500);
        };

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    alert('No se pudo preparar la imagen para compartir. Intenta de nuevo.');
                    return;
                }

                const file = new File([blob], `frase-mindset-${Date.now()}.png`, { type: 'image/png' });
                const canShareFile = navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share;

                if (canShareFile) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'Mindset Innovador',
                            text: 'Comparte esta frase en tu historia de Instagram.',
                        });
                        return;
                    } catch (error) {
                        console.log('Share API error:', error);
                    }
                }

                if (isMobile) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    alert('📸 Imagen descargada. Abre Instagram, elige tu historia y sube esta frase.');
                    openInstagram();
                    return;
                }

                try {
                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                    alert('✅ Imagen copiada al portapapeles. Abre Instagram Stories y pega la imagen.');
                } catch (error) {
                    console.log('Clipboard error:', error);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    alert('📸 Imagen descargada. Abre Instagram y sube esta imagen como Story.');
                }

                window.open('https://www.instagram.com/stories/create/', '_blank');
            }, 'image/png');
        };

        img.onerror = () => {
            alert('No se pudo cargar la imagen. Intenta de nuevo.');
        };

        img.src = imagePath;
    };
    
    // Hacer la función accesible globalmente
    window.shareToInstagramStory = shareToInstagramStory;

    //  Generar un arreglo con todos los numeros de imagen validos
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
    let currentOrigamiImageNumber = null;

    // Elementos del DOM
    const origamiWrapper = document.getElementById('origami-btn');
    const origamiPaper = document.getElementById('origami-paper');
    const origamiBack = document.getElementById('origami-back-container');
    const imagenFrase = document.getElementById('frase-imagen');
    const contadorTexto = document.getElementById('contador-frases');
    const downloadTrigger = document.getElementById('download-trigger');
    const btnAhoraNo = document.getElementById('btn-ahora-no');
    const origamiLikeBtn = document.getElementById('origami-like-btn');
    const origamiShareBtn = document.getElementById('origami-share-btn');
    const origamiLikeCount = document.getElementById('origami-like-count');

    // 3. Logica principal al hacer clic
    origamiWrapper.addEventListener('click', () => {
        if (!isOpen) {
            // Elegir una imagen PNG al azar
            const seleccionAleatoria = imagenesValidas[Math.floor(Math.random() * imagenesValidas.length)];
            
            // Asignar la ruta de la imagen 
            imagenFrase.src = `Img/${seleccionAleatoria.numero}.png`;

            // Aplicar el color correspondiente a la seccionn
            origamiBack.style.borderColor = seleccionAleatoria.color;
            origamiBack.style.boxShadow = `0 10px 30px ${seleccionAleatoria.color}33`; // Sombra suave del color

            // Animacion de desdoblar
            origamiPaper.classList.add('is-open');
            clics++;
            currentOrigamiImageNumber = seleccionAleatoria.numero;
            updateOrigamiLikeInfo();
            
            // Lpgica del contador
            if (!mostroFormulario && clics <= clicsParaDescarga) {
                contadorTexto.textContent = `Ideas descubiertas: ${clics} / ${clicsParaDescarga}`;
            } else {
                contadorTexto.textContent = `Ideas descubiertas: ${clics}`;
            }

            isOpen = true;

            // Revisar limite para el formulario
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
            isOpen = false;
        }
    });

    // 4. Logica del boton "Ahora no"
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
            origamiPaper.classList.remove('is-open');
            isOpen = false;

            // (opcional) quitar color anterior
            origamiBack.style.borderColor = "";
            origamiBack.style.boxShadow = "";
        });
    }

    // 5. Votacionn y galeri­a de mas valoradas ordenada por likes
    const galleryImage = document.getElementById('gallery-image');
    const galleryLikeCount = document.getElementById('gallery-like-count');
    const galleryMoreBtn = document.getElementById('gallery-more');
    const choiceImage1 = document.getElementById('choice-image-1');
    const choiceImage2 = document.getElementById('choice-image-2');
    const voteButton1 = document.getElementById('vote-button-1');
    const voteButton2 = document.getElementById('vote-button-2');

    let currentChoicePair = [];
    let gallerySorted = [];
    let galleryIndex = 0;
    const likesByImage = JSON.parse(localStorage.getItem('mindset_likes')) || {};

    const saveLikes = () => {
        localStorage.setItem('mindset_likes', JSON.stringify(likesByImage));
    };

    const getLikes = (numero) => likesByImage[numero] || 0;

    const updateOrigamiLikeInfo = () => {
        if (!origamiLikeCount || currentOrigamiImageNumber === null) return;
        const likes = getLikes(currentOrigamiImageNumber);
        origamiLikeCount.textContent = `${likes} like${likes === 1 ? '' : 's'}`;
    };

    const getSortedGalleryImages = () => {
        return [...imagenesValidas].sort((a, b) => {
            const diff = getLikes(b.numero) - getLikes(a.numero);
            return diff !== 0 ? diff : a.numero - b.numero;
        });
    };

    const renderGalleryCard = () => {
        gallerySorted = getSortedGalleryImages();
        if (!gallerySorted.length || !galleryImage || !galleryLikeCount) return;

        if (galleryIndex >= gallerySorted.length) {
            galleryIndex = 0;
        }

        const current = gallerySorted[galleryIndex];
        galleryImage.src = `Img/${current.numero}.png`;
        galleryImage.alt = `Imagen ${current.numero} - Likes ${getLikes(current.numero)}`;
        galleryLikeCount.textContent = getLikes(current.numero);
    };

    const choosePair = () => {
        const available = [...imagenesValidas];
        const currentNums = currentChoicePair.map(item => item.numero);
        const filtered = available.filter(item => !currentNums.includes(item.numero));

        const getRandomItem = (pool) => {
            if (!pool.length) return null;
            return pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
        };

        const pair = [];
        const source = filtered.length >= 2 ? filtered : available;
        pair.push(getRandomItem(source));
        pair.push(getRandomItem(source));

        return pair;
    };

    const renderChoiceCards = () => {
        if (!choiceImage1 || !choiceImage2 || currentChoicePair.length < 2) return;

        choiceImage1.src = `Img/${currentChoicePair[0].numero}.png`;
        choiceImage1.alt = `OpciÃ³n 1 - Imagen ${currentChoicePair[0].numero}`;
        choiceImage2.src = `Img/${currentChoicePair[1].numero}.png`;
        choiceImage2.alt = `OpciÃ³n 2 - Imagen ${currentChoicePair[1].numero}`;
    };

    const refreshChoicePair = () => {
        currentChoicePair = choosePair();
        if (currentChoicePair[0] && currentChoicePair[1]) {
            renderChoiceCards();
        }
    };

    const handleVote = (index) => {
        const selected = currentChoicePair[index];
        if (!selected) return;

        likesByImage[selected.numero] = getLikes(selected.numero) + 1;
        saveLikes();
        galleryIndex = 0;
        renderGalleryCard();
        refreshChoicePair();
    };

    if (voteButton1) {
        voteButton1.addEventListener('click', () => handleVote(0));
    }

    if (voteButton2) {
        voteButton2.addEventListener('click', () => handleVote(1));
    }

    if (origamiLikeBtn) {
        origamiLikeBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (currentOrigamiImageNumber === null) return;
            likesByImage[currentOrigamiImageNumber] = getLikes(currentOrigamiImageNumber) + 1;
            saveLikes();
            updateOrigamiLikeInfo();
            galleryIndex = 0;
            renderGalleryCard();
        });
    }

    if (origamiShareBtn) {
        origamiShareBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (currentOrigamiImageNumber === null) return;
            shareToInstagramStory(`Img/${currentOrigamiImageNumber}.png`);
        });
    }

    if (galleryMoreBtn) {

        galleryMoreBtn.addEventListener('click', () => {
            gallerySorted = getSortedGalleryImages();
            if (!gallerySorted.length) return;
            galleryIndex = (galleryIndex + 1) % gallerySorted.length;
            renderGalleryCard();
        });
    }

    const galleryShareBtn = document.getElementById('gallery-share-btn');
    if (galleryShareBtn) {
        galleryShareBtn.addEventListener('click', () => {
            gallerySorted = getSortedGalleryImages();
            if (!gallerySorted.length || galleryIndex >= gallerySorted.length) return;
            const currentImage = gallerySorted[galleryIndex];
            shareToInstagramStory(`Img/${currentImage.numero}.png`);
        });
    }

    renderGalleryCard();
    refreshChoicePair();
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
  openEbookModal();
});





// Para que la barra de navegacion este seleccionada en la seccion actual
const sections = document.querySelectorAll("section, header");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

 
    if (rect.top <= 99 && rect.bottom >= 99) {
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

  const vistaJuego = document.getElementById("vista-juego");
  const vistaExtra = document.getElementById("vista-extra");

  const btnJuego = document.getElementById("btn-juego");
  const btnExtra = document.getElementById("btn-extra");

  if (vista === "juego") {

    vistaJuego.classList.remove("oculto");
    vistaExtra.classList.add("oculto");

    btnJuego.classList.add("active");
    btnExtra.classList.remove("active");
  }

  if (vista === "extra") {

    vistaJuego.classList.add("oculto");
    vistaExtra.classList.remove("oculto");

    btnExtra.classList.add("active");
    btnJuego.classList.remove("active");

    cargarMicrofrontend();
  }
}



function cargarMicrofrontend() {
  const container = document.getElementById("micro-app");

  if (!container) return;
  if (container.dataset.loaded) return;

  import("/components/juegoUnirFrases/UnirFrases.js")
    .then(() => {
      container.innerHTML = `<match-game></match-game>`; // âœ… usamos el componente
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
            window.open("https://buymeacoffee.com/jesusgaxiola", "_blank");
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




// ===============================
//  USER ID GLOBAL
// ===============================
window.getUserId = function () {
  let userId = localStorage.getItem("userId");

  if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("userId", userId);
  }

  return userId;
};

// ===============================
//TRACK GLOBAL (REUTILIZABLE)
// ===============================
window.track = function (evento, valor = 1) {
  const userId = window.getUserId();

  let data = JSON.parse(localStorage.getItem("metrics")) || {};

  if (!data[userId]) {
    data[userId] = {};
  }

  data[userId][evento] = (data[userId][evento] || 0) + valor;

  localStorage.setItem("metrics", JSON.stringify(data));
};



window.trackTimeInView = function (element, eventName) {
  let startTime = 0;
  let totalTime = 0;
  let isVisible = false;

  const saveTime = () => {
    window.track(eventName, totalTime);
    totalTime = 0;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTime = Date.now();
        isVisible = true;
      } else if (isVisible) {
        totalTime += Date.now() - startTime;
        saveTime();
        isVisible = false;
      }
    });
  }, { threshold: 0.5 });

  observer.observe(element);

  window.addEventListener("beforeunload", () => {
    if (isVisible) {
      totalTime += Date.now() - startTime;
      saveTime();
    }
  });
};





// Para guardar click el boton flotante de obtener 
const btnLibro = document.getElementById("floating-ebook-btn");

if (btnLibro) {
  btnLibro.addEventListener("click", () => {
    window.track("click_obtener_libro");
    openEbookModal();
  });
}

// Funciones del modal del ebook
function openEbookModal() {
  document.getElementById("ebook-modal").classList.add("active");
}

function closeEbookModal() {
  document.getElementById("ebook-modal").classList.remove("active");
}

async function submitEbookForm() {
  const nameInput = document.getElementById('ebook-name');
  const emailInput = document.getElementById('ebook-email');
  
  if (!nameInput || !emailInput) return;
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  
  if (!name || !email) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Por favor ingresa un email válido');
    return;
  }
  
  if (!ebookBackend || !ebookBackend.isReady()) {
    alert('La integración con Supabase no está configurada. Revisa la URL y la clave en script.js.');
    return;
  }

  const { data, error } = await ebookBackend.saveEbookRequest({ name, email });

  if (error) {
    console.error('Supabase error:', error);
    alert('Hubo un error guardando tu información. Intenta de nuevo más tarde.');
    return;
  }

  alert(`¡Gracias ${name}! Tu registro se guardó correctamente. Te enviaremos el ebook a ${email} pronto.`);
  
  nameInput.value = '';
  emailInput.value = '';
  closeEbookModal();
}

// Cerrar modal al hacer click fuera
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('ebook-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeEbookModal();
      }
    });
  }
  
  // Cerrar modal con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEbookModal();
    }
  });
});


// ===============================
// TIEMPO TOTAL EN LA PÃGINA
// ===============================
let startPageTime = Date.now();

window.addEventListener("beforeunload", () => {
  const total = Date.now() - startPageTime;

  // usa el mismo sistema
  window.track("tiempo_total_pagina", total);
});



//  GUARDAR AL CAMBIAR DE PESTAÃ‘A / MINIMIZAR
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    const total = Date.now() - startPageTime;

    window.track("tiempo_total_pagina", total);

    startPageTime = Date.now(); // reinicia contador
  }
});









// Función reutilizable
function handleEbookClick() {
  window.track("click_obtener_libro");
  openEbookModal();
}

// Botón flotante
const btnLibro1 = document.getElementById("floating-ebook-btn");

if (btnLibro1) {
  btnLibro1.addEventListener("click", handleEbookClick);
}

// Botón dentro del componente
document.addEventListener("click", (e) => {
  const path = e.composedPath();

  const ebookBtn = path.find(
    (el) =>
      el instanceof HTMLElement &&
      el.classList?.contains("ebook-download-btn")
  );

  if (ebookBtn) {
    handleEbookClick();
  }
});





const btnContacto = document.getElementById("btnContacto");
const modal = document.getElementById("modalContacto");
const cerrar = document.querySelector(".cerrar");

btnContacto.addEventListener("click", () => {
  modal.style.display = "flex";
});

cerrar.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});



const form = document.getElementById("formContacto");

const toast = document.getElementById("toast");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  modal.style.display = "none";

  form.reset();

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
});