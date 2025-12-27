
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

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('progressBar').style.width = scrolled + '%';
    });

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let currentSection = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
          link.classList.add('active');
        }
      });
    });

    
    function toggleMenu() {
        const navbar = document.getElementById('navbar');
        navbar.classList.toggle('active');
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
      
        document.getElementById('navbar').classList.remove('active');

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
      });
    });

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

    function copyCode(button) {
      const codeContent = button.parentElement.nextElementSibling.textContent;
      navigator.clipboard.writeText(codeContent).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      });
    }

    
    let terminalHistory = [];
    let historyIndex = -1;

    function handleTerminalInput(event) {
      if (event.key === 'Enter') {
        const input = event.target.value.trim();
        if (input) {
          executeCommand(input);
          terminalHistory.push(input);
          historyIndex = terminalHistory.length;
          event.target.value = '';
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          event.target.value = terminalHistory[historyIndex];
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex < terminalHistory.length - 1) {
          historyIndex++;
          event.target.value = terminalHistory[historyIndex];
        } else {
          historyIndex = terminalHistory.length;
          event.target.value = '';
        }
      }
    }

    function executeCommand(command) {
      const output = document.getElementById('terminalOutput');
      const prompt = document.createElement('div');
      prompt.innerHTML = `<span class="terminal-prompt">python3 >>></span> ${command}`;
      output.appendChild(prompt);

      let result;
      try {
        result = evaluatePythonExpression(command);
      } catch (error) {
        result = `Error: ${error.message}`;
      }

      const resultDiv = document.createElement('div');
      resultDiv.className = 'terminal-output';
      resultDiv.textContent = result;
      output.appendChild(resultDiv);
      output.scrollTop = output.scrollHeight;
    }

    function evaluatePythonExpression(expr) {
      if (expr.startsWith('print(')) {
        const content = expr.slice(6, -1);
        if (content.startsWith('"') && content.endsWith('"')) {
          return content.slice(1, -1);
        } else if (content.startsWith("'") && content.endsWith("'")) {
          return content.slice(1, -1);
        } else {
          return eval(content);
        }
      }
      
      if (expr.startsWith('len(')) {
        const content = expr.slice(4, -1);
        if (content.startsWith('"') && content.endsWith('"')) {
          return content.slice(1, -1).length;
        }
        return eval(content + '.length');
      }
      
      if (expr.includes('for') && expr.includes('in') && expr.includes('[')) {
        if (expr === '[x**2 for x in range(5)]') {
          return '[0, 1, 4, 9, 16]';
        }
      }
      
      if (expr.startsWith('{') && expr.endsWith('}')) {
        return expr;
      }
      
      try {
        return eval(expr);
      } catch {
        return expr;
      }
    }

    
    let currentQuestion = 0;
    let correctAnswers = 0;
    let selectedAnswers = [];

    function selectOption(option, isCorrect) {
      const question = option.closest('.question');
      const options = question.querySelectorAll('.option');
      options.forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('.radio').classList.remove('selected');
      });
      
      option.classList.add('selected');
      option.querySelector('.radio').classList.add('selected');
      
      selectedAnswers[currentQuestion] = isCorrect;
      
      if (currentQuestion < 4) {
        document.getElementById('nextBtn').style.display = 'inline-flex';
      } else {
        document.getElementById('submitBtn').style.display = 'inline-flex';
      }
    }

    function nextQuestion() {
      document.querySelector(`[data-question="${currentQuestion}"]`).style.display = 'none';
      currentQuestion++;
      document.querySelector(`[data-question="${currentQuestion}"]`).style.display = 'block';
      document.getElementById('nextBtn').style.display = 'none';
      
      if (currentQuestion === 4 && selectedAnswers[currentQuestion] !== undefined) {
        document.getElementById('submitBtn').style.display = 'inline-flex';
      }
    }

    function submitQuiz() {
      correctAnswers = selectedAnswers.filter(answer => answer === true).length;
      
      for (let i = 0; i <= 4; i++) {
        const question = document.querySelector(`[data-question="${i}"]`);
        const options = question.querySelectorAll('.option');
        
        options.forEach(option => {
          const isCorrect = option.onclick.toString().includes('true');
          const wasSelected = option.classList.contains('selected');
          
          if (isCorrect) {
            option.classList.add('correct');
          } else if (wasSelected && !isCorrect) {
            option.classList.add('incorrect');
          }
          
          option.onclick = null;
          option.style.cursor = 'default';
        });
        
        question.style.display = 'block';
      }
      
      document.getElementById('nextBtn').style.display = 'none';
      document.getElementById('submitBtn').style.display = 'none';
      
      const results = document.getElementById('quizResults');
      const scoreText = document.getElementById('scoreText');
      
      let message = `You scored ${correctAnswers} out of 5!`;
      if (correctAnswers === 5) {
        message += " 🎉 Perfect! You're a Python master!";
      } else if (correctAnswers >= 3) {
        message += " 👍 Great job! You have a solid understanding of Python basics.";
      } else {
        message += " 📚 Keep learning! Review the tutorial and try again.";
      }
      
      scoreText.textContent = message;
      results.style.display = 'block';
    }

    function restartQuiz() {
      currentQuestion = 0;
      correctAnswers = 0;
      selectedAnswers = [];
      
      for (let i = 0; i <= 4; i++) {
        const question = document.querySelector(`[data-question="${i}"]`);
        question.style.display = i === 0 ? 'block' : 'none';
        
        const options = question.querySelectorAll('.option');
        options.forEach((option, index) => {
          option.classList.remove('selected', 'correct', 'incorrect');
          option.querySelector('.radio').classList.remove('selected');
          option.style.cursor = 'pointer';
          
          const correctAnswers = [false, true, false, false]; 
          if (i === 0) option.onclick = () => selectOption(option, [false, true, false, false][index]);
          else if (i === 1) option.onclick = () => selectOption(option, [false, true, false, false][index]);
          else if (i === 2) option.onclick = () => selectOption(option, [false, true, false, false][index]);
          else if (i === 3) option.onclick = () => selectOption(option, [false, true, false, false][index]);
          else if (i === 4) option.onclick = () => selectOption(option, [false, false, true, false][index]);
        });
      }
      
      document.getElementById('quizResults').style.display = 'none';
      document.getElementById('nextBtn').style.display = 'none';
      document.getElementById('submitBtn').style.display = 'none';
    }

    for (let i = 0; i < 20; i++) {
      setTimeout(createParticle, i * 100);
    }
  