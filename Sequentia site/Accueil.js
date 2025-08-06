document.addEventListener("DOMContentLoaded", () => {
  // === HELP BOX MENU ===
  const items = document.querySelectorAll('.menu-item');
  const helpButton = document.querySelector('.help-button');
  const helpBox = document.querySelector('.help-box');
  const logo = document.getElementById('logo');
  const buyButton = document.getElementById("buy-button");
  const gridItems = document.querySelectorAll('#gradient-grid .circle-item');

  let helpTimeout;
  const sequence = "SEQUENTIA";
  let buffer = "";

  // Help Box toggle
  helpButton.addEventListener('click', () => {
    const anyItemExpanded = [...items].some(item => item.classList.contains('expanded'));
    if (anyItemExpanded) return;

    const isNowVisible = helpBox.classList.toggle('visible');

    if (isNowVisible) {
      clearTimeout(helpTimeout);
      helpTimeout = setTimeout(() => {
        helpBox.classList.remove('visible');
      }, 4000);
    } else {
      helpBox.classList.remove('visible');
    }
  });

  // Menu items hover effect
  items.forEach(item => {
    let timeout;

    item.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      item.classList.add('expanded');

      if (helpBox.classList.contains('visible')) {
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

  // Logo scroll to top
  if (logo) {
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Blur effect on logo hover
    logo.addEventListener("mouseenter", () => document.body.classList.add("blur-active"));
    logo.addEventListener("mouseleave", () => document.body.classList.remove("blur-active"));
  }

  // Blur effect on menu
  const menu = document.querySelector(".menu");
  if (menu) {
    menu.addEventListener("mouseenter", () => document.body.classList.add("blur-active"));
    menu.addEventListener("mouseleave", () => document.body.classList.remove("blur-active"));
  }

  // Easter egg SEQUENTIA => rainbow button
  document.addEventListener("keydown", (e) => {
    buffer += e.key.toUpperCase();
    if (buffer.length > sequence.length) buffer = buffer.slice(-sequence.length);

    if (buffer === sequence && buyButton) {
      buyButton.classList.add("rainbow");
      setTimeout(() => buyButton.classList.remove("rainbow"), 10000);
    }
  });

  // Gradient Color Logic
  const gradientColors = ["#FFA1A1", "#FFE4BE", "#CCFF9F", "#B7DACC", "#7893FF", "#C269F3", "#FF64D1"];

  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  function interpolateColor(color1, color2, factor) {
    return color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
  }

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

  // === Footer Toggle Logic ===
  const toggleBtn = document.getElementById("footer-toggle-btn");
  const closeBtn = document.getElementById("footer-close-btn");
  const footerPanel = document.getElementById("footer-panel");

  if (toggleBtn && closeBtn && footerPanel) {
    toggleBtn.addEventListener("click", () => {
      footerPanel.classList.add("open");
      toggleBtn.classList.add("hidden");  // Hide toggle
    });

    closeBtn.addEventListener("click", () => {
      footerPanel.classList.remove("open");
      toggleBtn.classList.remove("hidden");  // Show toggle again
    });
  }

  // === Anti-Zoom Keyboard Shortcut ===
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && 
        (event.key === '+' || event.key === '-' || event.key === '=' || event.key === '0')) {
      event.preventDefault();
    }
  });
});

