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
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Popup functionality
    function openPopup(service) {
      const popup = document.getElementById('popup');
      const popupContent = document.getElementById('popup-content');
      const popupDescription = document.getElementById('popup-description');
      const popupTitle = document.getElementById('popup-title');
      
      let title = '';
      let description = '';
      
      switch (service) {
        case 'coding':
          title = 'Custom Web Development';
          description = 'We offer a range of services from front-end design to back-end development, ensuring that your website is fully functional and user-friendly.';
          break;
        case 'app':
          title = 'Mobile App Development';
          description = 'Our mobile apps are designed with a focus on usability, performance, and cross-platform compatibility.';
          break;
        case 'web':
          title = 'Web Designing Course';
          description = 'You will learn modern technologies such as HTML, CSS, and JavaScript. Lets host, get a domain, and launch your first website online.';
          break;
        case 'life':
          title = 'Life Advice Session';
          description = 'Need guidance on personal growth, relationships, or handling life challenges? I will provide advice in a friendly, non-judgmental space, helping you make better decisions and overcome obstacles.';
          break;
        case 'entertain':
          title = 'Entertainment Chat';
          description = 'Talk about the latest movies, your favorite music genres, or discuss other hobbies you are passionate about. Our goal is to keep the conversation exciting and fun, providing a sense of connection and entertainment.';
          break;
        case 'go':
          title = 'GoSuggest';
          description = 'Whether you need a hotel, cozy café, a scenic park, a restaurant, movie-club, or a quiet spot to relax, Im your Guide. Date, Rest, food, or adventure? I will provide a curated list of locations that match what you are looking for, taking the guesswork out of where to go.';
          break;
        case 'engagement':
          title = 'Engagement Chat';
          description = 'Whether you want to chat about your daily experiences or share your thoughts on hobbies, we provide a space where you can talk freely with someone who listens and engages in meaningful conversations.';
          break;
        case 'loveconnect':
          title = 'Love-Match';
          description = 'This service is designed to connect you with potential partners who share similar values and life goals. We take the time to understand your preferences and help you find a compatible match for a lasting relationship.';
          break;
        case 'gift':
          title = 'Gift Concierge';
          description = 'This Gifting service provides personalized gift solutions for any occasion, taking the stress out of finding the perfect present. The expert team works closely with you to understand your needs and preferences, curating unique and thoughtful gift ideas tailored to your budget. From sourcing high-quality gifts to handling wrapping and delivery, we ensure a seamless and impressive gifting experience. Let us help you make a lasting impression with gifts that truly show you care.';
          break;
        case 'content-creator':
          title = 'Screenwriter';
          description = 'Bring your ideas to life with expertly crafted screenplays, whether for a feature film, short film, or TV series. Our screenwriting service ensures that your vision is transformed into a compelling story with dynamic characters and engaging dialogue.';
          break;
        case 'song-writer':
          title = 'Song Writer';
          description = 'Work with our expert songwriters to craft heartfelt lyrics and melodies that resonate with your audience.';
          break;
        case 'graphic-designer':
          title = 'Graphic Designer';
          description = 'Our graphic design services bring your ideas to life with custom, visually striking designs tailored to your brand and vision.';
          break;
        case 'recruiter':
          title = 'HR Consultant';
          description = 'Our HR services connect top talent with leading organizations, providing expert recruitment, talent management, and HR consulting solutions to drive business success.';
          break;
        case 'social-media':
          title = 'Curriculum Designer';
          description = 'Our social media management services help you build a stronger online presence, engage with your audience, and grow your business.';
          break;
        case 'photographer':
          title = 'Photographer';
          description = 'Capture perfect moments with our professional photography services tailored to any occasion, from events to personal sessions.';
          break;
        default:
          title = 'Service Details';
          description = 'No additional information available.';
      }

      popupTitle.textContent = title;
      popupDescription.textContent = description;
      popup.classList.add('show');
    }

    function closePopup() {
      const popup = document.getElementById('popup');
      popup.classList.remove('show');
    }
    
    // Typing effect for shipping section
    const text = "Do you want anything  From  or To anywhere? I do global deliveries.";
    let i = 0;
    function typeText() {
      if (i < text.length) {
        document.querySelector(".shipping-subtitle").textContent += text.charAt(i);
        i++;
        setTimeout(typeText, 40);
      }
    }
    
    // Initialize when page loads
    window.onload = function() {
      typeText();
      
      // Animation for cards
      const cards = document.querySelectorAll('.service-card, .service-card1, .card2');
      const effects = [
        { name: 'quantum', duration: 1.2 },
        { name: 'neon', duration: 1.8 }, 
        { name: 'particle', duration: 1.5 },
        { name: 'hologram', duration: 1.2 },
        { name: 'flip', duration: 1 }
      ];

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            const card = entry.target;
            
            card.style.setProperty('--anim-duration', `${randomEffect.duration}s`);
            card.classList.add('card-animated', randomEffect.name);
            
            // Remove observer after animation completes
            setTimeout(() => {
              observer.unobserve(card);
            }, randomEffect.duration * 1000);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      cards.forEach(card => {
        card.style.setProperty('--delay', `${Math.random() * 0.3}s`);
        observer.observe(card);
      });
    };

  function sendWhatsAppMessage(service) {
    const phone = "256750366195"; // Your WhatsApp number
    let message = "";

    switch(service) {
      // CODING SERVICES
      case "coding":
        message = "Hello, I would love to discus about your 'Custom Web Development' service.";
        break;
      case "app":
        message = "Hello, I am interested in your 'Mobile App Development' service.";
        break;
      case "web":
        message = "Hello, I’d like to know more about your 'Web Designing Course'.";
        break;

      // VIRTUAL COMPANION
      case "engagement":
        message = "Hello, I’d like to have an 'Engagement Chat' session with you.";
        break;
      case "life":
        message = "Hello, I am interested in booking a 'Life Advice Session'.";
        break;
      case "entertain":
        message = "Hello, I’d like to book an 'Entertainment Chat' with you.";
        break;

      // DATING COACH
      case "loveconnect":
        message = "Hello, I’d like to try the 'Love-Match' service.";
        break;
      case "gift":
        message = "Hello, I am interested in your 'Gift Concierge' service.";
        break;
      case "go":
        message = "Hello, I’d like to use your 'GoSuggest' travel recommendation service.";
        break;

      default:
        message = "Hello, I’d like to learn more about your services.";
    }

    // Open WhatsApp chat with pre-filled message
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }


  function sendWhatsApp(button) {
    const phoneNumber = "256750366195"; // your WhatsApp number
    const serviceCard = button.closest(".service-card1");
    const serviceName = serviceCard.querySelector("h3").innerText.trim();

    const message = `Hello, I would love Us to discus more about "${serviceName}" service.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }




