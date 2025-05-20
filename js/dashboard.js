// Sidebar Toggle
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 992) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Active Menu Item
const menuItems = document.querySelectorAll('.sidebar-nav a');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        menuItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
    });
});

// User Menu Dropdown
const userMenu = document.querySelector('.user-menu');
const dropdownMenu = document.querySelector('.dropdown-menu');

if (userMenu && dropdownMenu) {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    });

    // Toggle dropdown on user menu click
    userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
}

// Notification and Messages Dropdowns
const notificationBtn = document.querySelector('.notification-btn');
const messagesBtn = document.querySelector('.messages-btn');

// Create notification dropdown
const notificationDropdown = document.createElement('div');
notificationDropdown.className = 'dropdown-menu notification-dropdown';
notificationDropdown.innerHTML = `
    <div class="dropdown-header">
        <h3>الإشعارات</h3>
        <button class="btn btn-link">تعيين الكل كمقروء</button>
    </div>
    <div class="dropdown-content">
        <div class="notification-item unread">
            <div class="notification-icon">
                <i class="fas fa-user-plus"></i>
            </div>
            <div class="notification-details">
                <p>تم تسجيل طالب جديد في دورة تطوير الويب</p>
                <span class="notification-time">منذ 5 دقائق</span>
            </div>
        </div>
        <div class="notification-item unread">
            <div class="notification-icon">
                <i class="fas fa-comment"></i>
            </div>
            <div class="notification-details">
                <p>تم إضافة تعليق جديد على دورة التسويق الرقمي</p>
                <span class="notification-time">منذ 15 دقيقة</span>
            </div>
        </div>
        <div class="notification-item">
            <div class="notification-icon">
                <i class="fas fa-star"></i>
            </div>
            <div class="notification-details">
                <p>تم تقييم دورة البرمجة بلغة Python</p>
                <span class="notification-time">منذ ساعة</span>
            </div>
        </div>
    </div>
    <div class="dropdown-footer">
        <a href="#notifications" class="btn btn-link">عرض جميع الإشعارات</a>
    </div>
`;

// Create messages dropdown
const messagesDropdown = document.createElement('div');
messagesDropdown.className = 'dropdown-menu messages-dropdown';
messagesDropdown.innerHTML = `
    <div class="dropdown-header">
        <h3>الرسائل</h3>
        <button class="btn btn-link">تعيين الكل كمقروء</button>
    </div>
    <div class="dropdown-content">
        <div class="message-item unread">
            <img src="images/avatar-placeholder.png" alt="صورة المرسل">
            <div class="message-details">
                <div class="message-header">
                    <h4>أحمد محمد</h4>
                    <span class="message-time">منذ 5 دقائق</span>
                </div>
                <p>مرحباً، هل يمكنني معرفة موعد بدء دورة تطوير الويب؟</p>
            </div>
        </div>
        <div class="message-item unread">
            <img src="images/avatar-placeholder.png" alt="صورة المرسل">
            <div class="message-details">
                <div class="message-header">
                    <h4>سارة أحمد</h4>
                    <span class="message-time">منذ 15 دقيقة</span>
                </div>
                <p>شكراً جزيلاً على الدورة الممتازة!</p>
            </div>
        </div>
        <div class="message-item">
            <img src="images/avatar-placeholder.png" alt="صورة المرسل">
            <div class="message-details">
                <div class="message-header">
                    <h4>محمد علي</h4>
                    <span class="message-time">منذ ساعة</span>
                </div>
                <p>هل يمكنني الحصول على نسخة من العرض التقديمي؟</p>
            </div>
        </div>
    </div>
    <div class="dropdown-footer">
        <a href="#messages" class="btn btn-link">عرض جميع الرسائل</a>
    </div>
`;

// Add dropdowns to the document
if (notificationBtn) {
    notificationBtn.parentNode.insertBefore(notificationDropdown, notificationBtn.nextSibling);
}

if (messagesBtn) {
    messagesBtn.parentNode.insertBefore(messagesDropdown, messagesBtn.nextSibling);
}

// Toggle notification dropdown
if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
        messagesDropdown.style.display = 'none';
    });
}

// Toggle messages dropdown
if (messagesBtn) {
    messagesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        messagesDropdown.style.display = messagesDropdown.style.display === 'block' ? 'none' : 'block';
        notificationDropdown.style.display = 'none';
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    if (notificationDropdown) {
        notificationDropdown.style.display = 'none';
    }
    if (messagesDropdown) {
        messagesDropdown.style.display = 'none';
    }
});

// Add styles for dropdowns
const dropdownStyles = document.createElement('style');
dropdownStyles.textContent = `
    .notification-dropdown,
    .messages-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        width: 320px;
        background-color: var(--white);
        border: 1px solid #eee;
        border-radius: 5px;
        box-shadow: var(--shadow);
        display: none;
        z-index: 1000;
    }

    .dropdown-header {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .dropdown-header h3 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
    }

    .dropdown-content {
        max-height: 300px;
        overflow-y: auto;
    }

    .notification-item,
    .message-item {
        padding: 1rem;
        display: flex;
        gap: 1rem;
        border-bottom: 1px solid #eee;
        transition: var(--transition);
    }

    .notification-item:hover,
    .message-item:hover {
        background-color: #f8f9fa;
    }

    .notification-item.unread,
    .message-item.unread {
        background-color: #f0f9ff;
    }

    .notification-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #f8f9fa;
        color: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
    }

    .notification-details,
    .message-details {
        flex: 1;
    }

    .notification-details p,
    .message-details p {
        margin: 0 0 0.25rem;
        font-size: 0.875rem;
    }

    .notification-time,
    .message-time {
        font-size: 0.75rem;
        color: #666;
    }

    .message-item img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }

    .message-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.25rem;
    }

    .message-header h4 {
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0;
    }

    .dropdown-footer {
        padding: 1rem;
        border-top: 1px solid #eee;
        text-align: center;
    }

    .dropdown-footer .btn-link {
        width: 100%;
        text-align: center;
    }
`;

document.head.appendChild(dropdownStyles);

// Search Functionality
const searchInput = document.querySelector('.search-box input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        // Here you would typically implement the search functionality
        console.log('Searching for:', searchTerm);
    });
}

// Stats Animation
const statNumbers = document.querySelectorAll('.stat-number');

const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Animate stats when they come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const value = parseInt(element.textContent.replace(/,/g, ''));
            animateValue(element, 0, value, 1000);
            observer.unobserve(element);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => observer.observe(stat)); 