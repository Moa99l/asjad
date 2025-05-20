// Auth Tabs Toggle
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and forms
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding form
        tab.classList.add('active');
        const formId = `${tab.dataset.tab}-form`;
        document.getElementById(formId).classList.add('active');
    });
});

// Password Toggle Visibility
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Toggle eye icon
        btn.classList.toggle('fa-eye');
        btn.classList.toggle('fa-eye-slash');
    });
});

// Form Validation
const loginForm = document.querySelector('#login-form form');
const registerForm = document.querySelector('#register-form form');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('#login-email').value.trim();
        const password = this.querySelector('#login-password').value.trim();
        
        // Basic validation
        if (!email || !password) {
            showError('يرجى ملء جميع الحقول المطلوبة');
            return;
        }
        
        // Email validation
        if (!isValidEmail(email)) {
            showError('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        
        // Here you would typically send the login request to your server
        console.log('Login attempt:', { email, password });
        // جلب نوع المستخدم من قاعدة البيانات أو من بيانات الدخول (هنا افتراضياً 'student')
        const userType = 'student'; // يجب استبداله بالقيمة الحقيقية من السيرفر
        localStorage.setItem('userType', userType);
        // توجيه المستخدم حسب نوع الحساب
        if (userType === 'admin') {
            window.location.href = 'dashboard.html';
        } else if (userType === 'student') {
            window.location.href = 'student-dashboard.html';
        } else if (userType === 'instructor') {
            window.location.href = 'dashboard.html'; // أو صفحة خاصة بالمدرب لاحقاً
        } else {
            window.location.href = 'index.html';
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('#register-name').value.trim();
        const email = this.querySelector('#register-email').value.trim();
        const password = this.querySelector('#register-password').value.trim();
        const confirmPassword = this.querySelector('#register-confirm-password').value.trim();
        const userType = this.querySelector('#user-type').value;
        const terms = this.querySelector('input[type="checkbox"]').checked;
        
        // Basic validation
        if (!name || !email || !password || !confirmPassword || !userType) {
            showError('يرجى ملء جميع الحقول المطلوبة');
            return;
        }
        
        // Email validation
        if (!isValidEmail(email)) {
            showError('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        
        // Password validation
        if (password.length < 8) {
            showError('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
            return;
        }
        
        // Password match validation
        if (password !== confirmPassword) {
            showError('كلمات المرور غير متطابقة');
            return;
        }
        
        // Terms validation
        if (!terms) {
            showError('يجب الموافقة على الشروط والأحكام');
            return;
        }
        
        // Here you would typically send the registration request to your server
        console.log('Registration attempt:', { name, email, password, userType });
        // جلب نوع المستخدم من قاعدة البيانات أو من بيانات الدخول (هنا افتراضياً 'student')
        localStorage.setItem('userType', userType);
        // توجيه المستخدم حسب نوع الحساب
        if (userType === 'admin') {
            window.location.href = 'dashboard.html';
        } else if (userType === 'student') {
            window.location.href = 'student-dashboard.html';
        } else if (userType === 'instructor') {
            window.location.href = 'dashboard.html'; // أو صفحة خاصة بالمدرب لاحقاً
        } else {
            window.location.href = 'index.html';
        }
    });
}

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    // Create error element if it doesn't exist
    let errorDiv = document.querySelector('.auth-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        document.querySelector('.auth-container').insertBefore(
            errorDiv,
            document.querySelector('.auth-form')
        );
    }
    
    // Show error message
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Add error styles
    const errorStyle = document.createElement('style');
    errorStyle.textContent = `
        .auth-error {
            background-color: #fee2e2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 500;
            display: none;
        }
    `;
    document.head.appendChild(errorStyle);
    
    // Hide error after 3 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

function showSuccess(message) {
    // Create success element if it doesn't exist
    let successDiv = document.querySelector('.auth-success');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'auth-success';
        document.querySelector('.auth-container').insertBefore(
            successDiv,
            document.querySelector('.auth-form')
        );
    }
    
    // Show success message
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Add success styles
    const successStyle = document.createElement('style');
    successStyle.textContent = `
        .auth-success {
            background-color: #dcfce7;
            color: #16a34a;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 500;
            display: none;
        }
    `;
    document.head.appendChild(successStyle);
    
    // Hide success after 3 seconds and redirect
    setTimeout(() => {
        successDiv.style.display = 'none';
        // Redirect to home page after successful login/register
        window.location.href = 'index.html';
    }, 3000);
}

// Social Login Buttons
const socialButtons = document.querySelectorAll('.btn-social');

socialButtons.forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.classList.contains('btn-google') ? 'Google' : 'Facebook';
        console.log(`Login with ${provider} clicked`);
        // Here you would typically implement social login
        showError('تسجيل الدخول باستخدام ' + provider + ' غير متوفر حالياً');
    });
});

// تفعيل تبويب التسجيل تلقائياً إذا كان الرابط يحتوي على #register
window.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash === '#register') {
        document.querySelector('.auth-tab[data-tab="register"]').click();
    }
}); 