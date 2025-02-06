      // Custom Cursor
      const cursor = document.getElementById('cursor');
      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
      });

      // Scroll Reveal Animation
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-links a');

      const revealOnScroll = () => {
        const triggerBottom = window.innerHeight / 5 * 4;
        sections.forEach((section) => {
          const sectionTop = section.getBoundingClientRect().top;
          if (sectionTop < triggerBottom) {
            section.classList.add('show');
          }
        });
      };
      window.addEventListener('scroll', revealOnScroll);

      // 3-Dot Menu Toggle
      const menuToggle = document.getElementById('menu-toggle');
      const navLinksContainer = document.getElementById('nav-links');
      menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
      })
