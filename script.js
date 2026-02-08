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
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navMenu = document.getElementById('nav-menu');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const menuIcon = document.getElementById('menu-icon');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        }
    });
    
    // Close mobile menu when window is resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.classList.remove('active');
                const menuIcon = document.getElementById('menu-icon');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        }
    });
    
    // Topic filters with category hiding
    const filterButtons = document.querySelectorAll('.filter-btn');
    const topicCards = document.querySelectorAll('.topic-card');
    const topicCategories = document.querySelectorAll('.topic-category');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            if (filter === 'all') {
                // Show all topics and categories when "all" is selected
                topicCards.forEach(card => {
                    card.style.display = 'block';
                });
                
                topicCategories.forEach(category => {
                    category.style.display = 'block';
                });
            } else {
                // For specific filters, process each category individually
                topicCategories.forEach(category => {
                    const cardsInCategory = category.querySelectorAll('.topic-card');
                    let hasVisibleCards = false;
                    
                    // Check if any cards in this category match the filter
                    cardsInCategory.forEach(card => {
                        if (card.getAttribute('data-category') === filter) {
                            card.style.display = 'block';
                            hasVisibleCards = true;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    // Show or hide the entire category based on whether it has matching cards
                    category.style.display = hasVisibleCards ? 'block' : 'none';
                });
            }
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
    
    // Practice completion tracking
    initPracticeTracking();
    
    // Theme management
    initializeTheme();
});

// Practice completion tracking functionality
function initPracticeTracking() {
    // Load saved progress when page loads
    loadSavedProgress();
    
    // Hook up any toggle buttons that exist on the page
    const toggleBtn = document.querySelector('button[onclick="toggleCompletionForm"]');
    if (toggleBtn) {
        toggleBtn.onclick = toggleCompletionForm;
    }
    
    // Check if we're on a page with a progress bar to update
    const progressBarElement = document.querySelector('.submission-tracker .progress');
    if (progressBarElement) {
        updateProgressDisplay();
    }
}

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme === 'auto' ? (systemPrefersDark ? 'dark' : 'light') : savedTheme;
    
    setTheme(theme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggle(theme);
}

function updateThemeToggle(theme) {
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (themeIcon && themeText) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Dark';
        }
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Topic filtering functionality
function filterTopics() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const topicCards = document.querySelectorAll('.topic-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            topicCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Contact form accordion functionality
function initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// Progress tracking functionality
function initializeProgressTracking() {
    const checkboxes = document.querySelectorAll('.form-check-input');
    const totalCount = document.getElementById('total-count');
    const completedCount = document.getElementById('completed-count');
    const progressBar = document.querySelector('.progress');

    if (checkboxes.length > 0 && totalCount && completedCount && progressBar) {
        // Load saved progress
        loadProgress();
        
        // Update display
        updateProgressDisplay();
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateProgressDisplay();
                saveProgress();
            });
        });
    }
}

function updateProgress() {
    // Get current page to create a specific key
    const currentPage = window.location.pathname;
    const topicKey = currentPage.split('/').pop().replace('.html', '');
    const storageKey = `${topicKey}Progress`;
    
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('.form-check-input');
    
    // Store checked state of all boxes
    localStorage.setItem(storageKey, JSON.stringify(
        Array.from(checkboxes).map(cb => cb.checked)
    ));
    
    updateProgressDisplay();
    
    // Hide form after saving
    document.getElementById('completion-form').style.display = 'none';
}

function updateProgressDisplay() {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('.form-check-input');
    
    // Count checked boxes
    let completed = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            completed++;
        }
    });
    
    // Update progress bar
    const progressBar = document.querySelector('.submission-tracker .progress');
    const completedCount = document.getElementById('completed-count');
    const total = checkboxes.length;
    
    if (progressBar && completedCount) {
        progressBar.style.width = (completed / total * 100) + '%';
        completedCount.textContent = completed;
    }
}

function saveProgress() {
    const checkboxes = document.querySelectorAll('.form-check-input');
    const progress = {};
    
    checkboxes.forEach(checkbox => {
        progress[checkbox.id] = checkbox.checked;
    });
    
    localStorage.setItem('learningProgress', JSON.stringify(progress));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('learningProgress');
    
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        
        Object.keys(progress).forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                checkbox.checked = progress[checkboxId];
            }
        });
    }
}

function toggleCompletionForm() {
    const form = document.getElementById('completion-form');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

// Smart Search Functionality
const searchTopics = [
    { title: "Introduction to Programming", description: "Programming languages, input/output, working with numbers", category: "Basics", url: "topics/introduction.html", keywords: ["basics", "intro", "programming", "start"] },
    { title: "Variables & Data Types", description: "Understanding variables, primitive types, and type conversion", category: "Basics", url: "topics/variable.html", keywords: ["variables", "data", "types", "int", "string"] },
    { title: "Operators", description: "Arithmetic, assignment, comparison, and logical operators", category: "Basics", url: "topics/operators.html", keywords: ["operators", "arithmetic", "logic", "comparison"] },
    { title: "Conditional Statements", description: "If/else statements, switch cases, and ternary operators", category: "Basics", url: "topics/conditionals.html", keywords: ["if", "else", "switch", "conditional"] },
    { title: "Loops", description: "For loops, while loops, and loop control statements", category: "Basics", url: "topics/loops.html", keywords: ["for", "while", "loop", "iteration"] },
    { title: "Time Complexity", description: "Understanding algorithm efficiency, calculation rules, complexity classes", category: "Basics", url: "topics/time-complexity.html", keywords: ["time", "complexity", "big-o", "efficiency"] },
    { title: "Sorting Algorithms", description: "Sorting theory, implementation and binary search techniques", category: "Algorithms", url: "topics/sorting.html", keywords: ["sort", "bubble", "merge", "quick", "binary search"] },
    { title: "Complete Search", description: "Generating subsets, permutations, backtracking techniques", category: "Algorithms", url: "topics/complete-search.html", keywords: ["search", "backtrack", "permutation", "subset"] },
    { title: "Greedy Algorithms", description: "Coin problem, scheduling, tasks and deadlines, optimization", category: "Algorithms", url: "topics/greedy.html", keywords: ["greedy", "optimization", "coin", "scheduling"] },
    { title: "Dynamic Programming", description: "Optimization technique using overlapping subproblems", category: "Algorithms", url: "topics/dynamic-programming.html", keywords: ["dp", "dynamic", "memoization", "optimization"] },
    { title: "Graph Basics", description: "Graph representation, terminology, and basic concepts", category: "Graph Algorithms", url: "topics/graph-basics.html", keywords: ["graph", "vertex", "edge", "adjacency"] },
    { title: "Graph Traversal", description: "DFS, BFS, and their applications", category: "Graph Algorithms", url: "topics/graph-traversal.html", keywords: ["dfs", "bfs", "traversal", "search"] },
    { title: "Shortest Paths", description: "Dijkstra, Bellman-Ford, Floyd-Warshall algorithms", category: "Graph Algorithms", url: "topics/shortest-paths.html", keywords: ["dijkstra", "shortest", "path", "bellman"] },
    { title: "Dynamic Arrays", description: "Vector, resizing, implementation details", category: "Data Structures", url: "topics/dynamic-arrays.html", keywords: ["vector", "array", "dynamic", "resize"] },
    { title: "Set Structures", description: "Set operations, balanced binary search trees", category: "Data Structures", url: "topics/set-structures.html", keywords: ["set", "bst", "tree", "balanced"] },
    { title: "Map Structures", description: "Key-value pairs, hash tables, tree maps", category: "Data Structures", url: "topics/map-structures.html", keywords: ["map", "hash", "dictionary", "key-value"] },
    { title: "Tree Algorithms", description: "Tree traversal, LCA, tree DP", category: "Advanced", url: "topics/tree-algorithms.html", keywords: ["tree", "lca", "traversal", "dp"] },
    { title: "String Algorithms", description: "Pattern matching, string processing", category: "Advanced", url: "topics/string-algorithms.html", keywords: ["string", "pattern", "kmp", "matching"] },
    { title: "Number Theory", description: "Prime numbers, GCD, modular arithmetic", category: "Advanced", url: "topics/number-theory.html", keywords: ["prime", "gcd", "modular", "number"] },
    { title: "Competitive Programming Tips", description: "Contest strategies, debugging, optimization", category: "Advanced", url: "competitive.html", keywords: ["competitive", "contest", "tips", "strategy"] }
];

function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    let debounceTimer;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            const results = searchTopics.filter(topic => {
                return topic.title.toLowerCase().includes(query) ||
                       topic.description.toLowerCase().includes(query) ||
                       topic.category.toLowerCase().includes(query) ||
                       topic.keywords.some(keyword => keyword.includes(query));
            });
            
            displaySearchResults(results, query);
        }, 300);
    });
    
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            searchResults.style.display = 'block';
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box')) {
            searchResults.style.display = 'none';
        }
    });
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        const items = searchResults.querySelectorAll('.search-result-item');
        let currentIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentIndex < items.length - 1) {
                if (currentIndex >= 0) items[currentIndex].classList.remove('selected');
                items[currentIndex + 1].classList.add('selected');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                items[currentIndex].classList.remove('selected');
                items[currentIndex - 1].classList.add('selected');
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selected = searchResults.querySelector('.search-result-item.selected');
            if (selected) {
                const link = selected.querySelector('a') || selected;
                if (link.href) window.location.href = link.href;
            }
        }
    });
}

function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No topics found for "' + query + '"</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    const html = results.map(result => `
        <div class="search-result-item" onclick="window.location.href='${result.url}'">
            <i class="fas fa-book search-result-icon"></i>
            <div class="search-result-content">
                <div class="search-result-title">${highlightMatch(result.title, query)}</div>
                <div class="search-result-description">${highlightMatch(result.description, query)}</div>
                <div class="search-result-category">${result.category}</div>
            </div>
        </div>
    `).join('');
    
    searchResults.innerHTML = html;
    searchResults.style.display = 'block';
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background-color: var(--primary-color); color: white; padding: 0 2px;">$1</mark>');
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = document.getElementById('menu-icon');
    
    if (navMenu) {
        navMenu.classList.toggle('active');
        
        // Toggle icon between hamburger and close
        if (menuIcon) {
            if (navMenu.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        }
    }
}

// Global keyboard shortcut for search
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
});

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    filterTopics();
    initializeAccordion();
    initializeProgressTracking();
    initializeSearch();
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'auto' || !savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});