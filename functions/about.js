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
          src: "C:\Users\USER\Desktop\Baluku\Images\Cetera.mp3",
          image: "https://josephats1.github.io/Media/images/lds.png" 
        },
        { 
          src: "https://assets.codepen.io/217233/rnb.mp3", 
          image: "https://josephats1.github.io/Media/images/usher.png" 
        },
        { 
          src: "data:image/webp;base64,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", 
          image: "https://josephats1.github.io/Media/images/2pac.png" 
        },
        { 
          src: "Images/2pac.mp3", 
          image: "Images/pac.png" 
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