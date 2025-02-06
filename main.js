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
      
          // Get visitor data from localStorage
          let visits = JSON.parse(localStorage.getItem("visits")) || [];
          
          // Add new visit with current timestamp
          let currentVisit = new Date().toLocaleString();
          visits.push(currentVisit);
          
          // Save back to localStorage (keep only last 10 visits)
          if (visits.length > 10) visits.shift();
          localStorage.setItem("visits", JSON.stringify(visits));
      
          // Update the visitor section in HTML
          document.getElementById("visit-count").innerHTML = `Total Visits: ${visits.length}`;
          
          let visitList = document.getElementById("visit-list");
          visits.forEach(visit => {
              let li = document.createElement("li");
              li.textContent = `Visited on: ${visit}`;
              visitList.appendChild(li);
          });
