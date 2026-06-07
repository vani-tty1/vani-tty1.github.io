(function () {
  const track  = document.getElementById('ss-track');
  const prev   = document.getElementById('ss-prev');
  const next   = document.getElementById('ss-next');
  const dotsEl = document.getElementById('ss-dots');
  const figures = track.querySelectorAll('.screenshot-figure');
  let current = 0;

  /* Build dots */
  figures.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Screenshot ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  });

  function goTo(index) {
    current = Math.max(0, Math.min(index, figures.length - 1));
    figures[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    updateState();
  }

  function updateState() {
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    prev.disabled = current === 0;
    next.disabled = current === figures.length - 1;
  }

  /* Detect scroll-snap landing */
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      let closest = 0, minDist = Infinity;
      figures.forEach((fig, i) => {
        const dist = Math.abs(fig.getBoundingClientRect().left - track.getBoundingClientRect().left);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      current = closest;
      updateState();
    }, 80);
  });

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  updateState();
})();
