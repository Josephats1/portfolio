   // Mobile Menu Toggle
      const menuBtn = document.getElementById('menuBtn');
      const navLinks = document.getElementById('navLinks');
      
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.innerHTML = navLinks.classList.contains('active') ? 
          '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      });
      
      // Navbar Scroll Effect
      const navbar = document.getElementById('navbar');
      
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
      
      // Smooth Scrolling for Navigation
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
          }
          
          // Close mobile menu if open
          if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
          }
        });
      });
      
      // Array of quotes with authors and images
      const quotes = [
        { 
          text: "Let not the shadows cast by the wicked obscure your vission to of the souls who illuminate the world.", 
          author: "Baluku Josephat", 
          image: "https://josephats1.github.io/particle/static/image.png" 
        },
        { 
          text: "It's our Responsibility to Love but a Blessing to be loved.", 
          author: "President Mbaraga Mathieu", 
          image: "https://josephats1.github.io/Media/images/Mathieu.png" 
        },
        { 
          text: "Spirituality without ability to Control your Reality is Vanity.", 
          author: "Nero Knowledge", 
          image: "https://josephats1.github.io/Media/images/Nero.png" 
        }
      ];
      
      // Function to display a random quote
      function displayRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        document.getElementById("quote-text").textContent = `"${quote.text}"`;
        document.getElementById("quote-author").textContent = `- ${quote.author}`;
        document.getElementById("speaker-img").src = quote.image;
      }
      
      // Display the first random quote immediately
      displayRandomQuote();
      
      // Change the quote every 5 seconds
      setInterval(displayRandomQuote, 5000); 

      const audioPlayer = document.getElementById("audioPlayer");
      const albumArt = document.getElementById("albumArt");

      const playlist = [
        {
          src: "Images/shepherd.mp3",
          image: "Images/lds.png" 
        },
        { 
          src: "Images/Cetera.mp3", 
          image: "Images/peter.png" 
        },
        { 
          src: "Images/2pac.mp3", 
          image: "Images/pac.png" 
        },
        { 
          src: "Images/28-best of-d.t.mp3", 
          image: "Images/toliver.png" 
        }
      ];

      function playGenre(index) {
        const track = playlist[index];
        document.getElementById("audioSource").src = track.src;
        audioPlayer.load();
        albumArt.style.backgroundImage = `url(${track.image})`;
        albumArt.style.transform = "rotate(360deg)";
        audioPlayer.play();

        setTimeout(() => {
          albumArt.style.transform = "rotate(0deg)";
        }, 1000);
      }

      // Play first track on page load
      playGenre(0);