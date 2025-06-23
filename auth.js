// Authentication functionality for progguide

// Global variables
let currentUser = null;
let authModal = null;

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    authModal = document.getElementById('auth-modal');
    checkAuthState();
    initializeGoogleSignIn();
});

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

// Show/hide different sections based on auth state
function showDashboard() {
    document.getElementById('login-prompt').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'block';
    
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name || 'User';
    }
}

function showLoginPrompt() {
    document.getElementById('login-prompt').style.display = 'block';
    document.getElementById('dashboard-content').style.display = 'none';
}

// Modal functions
function showAuthModal(tab = 'login') {
    authModal.classList.add('active');
    switchTab(tab);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Tab switching
function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.querySelector('.auth-tab:first-child');
    const registerTab = document.querySelector('.auth-tab:last-child');
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        document.getElementById('auth-title').textContent = 'Welcome Back';
    } else {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        document.getElementById('auth-title').textContent = 'Create Account';
    }
}

// Form handlers
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login (replace with actual API call)
    simulateLogin(email, password);
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const termsAccepted = document.getElementById('terms-checkbox').checked;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    // Simulate registration (replace with actual API call)
    simulateRegister(name, email, password);
}

// Simulate authentication (replace with actual API calls)
function simulateLogin(email, password) {
    // Show loading state
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Mock successful login
        const user = {
            id: 'user_' + Date.now(),
            name: email.split('@')[0],
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3a5bbf&color=fff`,
            loginMethod: 'email'
        };
        
        loginSuccess(user);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function simulateRegister(name, email, password) {
    // Show loading state
    const submitBtn = document.querySelector('#register-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Mock successful registration
        const user = {
            id: 'user_' + Date.now(),
            name: name,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3a5bbf&color=fff`,
            loginMethod: 'email'
        };
        
        loginSuccess(user);
        showNotification('Account created successfully! Welcome to progguide.', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Google Sign-In Integration
function initializeGoogleSignIn() {
    // This would be initialized with your actual Google Client ID
    // For demo purposes, we'll create a custom Google sign-in button
    
    // Add click handler to custom Google sign-in buttons
    document.querySelectorAll('.g_id_signin').forEach(button => {
        button.addEventListener('click', () => {
            simulateGoogleLogin();
        });
        
        // Add Google styling
        button.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 16px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            background: #fff;
            color: #3c4043;
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            width: 100%;
            text-decoration: none;
        `;
        
        button.innerHTML = `
            <svg style="margin-right: 8px;" width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-2.7.75 4.8 4.8 0 0 1-4.52-3.26H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.46 10.51a4.8 4.8 0 0 1-.25-1.51c0-.52.09-1.03.25-1.51V5.42H1.83a8 8 0 0 0 0 7.18l2.63-2.09z"/>
                <path fill="#EA4335" d="M8.98 4.74c1.16 0 2.2.4 3.01 1.19l2.26-2.25A8 8 0 0 0 8.98 1a8 8 0 0 0-7.15 4.42l2.63 2.08A4.8 4.8 0 0 1 8.98 4.74z"/>
            </svg>
            ${button.dataset.text === 'signup_with' ? 'Sign up with Google' : 'Sign in with Google'}
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = 'none';
        });
    });
}

function simulateGoogleLogin() {
    // Show loading state
    showNotification('Connecting to Google...', 'info');
    
    // Simulate Google OAuth flow
    setTimeout(() => {
        // Mock successful Google login
        const user = {
            id: 'google_user_' + Date.now(),
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4285f4&color=fff',
            loginMethod: 'google'
        };
        
        loginSuccess(user);
        showNotification('Successfully signed in with Google!', 'success');
    }, 2000);
}

// Handle successful login
function loginSuccess(user) {
    currentUser = user;
    localStorage.setItem('progguide_user', JSON.stringify(user));
    
    // Show success notification
    showNotification(`Welcome ${user.name}!`, 'success');
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('progguide_user');
        showLoginPrompt();
        showNotification('You have been logged out successfully', 'info');
    }
}

// Profile functions
function editProfile() {
    showNotification('Profile editing feature coming soon!', 'info');
}

function showForgotPassword() {
    showNotification('Password reset feature coming soon!', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
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
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === authModal) {
        closeAuthModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && authModal.classList.contains('active')) {
        closeAuthModal();
    }
});

// Export functions for global access
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchTab = switchTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.editProfile = editProfile;
window.showForgotPassword = showForgotPassword;
