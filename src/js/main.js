function createParticle() {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      document.getElementById('particles').appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 20000);
    }

    setInterval(createParticle, 300);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    for (let i = 0; i < 20; i++) {
      setTimeout(createParticle, i * 100);
    }