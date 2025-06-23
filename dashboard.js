// Dashboard functionality for progguide

// Global variables
let currentUser = null;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    updateLoginButton();
    initializeInteractiveFeatures();
});

// Initialize interactive features
function initializeInteractiveFeatures() {
    // Add click handlers for calendar days
    document.querySelectorAll('.calendar-day').forEach(day => {
        if (!day.classList.contains('header')) {
            day.addEventListener('click', function() {
                selectCalendarDay(this);
            });
        }
    });

    // Add animation to stat cards
    animateStatCards();
    
    // Initialize chart animations
    animateCharts();
}

// Animate stat cards on page load
function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'all 0.6s ease-out';
        }, index * 100);
    });
}

// Animate charts
function animateCharts() {
    setTimeout(() => {
        // Animate progress bars
        document.querySelectorAll('.progress-fill, .skill-fill, .goal-fill').forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.width = width;
                fill.style.transition = 'width 1s ease-out';
            }, 100);
        });

        // Animate chart bars
        document.querySelectorAll('.bar-fill').forEach((bar, index) => {
            const height = bar.style.height;
            bar.style.height = '0';
            setTimeout(() => {
                bar.style.height = height;
                bar.style.transition = 'height 0.8s ease-out';
            }, index * 100);
        });
    }, 500);
}

// Check if user is already authenticated
function checkAuthState() {
    const savedUser = localStorage.getItem('progguide_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLoginPrompt();
    }
}

// Update login button based on auth state
function updateLoginButton() {
    const loginBtn = document.getElementById('login-btn');
    if (currentUser && loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        loginBtn.href = '#';
        loginBtn.onclick = function(e) {
            e.preventDefault();
            showUserMenu();
        };
    }
}

// Show user menu when clicking on user button
function showUserMenu() {
    // Create dropdown menu
    const existingMenu = document.getElementById('user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.id = 'user-menu';
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-header">
            <div class="user-avatar">
                <img src="${currentUser.avatar || 'https://via.placeholder.com/40'}" alt="Avatar">
            </div>
            <div class="user-info">
                <div class="user-name">${currentUser.name}</div>
                <div class="user-email">${currentUser.email}</div>
            </div>
        </div>
        <div class="user-menu-items">
            <a href="#" class="menu-item" onclick="editProfile()">
                <i class="fas fa-user-edit"></i>
                <span>Edit Profile</span>
            </a>
            <a href="#" class="menu-item" onclick="showSettings()">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
            </a>
            <a href="#" class="menu-item" onclick="showAchievements()">
                <i class="fas fa-trophy"></i>
                <span>Achievements</span>
            </a>
            <div class="menu-divider"></div>
            <a href="#" class="menu-item logout-item" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </a>
        </div>
    `;
    
    // Position menu
    const loginBtn = document.getElementById('login-btn');
    const rect = loginBtn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + 10) + 'px';
    menu.style.right = '20px';
    menu.style.zIndex = '1000';
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && e.target !== loginBtn) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function showDashboard() {
    const dashboardContent = document.getElementById('dashboard-content');
    const loginPrompt = document.getElementById('login-prompt');
    
    if (dashboardContent) {
        dashboardContent.style.display = 'block';
        document.getElementById('user-name').textContent = currentUser.name;
    }
    if (loginPrompt) {
        loginPrompt.style.display = 'none';
    }
}

function showLoginPrompt() {
    const dashboardContent = document.getElementById('dashboard-content');
    const loginPrompt = document.getElementById('login-prompt');
    
    if (dashboardContent) dashboardContent.style.display = 'none';
    if (loginPrompt) loginPrompt.style.display = 'flex';
}

// Profile functions
function editProfile() {
    showModal('Edit Profile', `
        <form id="profile-form" class="modal-form">
            <div class="form-group">
                <label for="profile-name">Full Name</label>
                <input type="text" id="profile-name" value="${currentUser.name}" required>
            </div>
            <div class="form-group">
                <label for="profile-email">Email</label>
                <input type="email" id="profile-email" value="${currentUser.email}" required>
            </div>
            <div class="form-group">
                <label for="profile-bio">Bio</label>
                <textarea id="profile-bio" rows="3" placeholder="Tell us about yourself...">${currentUser.bio || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="profile-avatar">Avatar URL</label>
                <input type="url" id="profile-avatar" value="${currentUser.avatar || ''}" placeholder="https://...">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </form>
    `);
    
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // Update user data
        currentUser.name = document.getElementById('profile-name').value;
        currentUser.email = document.getElementById('profile-email').value;
        currentUser.bio = document.getElementById('profile-bio').value;
        currentUser.avatar = document.getElementById('profile-avatar').value;
        
        localStorage.setItem('progguide_user', JSON.stringify(currentUser));
        showNotification('Profile updated successfully!', 'success');
        closeModal();
        updateLoginButton();
        showDashboard();
    });
}

function showSettings() {
    showModal('Settings', `
        <div class="settings-tabs">
            <button class="tab-btn active" onclick="showSettingsTab('general')">General</button>
            <button class="tab-btn" onclick="showSettingsTab('notifications')">Notifications</button>
            <button class="tab-btn" onclick="showSettingsTab('privacy')">Privacy</button>
        </div>
        
        <div class="settings-content">
            <div id="general-settings" class="settings-tab active">
                <div class="form-group">
                    <label>Theme</label>
                    <select id="theme-select">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Language</label>
                    <select id="language-select">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="auto-save">
                        <span class="checkmark"></span>
                        Auto-save progress
                    </label>
                </div>
            </div>
            
            <div id="notifications-settings" class="settings-tab">
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="email-notifications" checked>
                        <span class="checkmark"></span>
                        Email notifications
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="push-notifications" checked>
                        <span class="checkmark"></span>
                        Push notifications
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="study-reminders" checked>
                        <span class="checkmark"></span>
                        Study reminders
                    </label>
                </div>
            </div>
            
            <div id="privacy-settings" class="settings-tab">
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="public-profile">
                        <span class="checkmark"></span>
                        Make profile public
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="share-progress">
                        <span class="checkmark"></span>
                        Share progress with study buddies
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="analytics-tracking" checked>
                        <span class="checkmark"></span>
                        Allow analytics tracking
                    </label>
                </div>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="saveSettings()">Save Settings</button>
        </div>
    `);
}

function showSettingsTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-settings').classList.add('active');
    event.target.classList.add('active');
}

function saveSettings() {
    // Save settings to localStorage
    const settings = {
        theme: document.getElementById('theme-select').value,
        language: document.getElementById('language-select').value,
        autoSave: document.getElementById('auto-save').checked,
        emailNotifications: document.getElementById('email-notifications').checked,
        pushNotifications: document.getElementById('push-notifications').checked,
        studyReminders: document.getElementById('study-reminders').checked,
        publicProfile: document.getElementById('public-profile').checked,
        shareProgress: document.getElementById('share-progress').checked,
        analyticsTracking: document.getElementById('analytics-tracking').checked
    };
    
    localStorage.setItem('progguide_settings', JSON.stringify(settings));
    showNotification('Settings saved successfully!', 'success');
    closeModal();
}

function showAchievements() {
    const achievements = [
        { id: 1, name: 'First Steps', description: 'Complete your first topic', icon: 'baby', earned: true, date: '2025-06-15' },
        { id: 2, name: 'Week Warrior', description: 'Study for 7 consecutive days', icon: 'fire', earned: true, date: '2025-06-20' },
        { id: 3, name: 'Algorithm Master', description: 'Complete 10 algorithm topics', icon: 'brain', earned: true, date: '2025-06-22' },
        { id: 4, name: 'Speed Demon', description: 'Complete a topic in under 30 minutes', icon: 'bolt', earned: false },
        { id: 5, name: 'Social Butterfly', description: 'Connect with 5 study buddies', icon: 'users', earned: false },
        { id: 6, name: 'Perfectionist', description: 'Score 100% on 5 quizzes', icon: 'star', earned: false },
        { id: 7, name: 'Night Owl', description: 'Study after 10 PM for 5 days', icon: 'moon', earned: false },
        { id: 8, name: 'Data Structures Guru', description: 'Master all data structure topics', icon: 'database', earned: false }
    ];

    const earnedCount = achievements.filter(a => a.earned).length;
    const totalXP = earnedCount * 100;

    showModal('Achievements', `
        <div class="achievements-header">
            <div class="achievement-stats">
                <div class="achievement-stat">
                    <span class="stat-number">${earnedCount}</span>
                    <span class="stat-label">Earned</span>
                </div>
                <div class="achievement-stat">
                    <span class="stat-number">${achievements.length - earnedCount}</span>
                    <span class="stat-label">Remaining</span>
                </div>
                <div class="achievement-stat">
                    <span class="stat-number">${totalXP}</span>
                    <span class="stat-label">XP Earned</span>
                </div>
            </div>
        </div>
        
        <div class="achievements-grid">
            ${achievements.map(achievement => `
                <div class="achievement-card ${achievement.earned ? 'earned' : 'locked'}">
                    <div class="achievement-icon">
                        <i class="fas fa-${achievement.icon}"></i>
                    </div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                        ${achievement.earned ? `<span class="achievement-date">Earned on ${achievement.date}</span>` : '<span class="achievement-locked">Not earned yet</span>'}
                    </div>
                    ${achievement.earned ? '<div class="achievement-badge"><i class="fas fa-check"></i></div>' : ''}
                </div>
            `).join('')}
        </div>
    `);
}

// Logout function
function logout() {
    localStorage.removeItem('progguide_user');
    currentUser = null;
    showLoginPrompt();
    updateLoginButton();
    showNotification('Logged out successfully!', 'info');
}

// Dashboard interaction functions
function viewDetailedProgress() {
    showModal('Detailed Progress', `
        <div class="progress-detailed">
            <div class="progress-overview">
                <h3>Overall Progress</h3>
                <div class="progress-circle">
                    <svg width="120" height="120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" stroke-width="8"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--primary-color)" stroke-width="8" 
                                stroke-dasharray="314" stroke-dashoffset="229" stroke-linecap="round"/>
                    </svg>
                    <div class="progress-text">27%</div>
                </div>
            </div>
            
            <div class="topic-progress">
                <h3>Topics by Category</h3>
                <div class="category-list">
                    <div class="category-item">
                        <span class="category-name">Arrays & Strings</span>
                        <div class="category-progress">
                            <div class="category-bar">
                                <div class="category-fill" style="width: 80%"></div>
                            </div>
                            <span class="category-percent">4/5</span>
                        </div>
                    </div>
                    <div class="category-item">
                        <span class="category-name">Dynamic Programming</span>
                        <div class="category-progress">
                            <div class="category-bar">
                                <div class="category-fill" style="width: 60%"></div>
                            </div>
                            <span class="category-percent">3/5</span>
                        </div>
                    </div>
                    <div class="category-item">
                        <span class="category-name">Graph Algorithms</span>
                        <div class="category-progress">
                            <div class="category-bar">
                                <div class="category-fill" style="width: 40%"></div>
                            </div>
                            <span class="category-percent">2/5</span>
                        </div>
                    </div>
                    <div class="category-item">
                        <span class="category-name">Trees</span>
                        <div class="category-progress">
                            <div class="category-bar">
                                <div class="category-fill" style="width: 20%"></div>
                            </div>
                            <span class="category-percent">1/5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function openFullCalendar() {
    showModal('Study Calendar', `
        <div class="full-calendar">
            <div class="calendar-controls">
                <button class="btn btn-secondary" onclick="previousMonth()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h3 id="calendar-month-year">June 2025</h3>
                <button class="btn btn-secondary" onclick="nextMonth()">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <div class="calendar-legend">
                <div class="legend-item">
                    <div class="legend-color completed"></div>
                    <span>Study Day</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color today"></div>
                    <span>Today</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color planned"></div>
                    <span>Planned</span>
                </div>
            </div>
            
            <div class="full-calendar-grid">
                <div class="calendar-header-row">
                    <div class="calendar-header-cell">Sun</div>
                    <div class="calendar-header-cell">Mon</div>
                    <div class="calendar-header-cell">Tue</div>
                    <div class="calendar-header-cell">Wed</div>
                    <div class="calendar-header-cell">Thu</div>
                    <div class="calendar-header-cell">Fri</div>
                    <div class="calendar-header-cell">Sat</div>
                </div>
                <!-- Calendar days would be generated here -->
            </div>
        </div>
    `, 'large');
}

function selectCalendarDay(dayElement) {
    // Remove previous selections
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Add selection to clicked day
    dayElement.classList.add('selected');
    
    // Show day details (you could expand this)
    const dayNumber = dayElement.textContent;
    showNotification(`Selected June ${dayNumber}, 2025`, 'info');
}

// Bookmark functions
function manageBookmarks() {
    showModal('Manage Bookmarks', `
        <div class="bookmark-manager">
            <div class="bookmark-filters">
                <input type="text" id="bookmark-search" placeholder="Search bookmarks..." class="search-input">
                <select id="bookmark-category">
                    <option value="">All Categories</option>
                    <option value="algorithms">Algorithms</option>
                    <option value="data-structures">Data Structures</option>
                    <option value="graphs">Graphs</option>
                    <option value="math">Mathematics</option>
                </select>
            </div>
            
            <div class="bookmark-list-full">
                <!-- Bookmarks would be loaded here -->
            </div>
        </div>
    `);
}

function addBookmark() {
    showModal('Add Bookmark', `
        <form id="add-bookmark-form" class="modal-form">
            <div class="form-group">
                <label for="bookmark-title">Title</label>
                <input type="text" id="bookmark-title" required placeholder="Topic or resource title">
            </div>
            <div class="form-group">
                <label for="bookmark-url">URL</label>
                <input type="url" id="bookmark-url" required placeholder="https://...">
            </div>
            <div class="form-group">
                <label for="bookmark-category">Category</label>
                <select id="bookmark-category" required>
                    <option value="">Select Category</option>
                    <option value="algorithms">Algorithms</option>
                    <option value="data-structures">Data Structures</option>
                    <option value="graphs">Graphs</option>
                    <option value="math">Mathematics</option>
                </select>
            </div>
            <div class="form-group">
                <label for="bookmark-notes">Notes (Optional)</label>
                <textarea id="bookmark-notes" rows="3" placeholder="Add any notes about this bookmark..."></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Bookmark</button>
            </div>
        </form>
    `);
    
    document.getElementById('add-bookmark-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Bookmark added successfully!', 'success');
        closeModal();
    });
}

function removeBookmark(button) {
    const bookmarkItem = button.closest('.bookmark-item');
    bookmarkItem.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
        bookmarkItem.remove();
        showNotification('Bookmark removed', 'info');
    }, 300);
}

function viewAllBookmarks() {
    window.location.href = 'bookmarks.html'; // You could create this page
}

// Goal functions
function addGoal() {
    showModal('Add Learning Goal', `
        <form id="add-goal-form" class="modal-form">
            <div class="form-group">
                <label for="goal-title">Goal Title</label>
                <input type="text" id="goal-title" required placeholder="What do you want to achieve?">
            </div>
            <div class="form-group">
                <label for="goal-description">Description</label>
                <textarea id="goal-description" rows="3" placeholder="Describe your goal in detail..."></textarea>
            </div>
            <div class="form-group">
                <label for="goal-deadline">Target Date</label>
                <input type="date" id="goal-deadline" required>
            </div>
            <div class="form-group">
                <label for="goal-priority">Priority</label>
                <select id="goal-priority" required>
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Goal</button>
            </div>
        </form>
    `);
    
    document.getElementById('add-goal-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Goal created successfully!', 'success');
        closeModal();
    });
}

function setNewGoal() {
    addGoal(); // Same as addGoal
}

// Activity functions
function viewAllActivity() {
    showModal('Activity History', `
        <div class="activity-history">
            <div class="activity-filters">
                <select id="activity-filter">
                    <option value="all">All Activities</option>
                    <option value="completed">Completed</option>
                    <option value="bookmarks">Bookmarks</option>
                    <option value="achievements">Achievements</option>
                </select>
                <input type="date" id="activity-date" class="date-input">
            </div>
            
            <div class="activity-timeline">
                <!-- Activity items would be loaded here -->
            </div>
        </div>
    `, 'large');
}

// Analytics functions
function viewDetailedStats() {
    showModal('Detailed Analytics', `
        <div class="analytics-dashboard">
            <div class="analytics-tabs">
                <button class="tab-btn active" onclick="showAnalyticsTab('overview')">Overview</button>
                <button class="tab-btn" onclick="showAnalyticsTab('performance')">Performance</button>
                <button class="tab-btn" onclick="showAnalyticsTab('time')">Time Tracking</button>
            </div>
            
            <div class="analytics-content">
                <div id="overview-analytics" class="analytics-tab active">
                    <div class="analytics-grid">
                        <div class="analytics-card">
                            <h4>Learning Streak</h4>
                            <div class="streak-visual">
                                <div class="streak-number">7</div>
                                <div class="streak-label">Days</div>
                                <i class="fas fa-fire streak-icon"></i>
                            </div>
                        </div>
                        <div class="analytics-card">
                            <h4>Topics Mastered</h4>
                            <div class="mastery-chart">
                                <!-- Chart would go here -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="performance-analytics" class="analytics-tab">
                    <div class="performance-metrics">
                        <h4>Performance Trends</h4>
                        <!-- Performance charts would go here -->
                    </div>
                </div>
                
                <div id="time-analytics" class="analytics-tab">
                    <div class="time-tracking">
                        <h4>Study Time Distribution</h4>
                        <!-- Time tracking charts would go here -->
                    </div>
                </div>
            </div>
        </div>
    `, 'large');
}

function showAnalyticsTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.analytics-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-analytics').classList.add('active');
    event.target.classList.add('active');
}

// Quick Actions functions
function startRandomTopic() {
    const randomTopics = [
        'binary-search.html',
        'dynamic-programming.html',
        'graph-traversal.html',
        'sorting.html',
        'trees.html'
    ];
    
    const randomTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
    showNotification('Opening random topic...', 'info');
    setTimeout(() => {
        window.location.href = `topics/${randomTopic}`;
    }, 500);
}

function continueLastTopic() {
    const lastTopic = localStorage.getItem('progguide_last_topic') || 'arrays-and-strings.html';
    showNotification('Continuing where you left off...', 'info');
    setTimeout(() => {
        window.location.href = `topics/${lastTopic}`;
    }, 500);
}

function takeQuiz() {
    showModal('Take a Quiz', `
        <div class="quiz-selector">
            <h3>Choose a Quiz Topic</h3>
            <div class="quiz-options">
                <div class="quiz-option" onclick="startQuiz('arrays')">
                    <i class="fas fa-list"></i>
                    <h4>Arrays & Strings</h4>
                    <p>10 questions • 15 minutes</p>
                </div>
                <div class="quiz-option" onclick="startQuiz('algorithms')">
                    <i class="fas fa-code"></i>
                    <h4>Basic Algorithms</h4>
                    <p>15 questions • 20 minutes</p>
                </div>
                <div class="quiz-option" onclick="startQuiz('data-structures')">
                    <i class="fas fa-database"></i>
                    <h4>Data Structures</h4>
                    <p>12 questions • 18 minutes</p>
                </div>
                <div class="quiz-option" onclick="startQuiz('mixed')">
                    <i class="fas fa-random"></i>
                    <h4>Mixed Topics</h4>
                    <p>20 questions • 30 minutes</p>
                </div>
            </div>
        </div>
    `);
}

function startQuiz(topic) {
    closeModal();
    showNotification(`Starting ${topic} quiz...`, 'info');
    // You could implement actual quiz functionality here
}

function findStudyBuddy() {
    showModal('Find Study Buddy', `
        <div class="study-buddy-finder">
            <div class="finder-header">
                <h3>Connect with Fellow Learners</h3>
                <p>Find study partners who share your interests and goals</p>
            </div>
            
            <div class="buddy-filters">
                <div class="form-group">
                    <label>Learning Level</label>
                    <select id="buddy-level">
                        <option value="">Any Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Focus Area</label>
                    <select id="buddy-focus">
                        <option value="">Any Topic</option>
                        <option value="algorithms">Algorithms</option>
                        <option value="data-structures">Data Structures</option>
                        <option value="system-design">System Design</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Time Zone</label>
                    <select id="buddy-timezone">
                        <option value="">Any Time Zone</option>
                        <option value="pst">PST</option>
                        <option value="est">EST</option>
                        <option value="gmt">GMT</option>
                    </select>
                </div>
            </div>
            
            <div class="buddy-suggestions">
                <div class="buddy-card">
                    <div class="buddy-avatar">
                        <img src="https://via.placeholder.com/50" alt="Alex">
                    </div>
                    <div class="buddy-info">
                        <h4>Alex Chen</h4>
                        <p>Intermediate • Focus: Algorithms</p>
                        <span class="buddy-status online">Online now</span>
                    </div>
                    <button class="btn btn-primary btn-small">Connect</button>
                </div>
                
                <div class="buddy-card">
                    <div class="buddy-avatar">
                        <img src="https://via.placeholder.com/50" alt="Sarah">
                    </div>
                    <div class="buddy-info">
                        <h4>Sarah Johnson</h4>
                        <p>Advanced • Focus: System Design</p>
                        <span class="buddy-status">Last seen 2h ago</span>
                    </div>
                    <button class="btn btn-primary btn-small">Connect</button>
                </div>
            </div>
        </div>
    `);
}

function joinLiveSession() {
    showModal('Live Study Sessions', `
        <div class="live-sessions">
            <div class="sessions-header">
                <h3>Join a Live Study Session</h3>
                <p>Learn together with others in real-time</p>
            </div>
            
            <div class="session-list">
                <div class="session-card">
                    <div class="session-info">
                        <h4>Dynamic Programming Mastery</h4>
                        <p>Hosted by Dr. Smith • Intermediate Level</p>
                        <div class="session-meta">
                            <span><i class="fas fa-users"></i> 15/25 participants</span>
                            <span><i class="fas fa-clock"></i> Starts in 10 minutes</span>
                        </div>
                    </div>
                    <button class="btn btn-primary">Join Session</button>
                </div>
                
                <div class="session-card">
                    <div class="session-info">
                        <h4>Graph Algorithms Workshop</h4>
                        <p>Hosted by Prof. Davis • Advanced Level</p>
                        <div class="session-meta">
                            <span><i class="fas fa-users"></i> 8/20 participants</span>
                            <span><i class="fas fa-clock"></i> Starts in 45 minutes</span>
                        </div>
                    </div>
                    <button class="btn btn-primary">Join Session</button>
                </div>
                
                <div class="session-card">
                    <div class="session-info">
                        <h4>Beginner's Study Group</h4>
                        <p>Hosted by Sarah • Beginner Level</p>
                        <div class="session-meta">
                            <span><i class="fas fa-users"></i> 12/30 participants</span>
                            <span><i class="fas fa-clock"></i> Live now</span>
                        </div>
                    </div>
                    <button class="btn btn-success">Join Now</button>
                </div>
            </div>
        </div>
    `);
}

function downloadResources() {
    showModal('Download Resources', `
        <div class="download-center">
            <div class="download-header">
                <h3>Study Resources</h3>
                <p>Download materials to study offline</p>
            </div>
            
            <div class="resource-categories">
                <div class="resource-category">
                    <h4><i class="fas fa-file-pdf"></i> Cheat Sheets</h4>
                    <div class="resource-list">
                        <div class="resource-item">
                            <span>Big O Notation Cheat Sheet</span>
                            <button class="btn btn-small">Download PDF</button>
                        </div>
                        <div class="resource-item">
                            <span>Data Structures Quick Reference</span>
                            <button class="btn btn-small">Download PDF</button>
                        </div>
                        <div class="resource-item">
                            <span>Sorting Algorithms Summary</span>
                            <button class="btn btn-small">Download PDF</button>
                        </div>
                    </div>
                </div>
                
                <div class="resource-category">
                    <h4><i class="fas fa-code"></i> Code Templates</h4>
                    <div class="resource-list">
                        <div class="resource-item">
                            <span>Graph Traversal Templates</span>
                            <button class="btn btn-small">Download ZIP</button>
                        </div>
                        <div class="resource-item">
                            <span>Dynamic Programming Patterns</span>
                            <button class="btn btn-small">Download ZIP</button>
                        </div>
                    </div>
                </div>
                
                <div class="resource-category">
                    <h4><i class="fas fa-book"></i> Study Guides</h4>
                    <div class="resource-list">
                        <div class="resource-item">
                            <span>Interview Preparation Guide</span>
                            <button class="btn btn-small">Download PDF</button>
                        </div>
                        <div class="resource-item">
                            <span>Problem-Solving Strategies</span>
                            <button class="btn btn-small">Download PDF</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

// Recommendations functions
function refreshRecommendations() {
    const recommendationList = document.querySelector('.recommendation-list');
    if (recommendationList) {
        recommendationList.style.opacity = '0.5';
        setTimeout(() => {
            recommendationList.style.opacity = '1';
            showNotification('Recommendations updated!', 'success');
        }, 1000);
    }
}

// Modal functions
function showModal(title, content, size = 'medium') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal ${size}">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking overlay
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function showAuthModal(tab = 'login') {
    window.location.href = `login.html${tab === 'register' ? '#register' : ''}`;
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
        color: var(--text-primary);
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.7;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Export functions for global access
window.editProfile = editProfile;
window.showSettings = showSettings;
window.showAchievements = showAchievements;
window.logout = logout;
window.viewDetailedProgress = viewDetailedProgress;
window.openFullCalendar = openFullCalendar;
window.manageBookmarks = manageBookmarks;
window.addBookmark = addBookmark;
window.removeBookmark = removeBookmark;
window.viewAllBookmarks = viewAllBookmarks;
window.addGoal = addGoal;
window.setNewGoal = setNewGoal;
window.viewAllActivity = viewAllActivity;
window.viewDetailedStats = viewDetailedStats;
window.startRandomTopic = startRandomTopic;
window.continueLastTopic = continueLastTopic;
window.takeQuiz = takeQuiz;
window.findStudyBuddy = findStudyBuddy;
window.joinLiveSession = joinLiveSession;
window.downloadResources = downloadResources;
window.refreshRecommendations = refreshRecommendations;
window.showAuthModal = showAuthModal;
window.showModal = showModal;
window.closeModal = closeModal;
window.showNotification = showNotification;
