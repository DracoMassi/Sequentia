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
  const toggleBtn   = document.getElementById("footer-toggle-btn");
  const closeBtn    = document.getElementById("footer-close-btn");
  const footerPanel = document.getElementById("footer-panel");

  let helpTimeout;
  const easterEggSequence = "SEQUENTIA";
  let keyBuffer = "";

  const gradientColors = [
    "#FFA1A1", "#FFE4BE", "#CCFF9F", 
    "#B7DACC", "#7893FF", "#C269F3", "#FF64D1"
  ];

  /* -------------------------
     FONCTIONS UTILITAIRES
  ------------------------- */
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255
    ];
  };

  const interpolateColor = (color1, color2, factor) => {
    return color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
  };

  /* -------------------------
     HELP BOX
  ------------------------- */
  if (helpButton && helpBox) {
    helpButton.addEventListener('click', () => {
      const anyExpanded = [...menuItems].some(item => item.classList.contains('expanded'));
      if (anyExpanded) return;

      const isVisible = helpBox.classList.toggle('visible');

      if (isVisible) {
        clearTimeout(helpTimeout);
        helpTimeout = setTimeout(() => {
          helpBox.classList.remove('visible');
        }, 4000);
      }
    });
  }

  /* -------------------------
     MENU ITEMS HOVER
  ------------------------- */
  menuItems.forEach(item => {
    let timeout;

    item.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      item.classList.add('expanded');

      if (helpBox?.classList.contains('visible')) {
        helpBox.classList.remove('visible');
        clearTimeout(helpTimeout);
      }
    });

    item.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
        item.classList.remove('expanded');
      }, 400);
    });
  });

  /* -------------------------
     LOGO ACTIONS
  ------------------------- */
  if (logo) {
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    logo.addEventListener("mouseenter", () => {
      document.body.classList.add("blur-active");
    });
    logo.addEventListener("mouseleave", () => {
      document.body.classList.remove("blur-active");
    });
  }

  /* -------------------------
     MENU BLUR EFFECT
  ------------------------- */
  if (menu) {
    menu.addEventListener("mouseenter", () => {
      document.body.classList.add("blur-active");
    });
    menu.addEventListener("mouseleave", () => {
      document.body.classList.remove("blur-active");
    });
  }

  /* -------------------------
     EASTER EGG (SEQUENTIA)
  ------------------------- */
  document.addEventListener("keydown", (e) => {
    keyBuffer += e.key.toUpperCase();
    if (keyBuffer.length > easterEggSequence.length) {
      keyBuffer = keyBuffer.slice(-easterEggSequence.length);
    }

    if (keyBuffer === easterEggSequence && buyButton) {
      buyButton.classList.add("rainbow");
      setTimeout(() => buyButton.classList.remove("rainbow"), 10000);
    }
  });

  /* -------------------------
     GRADIENT GRID COLORS
  ------------------------- */
  gridItems.forEach((circle, index) => {
    const circleBg = circle.querySelector('.circle-bg');
    if (!circleBg) return;

    const row = Math.floor(index / 4);
    const col = index % 4;
    const progress = (row + col) / 6;
    const scaled = progress * (gradientColors.length - 1);
    const i = Math.floor(scaled);
    const localFactor = scaled - i;

    const color1 = hexToRgb(gradientColors[i]);
    const color2 = hexToRgb(gradientColors[Math.min(i + 1, gradientColors.length - 1)]);
    const interpolated = interpolateColor(color1, color2, localFactor);

    circleBg.style.backgroundColor = `rgb(${interpolated.join(",")})`;
  });

  /* -------------------------
     FOOTER TOGGLE
  ------------------------- */
  if (toggleBtn && closeBtn && footerPanel) {
    toggleBtn.addEventListener("click", () => {
      footerPanel.classList.add("open");
      toggleBtn.classList.add("hidden");
    });

    closeBtn.addEventListener("click", () => {
      footerPanel.classList.remove("open");
      toggleBtn.classList.remove("hidden");
    });
  }

  /* -------------------------
     ANTI-ZOOM CLAVIER
  ------------------------- */
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) &&
        ['+', '-', '=', '0'].includes(event.key)) {
      event.preventDefault();
    }
  });

  /* -------------------------
     CARROUSELS SIMPLIFIÉS
  ------------------------- */
  document.querySelectorAll('.carrousel').forEach((carrousel) => {
    const track = carrousel.querySelector('.carrousel-track');
    const originalItems = Array.from(track.children);

    // Clone pour boucle infinie
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });

    let scrollAmount = 0;
    const baseStep = 0.5; // pixels/frame
    const autoStep = carrousel.classList.contains('carrouseldeux') ? -baseStep : baseStep;

    function autoScroll() {
      scrollAmount += autoStep;
      const halfScroll = track.scrollWidth / 2;

      if (scrollAmount >= halfScroll) {
        scrollAmount -= halfScroll;
      } else if (scrollAmount < 0) {
        scrollAmount += halfScroll;
      }

      track.scrollLeft = scrollAmount;
      requestAnimationFrame(autoScroll);
    }

    autoScroll();
  });

});
