document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------
     VARIABLES & ÉLÉMENTS DOM
  ------------------------- */
  const menuItems   = document.querySelectorAll('.menu-item');
  const helpButton  = document.querySelector('.help-button');
  const helpBox     = document.querySelector('.help-box');
  const logo        = document.getElementById('logo');
  const buyButton   = document.getElementById("buy-button");
  const gridItems   = document.querySelectorAll('#gradient-grid .circle-item');
  const menu        = document.querySelector(".menu");
  const menuGrand   = document.querySelector('.Menugrand');
  const toggleBtn   = document.getElementById("footer-toggle-btn");
  const closeBtn    = document.getElementById("footer-close-btn");
  const footerPanel = document.getElementById("footer-panel");

  const slider      = document.getElementById('story-slider');
  const prevBtn     = document.querySelector('.story-nav.prev');
  const nextBtn     = document.querySelector('.story-nav.next');
  const phoneFrame  = document.querySelector('.phone-frame');

  let helpTimeout;
  let keyBuffer = "";
  const easterEggSequence = "SEQUENTIA";
  const gradientColors = ["#FFA1A1","#FFE4BE","#CCFF9F","#B7DACC","#7893FF","#C269F3","#FF64D1"];

  /* -------------------------
     FONCTIONS UTILITAIRES
  ------------------------- */
  const hexToRgb = hex => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const interpolateColor = (c1, c2, factor) => c1.map((v,i) => Math.round(v + factor*(c2[i]-v)));

  /* -------------------------
     HELP BOX
  ------------------------- */
  if (helpButton && helpBox) {
    helpButton.addEventListener('click', () => {
      if ([...menuItems].some(item => item.classList.contains('expanded'))) return;
      const isVisible = helpBox.classList.toggle('visible');
      if (isVisible) {
        clearTimeout(helpTimeout);
        helpTimeout = setTimeout(() => helpBox.classList.remove('visible'), 4000);
      }
    });
  }

  menuItems.forEach(item => {
    let timeout;
    item.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      item.classList.add('expanded');
      if(helpBox?.classList.contains('visible')) {
        helpBox.classList.remove('visible');
        clearTimeout(helpTimeout);
      }
    });
    item.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => item.classList.remove('expanded'), 400);
    });
  });

  /* -------------------------
     LOGO
  ------------------------- */
  if (logo) {
    logo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    logo.addEventListener('mouseenter', () => document.body.classList.add("blur-active"));
    logo.addEventListener('mouseleave', () => document.body.classList.remove("blur-active"));
  }

  /* -------------------------
     MENU BLUR
  ------------------------- */
  if(menu && !window.matchMedia("(pointer: coarse)").matches){
    menu.addEventListener("mouseenter", ()=>document.body.classList.add("blur-active"));
    menu.addEventListener("mouseleave", ()=>document.body.classList.remove("blur-active"));
  }

/* -------------------------
   MENU GRAND (scroll lock uniquement mobile)
------------------------- */
function disableScroll() {
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.dataset.scrollY = scrollY;
}

function enableScroll() {
  const scrollY = document.body.dataset.scrollY || 0;
  document.body.style.position = '';
  document.body.style.top = '';
  window.scrollTo(0, parseInt(scrollY, 10));
}

if(menu && menuGrand && window.matchMedia("(pointer: coarse)").matches){
  menu.addEventListener('click', ()=>{
    const isOpen = menuGrand.classList.toggle('clicked');
    if(isOpen){
      disableScroll();
    } else {
      enableScroll();
    }
  });
}

  /* -------------------------
     EASTER EGG
  ------------------------- */
  document.addEventListener("keydown", e=>{
    keyBuffer += e.key.toUpperCase();
    if(keyBuffer.length > easterEggSequence.length) keyBuffer = keyBuffer.slice(-easterEggSequence.length);
    if(keyBuffer === easterEggSequence && buyButton){
      buyButton.classList.add("rainbow");
      setTimeout(()=>buyButton.classList.remove("rainbow"), 10000);
    }
  });

  /* -------------------------
     GRADIENT GRID
  ------------------------- */
  gridItems.forEach((circle,index)=>{
    const bg = circle.querySelector('.circle-bg');
    if(!bg) return;
    const row = Math.floor(index/4);
    const col = index%4;
    const progress = (row+col)/6;
    const scaled = progress*(gradientColors.length-1);
    const i = Math.floor(scaled);
    const localFactor = scaled-i;
    const color1 = hexToRgb(gradientColors[i]);
    const color2 = hexToRgb(gradientColors[Math.min(i+1,gradientColors.length-1)]);
    bg.style.backgroundColor = `rgb(${interpolateColor(color1,color2,localFactor).join(",")})`;
  });

  /* -------------------------
     FOOTER TOGGLE
  ------------------------- */
  if(toggleBtn && closeBtn && footerPanel){
    toggleBtn.addEventListener("click", ()=>{
      footerPanel.classList.add("open");
      toggleBtn.classList.add("hidden");
    });
    closeBtn.addEventListener("click", ()=>{
      footerPanel.classList.remove("open");
      toggleBtn.classList.remove("hidden");
    });
  }

  /* -------------------------
     ANTI-ZOOM CLAVIER
  ------------------------- */
  document.addEventListener("keydown", e=>{
    if((e.ctrlKey||e.metaKey) && ['+','-','=','0'].includes(e.key)) e.preventDefault();
  });

  /* -------------------------
     SLIDER INFINI + BOUTONS + AUTOPLAY
  ------------------------- */
  if(slider && prevBtn && nextBtn){
    let stories = Array.from(slider.querySelectorAll(".story"));
    if(stories.length === 0) return;

    // Clones
    const firstClone = stories[0].cloneNode(true);
    const lastClone = stories[stories.length - 1].cloneNode(true);
    firstClone.id = "first-clone";
    lastClone.id = "last-clone";
    slider.appendChild(firstClone);
    slider.insertBefore(lastClone, stories[0]);

    stories = Array.from(slider.querySelectorAll(".story"));
    let currentIndex = 1;
    let isTransitioning = false;

    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    function updateSlider(index) {
      if(isTransitioning) return;
      isTransitioning = true;
      slider.style.transition = 'transform 0.5s ease-in-out';
      slider.style.transform = `translateX(-${index * 100}%)`;
    }

    slider.addEventListener('transitionend', () => {
      isTransitioning = false;
      const slides = document.querySelectorAll(".story");

      if (slides[currentIndex].id === "last-clone") {
        slider.style.transition = "none";
        currentIndex = slides.length - 2;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      if (slides[currentIndex].id === "first-clone") {
        slider.style.transition = "none";
        currentIndex = 1;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    });

    prevBtn.addEventListener('click', () => {
      if(isTransitioning) return;
      currentIndex--;
      updateSlider(currentIndex);
      resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      if(isTransitioning) return;
      currentIndex++;
      updateSlider(currentIndex);
      resetAutoplay();
    });

    document.addEventListener('keydown', e => {
      if(e.key === "ArrowLeft") prevBtn.click();
      if(e.key === "ArrowRight") nextBtn.click();
    });

    let autoplay = setInterval(()=>nextBtn.click(),5000);
    function resetAutoplay(){
      clearInterval(autoplay);
      autoplay = setInterval(()=>nextBtn.click(),5000);
    }
  }

  /* -------------------------
     TELEPHONE 3D / HOVER
  ------------------------- */
  if(phoneFrame && window.matchMedia("(pointer: fine)").matches){
    phoneFrame.addEventListener('mousemove', e=>{
      const rect = phoneFrame.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      const rotateX = (-y / rect.height)*15;
      const rotateY = (x / rect.width)*15;
      phoneFrame.style.transform = `rotateY(${rotateY-10}deg) rotateX(${rotateX+5}deg)`;
      phoneFrame.style.boxShadow = `${-x/20}px ${y/20}px 60px rgba(0,0,0,0.6)`;
    });
    phoneFrame.addEventListener('mouseleave',()=>{
      phoneFrame.style.transform='rotateY(-10deg) rotateX(5deg)';
      phoneFrame.style.boxShadow='0 25px 60px rgba(0,0,0,0.6)';
    });
  }
/* -------------------------
   LIGHTBOX GALERIE
------------------------- */
function openLightbox(img) {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const overlay     = document.getElementById('lightbox-overlay');

  // Image haute résolution
  lightboxImg.src = img.dataset.large || img.src;

  // Overlay = miniature (comme cache de transition)
  overlay.src = img.src;
  overlay.classList.remove('slide-out'); // reset si ancienne anim

  // Affiche la lightbox
  lightbox.classList.add('visible');

  // Lance l’animation de reveal après un court délai
  setTimeout(() => {
    overlay.classList.add('slide-out');
  }, 200);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const overlay  = document.getElementById('lightbox-overlay');

  // Reset overlay
  overlay.classList.remove('slide-out');

  // Cache la lightbox après un petit délai pour laisser le reset propre
  setTimeout(() => {
    lightbox.classList.remove('visible');
  }, 200);
}

// Fermeture si on clique en dehors de l'image principale
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target.id !== 'lightbox-img' && e.target.id !== 'lightbox-overlay') {
    closeLightbox();
  }
});

/* -------------------------
   ATTACH LIGHTBOX AUX IMAGES
------------------------- */
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => openLightbox(img));
});

});
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('.gallery-item img');

  setInterval(() => {
    images.forEach(img => {
      // 1% de zoom maximum
      const scale = 1 + (Math.random() * 0.02 - 0.01); // entre 0.99 et 1.01
      img.style.transform = `scale(${scale})`;
    });
  }, 5000); // toutes les 0.5s
});


