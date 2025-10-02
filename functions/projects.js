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
        
        // Carousel interaction
        const carouselItems = document.querySelectorAll('.carousel .item');
        carouselItems.forEach(item => {
            item.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project');
                const projectCard = document.querySelector(`.project-card:nth-child(${Array.from(carouselItems).indexOf(this) + 1})`);
                
                if (projectCard) {
                    projectCard.scrollIntoView({ behavior: 'smooth' });
                    
                    // Add highlight effect
                    projectCard.style.boxShadow = '0 0 30px rgba(108, 92, 231, 0.8)';
                    setTimeout(() => {
                        projectCard.style.boxShadow = '';
                    }, 2000);
                }
            });
        });
        
        // Animation for cards
        const cards = document.querySelectorAll('.project-card, .dev-project-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });