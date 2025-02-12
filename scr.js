        // Custom Cursor
        const cursor = document.getElementById('cursor');
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        // Scroll Reveal
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        highlightNav(entry.target.id);
                    }
                });
            },
            { threshold: 0.3 }
        );
        sections.forEach(section => observer.observe(section));

        // Mobile Menu
        const menuToggle = document.getElementById('menu-toggle');
        const navLinksContainer = document.getElementById('nav-links');
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        // Particles.js
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#58a6ff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#58a6ff", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 2 }
            },
            "interactivity": {
                "events": {
                    "onhover": { "enable": true, "mode": "repulse" },
                    "onclick": { "enable": true, "mode": "push" }
                }
            }
        });
      
