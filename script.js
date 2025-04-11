// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.endsWith(linkPath)) {
            link.classList.add('active');
        }
    });
    
    // Topic filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const topicCards = document.querySelectorAll('.topic-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Show/hide topic cards based on filter
            topicCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Toggle active class
            item.classList.toggle('active');
            
            // Update icon
            const icon = header.querySelector('.accordion-icon');
            icon.textContent = item.classList.contains('active') ? '−' : '+';
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
            
            // In a real application, you would send the form data to a server here
            // using fetch or XMLHttpRequest
        });
    }
    
    // Code syntax highlighting
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
    
    // Practice question links tracking
    const practiceLinks = document.querySelectorAll('.practice-card a');
    
    practiceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // In a real application, you might want to track which practice questions
            // users are accessing most frequently
            console.log('Practice link clicked:', this.href);
        });
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Topic content navigation - save reading progress
    const topicContent = document.querySelector('#topic-content');
    
    if (topicContent) {
        // Get the current page URL to use as a key for localStorage
        const currentPage = window.location.pathname;
        
        // Scroll to last position if user returns to the page
        const savedPosition = localStorage.getItem(`scrollPos_${currentPage}`);
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition));
        }
        
        // Save scroll position when user leaves the page
        window.addEventListener('beforeunload', () => {
            localStorage.setItem(`scrollPos_${currentPage}`, window.scrollY);
        });
        
        // Calculate reading progress
        window.addEventListener('scroll', () => {
            const totalHeight = topicContent.clientHeight;
            const windowHeight = window.innerHeight;
            const scrollPosition = window.scrollY;
            const scrollPercent = (scrollPosition / (totalHeight - windowHeight)) * 100;
            
            // Optional: Add a progress bar to show reading progress
            // This would require adding a progress bar element to the HTML
            const progressBar = document.querySelector('.reading-progress');
            if (progressBar) {
                progressBar.style.width = `${Math.min(100, scrollPercent)}%`;
            }
        });
    }
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const topicCards = document.querySelectorAll('.topic-card, .card');
            
            topicCards.forEach(card => {
                const cardTitle = card.querySelector('h4').textContent.toLowerCase();
                const cardDescription = card.querySelector('p').textContent.toLowerCase();
                
                if (cardTitle.includes(searchTerm) || cardDescription.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Theme toggle if present
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});     