// Global login button functionality for all pages
// This script should be included on all pages to handle the login button state

document.addEventListener('DOMContentLoaded', function() {
    updateGlobalLoginButton();
});

function updateGlobalLoginButton() {
    const loginBtn = document.getElementById('login-btn');
    if (!loginBtn) return;
    
    const savedUser = localStorage.getItem('progguide_user');
    
    if (savedUser) {
        const user = JSON.parse(savedUser);
        
        // Update button to show user info
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
        loginBtn.href = '#';
        loginBtn.onclick = function(e) {
            e.preventDefault();
            showGlobalUserMenu();
        };
    }
}

function showGlobalUserMenu() {
    const savedUser = localStorage.getItem('progguide_user');
    if (!savedUser) return;
    
    const user = JSON.parse(savedUser);
    
    // Remove existing menu
    const existingMenu = document.getElementById('global-user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    // Create dropdown menu
    const menu = document.createElement('div');
    menu.id = 'global-user-menu';
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-header">
            <div class="user-avatar">
                <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=3a5bbf&color=fff'}" alt="${user.name}">
            </div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
            </div>
        </div>
        <div class="user-menu-items">
            <a href="dashboard.html" class="menu-item">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a href="#" class="menu-item" onclick="showGlobalNotification('Profile editing feature coming soon!', 'info')">
                <i class="fas fa-user-edit"></i> Edit Profile
            </a>
            <a href="#" class="menu-item" onclick="showGlobalNotification('Settings feature coming soon!', 'info')">
                <i class="fas fa-cog"></i> Settings
            </a>
            <div class="menu-divider"></div>
            <a href="#" class="menu-item logout-item" onclick="globalLogout()">
                <i class="fas fa-sign-out-alt"></i> Logout
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

function globalLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('progguide_user');
        showGlobalNotification('You have been logged out successfully', 'info');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
    
    // Close user menu
    const menu = document.getElementById('global-user-menu');
    if (menu) menu.remove();
}

function showGlobalNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Set colors based on type
    const colors = {
        success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
        error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
        warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
        info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.border = `1px solid ${color.border}`;
    notification.style.color = color.text;
    
    // Style the content
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
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
    
    // Close user menu
    const menu = document.getElementById('global-user-menu');
    if (menu) menu.remove();
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}
