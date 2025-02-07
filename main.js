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
      });
     

    function updateVisitorCount() {
        let todayDate = new Date().toDateString(); // Get today's date as a string
        let storedDate = localStorage.getItem('lastVisitDate'); // Last visit date
      
        let todayVisitors = parseInt(localStorage.getItem('todayVisitors')) || 0;
        let totalVisitors = parseInt(localStorage.getItem('totalVisitors')) || 0;
      
        if (storedDate !== todayDate) {
          // Reset today's visitor count if the day has changed
          todayVisitors = 0;
          localStorage.setItem('lastVisitDate', todayDate);
        }
      
        // Increment counters
        todayVisitors++;
        totalVisitors++;
      
        // Store updated counts
        localStorage.setItem('todayVisitors', todayVisitors);
        localStorage.setItem('totalVisitors', totalVisitors);
      
        // Update UI
        document.getElementById('todayVisitors').textContent = todayVisitors;
        document.getElementById('totalVisitors').textContent = totalVisitors;
      }
      
      updateVisitorCount()
