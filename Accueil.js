// ===========================================
// CONFIGURATION
// ===========================================
const CONFIG = {
  easterEggSequence: "SEQUENTIA",
  gradientColors: ["#FFA1A1", "#FFE4BE", "#CCFF9F", "#B7DACC", "#7893FF", "#C269F3", "#FF64D1"],
  helpTimeout: 4000,
  autoplayInterval: 5000,
  menuExpandDelay: 400
};

// ===========================================
// UTILITAIRES
// ===========================================
const Utils = {
  hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  },

  interpolateColor(color1, color2, factor) {
    return color1.map((v, i) => Math.round(v + factor * (color2[i] - v)));
  },

  disableScroll() {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.dataset.scrollY = scrollY;
  },

  enableScroll() {
    const scrollY = document.body.dataset.scrollY || 0;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY, 10));
  }
};

// ===========================================
// MODULES
// ===========================================

// Module Menu
const MenuModule = {
  init() {
    const menuItems = document.querySelectorAll('.menu-item');
    const helpButton = document.querySelector('.help-button');
    const helpBox = document.querySelector('.help-box');
    const logo = document.getElementById('logo');
    const menu = document.querySelector('.menu');
    const menuMobile = document.getElementById('menu-mobile');

    this.initHelpBox(helpButton, helpBox, menuItems);
    this.initMenuItems(menuItems, helpBox);
    this.initLogo(logo);
    this.initMenuBlur(menu);
    this.initMobileMenu(menu, menuMobile);
  },

  initHelpBox(helpButton, helpBox, menuItems) {
    if (!helpButton || !helpBox) return;

    let helpTimeout;

    helpButton.addEventListener('click', () => {
      if ([...menuItems].some(item => item.classList.contains('expanded'))) return;
      
      const isVisible = helpBox.classList.toggle('visible');
      if (isVisible) {
        clearTimeout(helpTimeout);
        helpTimeout = setTimeout(() => helpBox.classList.remove('visible'), CONFIG.helpTimeout);
      }
    });
  },

  initMenuItems(menuItems, helpBox) {
    menuItems.forEach(item => {
      let timeout;
      
      item.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        item.classList.add('expanded');
        helpBox?.classList.remove('visible');
      });

      item.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => item.classList.remove('expanded'), CONFIG.menuExpandDelay);
      });
    });
  },

  initLogo(logo) {
    if (!logo) return;

    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    logo.addEventListener('mouseenter', () => {
      document.body.classList.add("blur-active");
    });

    logo.addEventListener('mouseleave', () => {
      document.body.classList.remove("blur-active");
    });
  },

  initMenuBlur(menu) {
    if (!menu || window.matchMedia("(pointer: coarse)").matches) return;

    menu.addEventListener("mouseenter", () => {
      document.body.classList.add("blur-active");
    });

    menu.addEventListener("mouseleave", () => {
      document.body.classList.remove("blur-active");
    });
  },

  initMobileMenu(menu, menuMobile) {
    const hamburger = document.getElementById('menu-hamburger');
    
    if (!hamburger || !menuMobile) return;

    hamburger.addEventListener('click', () => {
      const isOpen = menuMobile.classList.toggle('active');
      hamburger.classList.toggle('active');
      
      isOpen ? Utils.disableScroll() : Utils.enableScroll();
    });

    // Fermer le menu en cliquant sur un lien
    const menuLinks = menuMobile.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuMobile.classList.remove('active');
        hamburger.classList.remove('active');
        Utils.enableScroll();
      });
    });
  }
};

// Module Easter Egg
const EasterEggModule = {
  init() {
    let keyBuffer = "";
    const buyButton = document.getElementById("buy-button");

    document.addEventListener("keydown", (e) => {
      keyBuffer += e.key.toUpperCase();
      
      if (keyBuffer.length > CONFIG.easterEggSequence.length) {
        keyBuffer = keyBuffer.slice(-CONFIG.easterEggSequence.length);
      }

      if (keyBuffer === CONFIG.easterEggSequence && buyButton) {
        buyButton.classList.add("rainbow");
        setTimeout(() => buyButton.classList.remove("rainbow"), 10000);
      }
    });
  }
};

// Module Gradient Grid
const GradientGridModule = {
  init() {
    const gridItems = document.querySelectorAll('#gradient-grid .circle-item');

    gridItems.forEach((circle, index) => {
      const bg = circle.querySelector('.circle-bg');
      if (!bg) return;

      const row = Math.floor(index / 4);
      const col = index % 4;
      const progress = (row + col) / 6;
      const scaled = progress * (CONFIG.gradientColors.length - 1);
      const i = Math.floor(scaled);
      const localFactor = scaled - i;

      const color1 = Utils.hexToRgb(CONFIG.gradientColors[i]);
      const color2 = Utils.hexToRgb(CONFIG.gradientColors[Math.min(i + 1, CONFIG.gradientColors.length - 1)]);
      const interpolated = Utils.interpolateColor(color1, color2, localFactor);

      bg.style.backgroundColor = `rgb(${interpolated.join(",")})`;
    });
  }
};

// Module Footer
const FooterModule = {
  init() {
    const toggleBtn = document.getElementById("footer-toggle-btn");
    const closeBtn = document.getElementById("footer-close-btn");
    const footerPanel = document.getElementById("footer-panel");

    if (!toggleBtn || !closeBtn || !footerPanel) return;

    toggleBtn.addEventListener("click", () => {
      footerPanel.classList.add("open");
      toggleBtn.classList.add("hidden");
    });

    closeBtn.addEventListener("click", () => {
      footerPanel.classList.remove("open");
      toggleBtn.classList.remove("hidden");
    });
  }
};

// Module Story Slider
const StorySliderModule = {
  slider: null,
  currentIndex: 1,
  isTransitioning: false,
  autoplayInterval: null,

  init() {
    this.slider = document.getElementById('story-slider');
    const prevBtn = document.querySelector('.story-nav.prev');
    const nextBtn = document.querySelector('.story-nav.next');
    const phoneFrame = document.querySelector('.phone-frame');

    if (!this.slider || !prevBtn || !nextBtn) return;

    this.setupSlider();
    this.initNavigation(prevBtn, nextBtn);
    this.initKeyboardNavigation(prevBtn, nextBtn);
    this.initPhoneEffect(phoneFrame);
    this.startAutoplay(nextBtn);
  },

  setupSlider() {
    let stories = Array.from(this.slider.querySelectorAll(".story"));
    if (stories.length === 0) return;

    // Créer des clones pour l'effet infini
    const firstClone = stories[0].cloneNode(true);
    const lastClone = stories[stories.length - 1].cloneNode(true);
    firstClone.id = "first-clone";
    lastClone.id = "last-clone";

    this.slider.appendChild(firstClone);
    this.slider.insertBefore(lastClone, stories[0]);

    this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  },

  updateSlider(index) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.slider.style.transition = 'transform 0.5s ease-in-out';
    this.slider.style.transform = `translateX(-${index * 100}%)`;
  },

  handleTransitionEnd() {
    this.isTransitioning = false;
    const slides = document.querySelectorAll(".story");

    if (slides[this.currentIndex].id === "last-clone") {
      this.slider.style.transition = "none";
      this.currentIndex = slides.length - 2;
      this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    if (slides[this.currentIndex].id === "first-clone") {
      this.slider.style.transition = "none";
      this.currentIndex = 1;
      this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
  },

  initNavigation(prevBtn, nextBtn) {
    this.slider.addEventListener('transitionend', () => this.handleTransitionEnd());

    prevBtn.addEventListener('click', () => {
      if (this.isTransitioning) return;
      this.currentIndex--;
      this.updateSlider(this.currentIndex);
      this.resetAutoplay(nextBtn);
    });

    nextBtn.addEventListener('click', () => {
      if (this.isTransitioning) return;
      this.currentIndex++;
      this.updateSlider(this.currentIndex);
      this.resetAutoplay(nextBtn);
    });
  },

  initKeyboardNavigation(prevBtn, nextBtn) {
    document.addEventListener('keydown', (e) => {
      if (e.key === "ArrowLeft") prevBtn.click();
      if (e.key === "ArrowRight") nextBtn.click();
    });
  },

  initPhoneEffect(phoneFrame) {
    if (!phoneFrame || !window.matchMedia("(pointer: fine)").matches) return;

    phoneFrame.addEventListener('mousemove', (e) => {
      const rect = phoneFrame.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 15;
      const rotateY = (x / rect.width) * 15;

      phoneFrame.style.transform = `rotateY(${rotateY - 10}deg) rotateX(${rotateX + 5}deg)`;
      phoneFrame.style.boxShadow = `${-x / 20}px ${y / 20}px 60px rgba(0,0,0,0.6)`;
    });

    phoneFrame.addEventListener('mouseleave', () => {
      phoneFrame.style.transform = 'rotateY(-10deg) rotateX(5deg)';
      phoneFrame.style.boxShadow = '0 25px 60px rgba(0,0,0,0.6)';
    });
  },

  startAutoplay(nextBtn) {
    this.autoplayInterval = setInterval(() => nextBtn.click(), CONFIG.autoplayInterval);
  },

  resetAutoplay(nextBtn) {
    clearInterval(this.autoplayInterval);
    this.startAutoplay(nextBtn);
  }
};

// Module Anti-Zoom
const AntiZoomModule = {
  init() {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) {
        e.preventDefault();
      }
    });
  }
};

// ===========================================
// INITIALISATION
// ===========================================
document.addEventListener("DOMContentLoaded", () => {
  MenuModule.init();
  EasterEggModule.init();
  GradientGridModule.init();
  FooterModule.init();
  StorySliderModule.init();
  AntiZoomModule.init();
});
