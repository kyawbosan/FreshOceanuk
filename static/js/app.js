// ===== Footer Year =====
document.querySelectorAll("[data-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ===== Simple LocalStorage Cart (demo only) =====
const cart = JSON.parse(localStorage.getItem('fo_cart') || '[]');
function addToCart(item) {
  cart.push(item);
  localStorage.setItem('fo_cart', JSON.stringify(cart));
  alert(`${item.name} added to cart!`);
}

// ===== Hero Slider with Dots + Swipe + Drag + Momentum + Arrows =====
let currentSlide = 0;
const slider = document.querySelector('.hero-slider');
const wrapper = document.querySelector('.hero-slides-wrapper');
const slides = Array.from(document.querySelectorAll('.hero-slide'));
const total = slides.length;

if (slider && wrapper && total > 0) {
  // --- Create dots ---
  const dots = document.createElement('div');
  dots.className = 'hero-dots';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      currentSlide = i;
      snapToSlide();
      resetAuto();
    });
    dots.appendChild(dot);
  }
  slider.appendChild(dots);

  // --- Create arrows ---
  const arrowPrev = document.createElement('button');
  arrowPrev.className = 'hero-arrow hero-prev';
  arrowPrev.innerHTML = '&#10094;'; // left arrow
  arrowPrev.addEventListener('click', () => {
    currentSlide = Math.max(currentSlide - 1, 0);
    snapToSlide();
    resetAuto();
  });

  const arrowNext = document.createElement('button');
  arrowNext.className = 'hero-arrow hero-next';
  arrowNext.innerHTML = '&#10095;'; // right arrow
  arrowNext.addEventListener('click', () => {
    currentSlide = Math.min(currentSlide + 1, total - 1);
    snapToSlide();
    resetAuto();
  });

  slider.appendChild(arrowPrev);
  slider.appendChild(arrowNext);

  // --- Helpers ---
  const updateDots = () => {
    slider.querySelectorAll('.hero-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  };

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const setX = (px) => (wrapper.style.transform = `translateX(${px}px)`);
  const indexToX = (i) => -i * slider.clientWidth;

  const snapToSlide = () => {
    baseX = indexToX(currentSlide);
    wrapper.style.transition = 'transform 0.45s cubic-bezier(.2,.8,.2,1)';
    setX(baseX);
    wrapper.addEventListener('transitionend', () => {
      wrapper.style.transition = '';
    }, { once: true });
    updateDots();
  };

  // --- Init ---
  let autoTimer;
  let slideWidth = slider.clientWidth;
  let baseX = 0, dragStartX = 0, isDown = false, currentX = 0, lastX = 0, lastT = 0, velocity = 0;

  wrapper.style.willChange = 'transform';
  setX(indexToX(0));
  startAuto();

  // --- Auto ---
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      currentSlide = (currentSlide + 1) % total;
      snapToSlide();
    }, 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // --- Resize ---
  window.addEventListener('resize', () => {
    slideWidth = slider.clientWidth;
    baseX = indexToX(currentSlide);
    setX(baseX);
  });

  // --- Pointer/Touch events ---
  const onDown = (clientX) => {
    isDown = true;
    wrapper.style.transition = '';
    dragStartX = clientX;
    currentX = clientX;
    lastX = clientX;
    lastT = performance.now();
    velocity = 0;
    slider.classList.add('is-grabbing');
    clearInterval(autoTimer);
  };

  const onMove = (clientX) => {
    if (!isDown) return;
    currentX = clientX;
    const delta = currentX - dragStartX;
    const atFirst = currentSlide === 0 && delta > 0;
    const atLast = currentSlide === total - 1 && delta < 0;
    const resistance = (atFirst || atLast) ? 0.35 : 1;
    setX(baseX + delta * resistance);

    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) {
      velocity = (clientX - lastX) / dt;
      lastX = clientX;
      lastT = now;
    }
  };

  const onUp = () => {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove('is-grabbing');
    const delta = currentX - dragStartX;
    const speed = velocity;
    const threshold = Math.max(50, slideWidth * 0.12);
    const veloThreshold = 0.06;

    if (delta < -threshold || speed < -veloThreshold) {
      currentSlide = clamp(currentSlide + 1, 0, total - 1);
    } else if (delta > threshold || speed > veloThreshold) {
      currentSlide = clamp(currentSlide - 1, 0, total - 1);
    }
    snapToSlide();
    resetAuto();
  };

  // Mouse
  wrapper.addEventListener('mousedown', (e) => onDown(e.clientX));
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onUp);
  wrapper.addEventListener('mouseleave', onUp);

  // Touch
  wrapper.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
  wrapper.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
  wrapper.addEventListener('touchend', onUp);

  // Keyboard arrows
  slider.setAttribute('tabindex', '0');
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { currentSlide = Math.min(currentSlide + 1, total - 1); snapToSlide(); resetAuto(); }
    if (e.key === 'ArrowLeft')  { currentSlide = Math.max(currentSlide - 1, 0);       snapToSlide(); resetAuto(); }
  });
}

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.menu');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }
});

// mobile nav toggle
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
  document.querySelector('.mainmenu')?.classList.toggle('show');
});

// Mobile menu toggle (premium header)
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('active');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Auto-hide flash messages after 4 seconds
// Flash messages: add close buttons + auto-hide
document.addEventListener("DOMContentLoaded", () => {
  const flashes = document.querySelectorAll(".flash");
  flashes.forEach(flash => {
    // add a close button if not present
    if (!flash.querySelector(".close")) {
      const btn = document.createElement("button");
      btn.className = "close";
      btn.setAttribute("aria-label", "Dismiss");
      btn.textContent = "×";
      btn.addEventListener("click", () => {
        flash.style.transition = "opacity 0.3s ease";
        flash.style.opacity = "0";
        setTimeout(() => flash.remove(), 300);
      });
      flash.appendChild(btn);
    }
  });

  // auto-hide after 4s (unless user hovers)
  let hideTimer = setTimeout(hideAll, 4000);
  function hideAll() {
    flashes.forEach(f => {
      f.style.transition = "opacity 0.6s ease";
      f.style.opacity = "0";
      setTimeout(() => f.remove(), 600);
    });
  }
  // pause on hover, resume on leave
  document.querySelector(".flash-messages")?.addEventListener("mouseenter", () => {
    clearTimeout(hideTimer);
  });
  document.querySelector(".flash-messages")?.addEventListener("mouseleave", () => {
    hideTimer = setTimeout(hideAll, 2000);
  });
});

// ----- Products: filters + pagination + per-page -----
(function () {
  const grid = document.querySelector('.product-grid');
  if (!grid) return;

  const allCards = Array.from(grid.querySelectorAll('.product-card'));
  const chips = Array.from(document.querySelectorAll('.catalog-filters .chip'));
  const prevBtns = document.querySelectorAll('[data-page-prev]');
  const nextBtns = document.querySelectorAll('[data-page-next]');
  const statusEls = document.querySelectorAll('[data-page-status]');
  const perPageSelects = document.querySelectorAll('[data-per-page]');

  let activeCat = 'all';
  let filtered = allCards.slice();

  // default per page by breakpoint (can be overridden by selector)
  function defaultPerPage() {
    if (window.matchMedia('(min-width: 1024px)').matches) return 9;
    if (window.matchMedia('(min-width: 640px)').matches) return 6;
    return 4;
  }

  let perPage = defaultPerPage();
  // initialize UI selects
  perPageSelects.forEach(sel => sel.value = String(perPage));

  let page = 1;
  let total = 1;

  function calcTotal() {
    total = Math.max(1, Math.ceil(filtered.length / perPage));
  }

  function applyFilter(cat) {
    activeCat = cat;
    filtered = (cat === 'all') ? allCards.slice() : allCards.filter(c => c.dataset.cat === cat);
    calcTotal();
    page = 1;
    render();
  }

  function render() {
    allCards.forEach(c => c.style.display = 'none');
    const start = (page - 1) * perPage;
    const end = start + perPage;
    filtered.slice(start, end).forEach(c => c.style.display = 'block');

    statusEls.forEach(s => s.textContent = `Page ${page} of ${total} · ${activeCat === 'all' ? 'All items' : activeCat}`);

    prevBtns.forEach(b => b.disabled = (page === 1));
    nextBtns.forEach(b => b.disabled = (page === total));

    // scroll back to grid top
    const y = grid.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function goto(delta) {
    page = Math.min(total, Math.max(1, page + delta));
    render();
  }

  // Sync per-page selects
  function setPerPageFrom(valueStr) {
    const v = parseInt(valueStr, 10);
    if (!Number.isFinite(v) || v <= 0) return;
    perPage = v;
    perPageSelects.forEach(sel => { if (sel.value !== String(v)) sel.value = String(v); });
    calcTotal();
    page = Math.min(page, total);
    render();
  }

  perPageSelects.forEach(sel => {
    sel.addEventListener('change', e => setPerPageFrom(e.target.value));
  });

  // Filter chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.toggle('active', c === chip));
      applyFilter(chip.dataset.filter);
    });
  });

  // Pagination
  prevBtns.forEach(b => b.addEventListener('click', () => goto(-1)));
  nextBtns.forEach(b => b.addEventListener('click', () => goto(1)));

  // Recalculate default perPage on resize only if user hasn't chosen a custom value
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // If both selects still match the responsive default, update to new default
      const currentDefault = defaultPerPage();
      const allMatchDefault = Array.from(perPageSelects).every(sel => Number(sel.value) === perPage);
      if (allMatchDefault && perPage !== currentDefault) {
        setPerPageFrom(String(currentDefault));
      } else {
        // just re-render to keep layout tidy
        render();
      }
    }, 150);
  });

  // Init
  applyFilter('all');
})();
