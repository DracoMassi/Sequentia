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
  const gradientColors = [
    "#FFA1A1","#FFE4BE","#CCFF9F",
    "#B7DACC","#7893FF","#C269F3","#FF64D1"
  ];

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
     MENU BLUR + GRAND
  ------------------------- */
  if(menu && !window.matchMedia("(pointer: coarse)").matches){
    menu.addEventListener("mouseenter", ()=>document.body.classList.add("blur-active"));
    menu.addEventListener("mouseleave", ()=>document.body.classList.remove("blur-active"));
  }
  if(menu && menuGrand){
    menu.addEventListener('click', ()=>{
      menuGrand.classList.toggle('clicked');
      document.body.style.overflow = menuGrand.classList.contains('clicked') ? 'hidden' : '';
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
     SLIDER INFINI + AUTOPLAY
  ------------------------- */
  if(slider && prevBtn && nextBtn){
    let stories = Array.from(slider.querySelectorAll(".story"));
    if(stories.length > 0){
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
  }

  /* -------------------------
     TELEPHONE 3D
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
     CARROUSELS AUTO-SCROLL
  ------------------------- */
  document.querySelectorAll('.carrousel').forEach((carrousel) => {
    const track = carrousel.querySelector('.carrousel-track');
    const originalItems = Array.from(track.children);

    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });

    const items = Array.from(track.children);
    let scrollAmount = 0;
    const baseStep = 0.5;
    const autoStep = carrousel.classList.contains('carrouseldeux') ? -baseStep : baseStep;

    function updateScale() {
      const carrouselRect = carrousel.getBoundingClientRect();
      const centerX = carrouselRect.left + carrouselRect.width / 2;
      let closestItem = null;
      let closestDistance = Infinity;

      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const distance = Math.abs(itemCenterX - centerX);

        item.style.transition = "transform 0.3s";
        item.style.transform = "scale(1)";
        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = item;
        }
      });

      if (closestItem) {
        closestItem.style.transform = "scale(1.1)";
      }
    }

    function autoScroll() {
      scrollAmount += autoStep;
      const halfScroll = track.scrollWidth / 2;
      if (scrollAmount >= halfScroll) scrollAmount -= halfScroll;
      else if (scrollAmount < 0) scrollAmount += halfScroll;
      track.scrollLeft = scrollAmount;
      updateScale();
      requestAnimationFrame(autoScroll);
    }
    autoScroll();
  });

});

/* -------------------------
   PRICING TOGGLE
------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("togglePricing");
  const prices = document.querySelectorAll(".pricing-card .price");
  const Titre = document.querySelectorAll(".pricing-card .Titre"); 
  const pricingContainer = document.querySelector(".pricing-container");
  const cards = document.querySelectorAll(".pricing-card");
  const premiumCard = cards[1];
  const premiumImg = premiumCard.querySelector("img");

  toggle.addEventListener("change", function () {
    if (this.checked) {
      prices[1].textContent = "1€";
      Titre[0].textContent = "La Fiche Seule";
      pricingContainer.classList.add("annual-mode");
      premiumCard.classList.add("expanded-card");
      premiumImg.src = "../../Image/Image totale.webp";

      cards[0].classList.remove("show-card");
      cards[0].classList.add("hidden-card");
      cards[2].classList.remove("show-card");
      cards[2].classList.add("hidden-card");

    } else {
      Titre[0].textContent = "Premium";
      prices[1].textContent = "7.99€";
      premiumCard.classList.remove("expanded-card");
      premiumImg.src = "../../Image/Image centre.webp";

      setTimeout(() => {
        cards[0].classList.remove("hidden-card");
        cards[0].classList.add("show-card");
        cards[2].classList.remove("hidden-card");
        cards[2].classList.add("show-card");
        pricingContainer.classList.remove("annual-mode");
      }, 400);
    }
  });
});
