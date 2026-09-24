/**
 * INVITACIÓN DIGITAL LUXURY — MIGUEL ÁNGEL & CAROLINA
 * Lógica interactiva: Música, Countdown, Calendario, RSVP, URL Params y Carrusel
 */

document.addEventListener('DOMContentLoaded', () => {
  initMusicController();
  initCountdown();
  initCalendarButton();
  initCopyBank();
  initRSVPWhatsApp();
  initScrollReveal();
  initGalleryCarousel(); // <-- Se añade la inicialización del carrusel aquí
});

/* ==========================================================================
   1. REPRODUCTOR DE MÚSICA Y CONTROL FLOTANTE
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let ambientMusicInterval = null;
const audioEl = new Audio('assets/audio/Chayanne%20-%20Bailando%20Bachata%20(Letra).mp3');
audioEl.loop = true;

function initMusicController() {
  const audioToggle = document.getElementById('audio-toggle');
  if (!audioToggle) return;

  function toggleMusic() {
    if (isAudioPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  }

  audioToggle.addEventListener('click', toggleMusic);
}

function startMusic() {
  const audioToggle = document.getElementById('audio-toggle');

  audioEl.play().then(() => {
    isAudioPlaying = true;
    if (audioToggle) audioToggle.classList.add('playing');
  }).catch(() => {
    startAmbientHarpGenerator();
    isAudioPlaying = true;
    if (audioToggle) audioToggle.classList.add('playing');
  });
}

function pauseMusic() {
  const audioToggle = document.getElementById('audio-toggle');
  audioEl.pause();
  stopAmbientHarpGenerator();
  isAudioPlaying = false;
  if (audioToggle) audioToggle.classList.remove('playing');
}

function startAmbientHarpGenerator() {
  if (ambientMusicInterval) return;
  
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const melody = [
      311.13, 392.00, 466.16, 622.25,
      293.66, 349.23, 466.16, 587.33,
      261.63, 311.13, 392.00, 523.25,
      207.65, 261.63, 311.13, 415.30
    ];
    let noteIdx = 0;

    function playSoftPluck(freq) {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 2.2);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 2.9);
    }

    playSoftPluck(melody[noteIdx]);
    ambientMusicInterval = setInterval(() => {
      noteIdx = (noteIdx + 1) % melody.length;
      playSoftPluck(melody[noteIdx]);
    }, 750);

  } catch (err) {
    console.log('Audio ambient generator note:', err);
  }
}

function stopAmbientHarpGenerator() {
  if (ambientMusicInterval) {
    clearInterval(ambientMusicInterval);
    ambientMusicInterval = null;
  }
}

/* ==========================================================================
   2. CUENTA REGRESIVA EN TIEMPO REAL (17 de Octubre de 2026)
   ========================================================================== */
function initCountdown() {
  const eventDate = new Date('2026-10-17T17:00:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  function update() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
    if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
    if (minsEl) minsEl.innerText = minutes < 10 ? '0' + minutes : minutes;
    if (secsEl) secsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. AGENDAR EN GOOGLE CALENDAR
   ========================================================================== */
function initCalendarButton() {
  const btnCalendar = document.getElementById('btn-calendar');
  if (!btnCalendar) return;

  const title = encodeURIComponent('Renovación de Votos: Miguel Ángel & Carolina (5 Años)');
  const details = encodeURIComponent('Celebración de nuestras Bodas de Madera (5 Años de Matrimonio). ¡Acompáñanos a renovar nuestras promesas de amor!');
  const location = encodeURIComponent('Iglesia de Cristo Rey, Cochabamba, Bolivia');
  const dates = '20261017T210000Z/20261018T070000Z';

  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  btnCalendar.href = gCalUrl;
}

/* ==========================================================================
   4. COPIAR DATOS BANCARIOS CON TOAST
   ========================================================================== */
function initCopyBank() {
  const btnCopy = document.getElementById('btn-copy-bank');
  const toast = document.getElementById('toast-notice');

  if (!btnCopy) return;

  btnCopy.addEventListener('click', () => {
    const bankText = `Datos Bancarios — Miguel Ángel & Carolina
Banco: Banco Unión
Titular: Miguel Ángel & Carolina
Cuenta: 10000045892314
Alias: MIGUEL.Y.CAROLINA.5`;

    navigator.clipboard.writeText(bankText).then(() => {
      showToast('¡Datos de cuenta copiados al portapapeles!');
    }).catch(() => {
      showToast('Alias copiado: MIGUEL.Y.CAROLINA.5');
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   5. CONFIRMACIÓN DE ASISTENCIA (RSVP VÍA WHATSAPP A CAROLINA: +591 70395505)
   ========================================================================== */
function initRSVPWhatsApp() {
  const btnCarolina = document.getElementById('btn-rsvp-carolina');
  if (!btnCarolina) return;

  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('para') || urlParams.get('invitado') || '';

  let guestText = '';
  if (guestName) {
    guestText = ` de parte de *${guestName.replace(/\+/g, ' ')}*`;
  }

  const phoneCarolina = '59170395505';
  const baseMessage = encodeURIComponent(
    `¡Hola Carolina! Confirmo con mucha alegría mi asistencia a su Renovación de Votos (Bodas de Madera)${guestText}. ¡Nos vemos el 17 de Octubre! 🥂✨`
  );

  btnCarolina.href = `https://api.whatsapp.com/send?phone=${phoneCarolina}&text=${baseMessage}`;
}

/* ==========================================================================
   6. SCROLL REVEAL CON INTERSECTION OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. CARRUSEL DE FOTOS AUTOMÁTICO E INTERACTIVO
   ========================================================================== */
function initGalleryCarousel() {
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const counter = document.getElementById('carousel-counter');
  const carouselContainer = document.getElementById('gallery-carousel');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 4500);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Eventos de botones
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      prevSlide();
      resetAutoplay();
    });
  }

  // Pausar con el puntero en escritorio
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carouselContainer.addEventListener('mouseleave', startAutoplay);

    // Deslizamiento con el dedo en celular (Touch Swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      clearInterval(autoplayTimer);
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoplay();
    }, { passive: true });
  }

  startAutoplay();
  updateCarousel();
}