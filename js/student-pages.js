// التحقق من تسجيل الدخول وحماية الصفحات
document.addEventListener('DOMContentLoaded', function() {
    const userType = localStorage.getItem('userType');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    // التحقق من نوع المستخدم وإعادة التوجيه إذا لم يكن طالباً
    if (!userType || userType !== 'student') {
        window.location.href = 'login.html';
        return;
    }

    // تفعيل زر تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userType');
            localStorage.removeItem('userData');
            localStorage.removeItem('userAvatar');
            window.location.href = 'index.html';
        });
    }

    // تحديد الصفحة الحالية وتفعيل الوظائف المناسبة
    const currentPage = window.location.pathname.split('/').pop();
    switch(currentPage) {
        case 'my-courses.html':
            loadMyCourses();
            break;
        case 'certificates.html':
            loadCertificates();
            break;
        case 'profile.html':
            loadProfile();
            break;
        case 'notifications.html':
            loadNotifications();
            break;
    }

    // إضافة زر القائمة للموبايل
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    
    // إنشاء زر القائمة
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    body.appendChild(mobileMenuToggle);

    // تفعيل/إخفاء القائمة عند النقر على الزر
    mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        this.classList.toggle('active');
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // إغلاق القائمة عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // تحسين التفاعلات مع البطاقات
    const cards = document.querySelectorAll('.course-card, .certificate-card, .notification-card');
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        card.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });

    // تحسين التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // تحسين أداء الصور
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    // تحسين أداء النماذج
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
            }
        });
    });

    // تحسين عرض الإشعارات
    const notifications = document.querySelectorAll('.notification-card');
    notifications.forEach(notif => {
        notif.addEventListener('click', function() {
            if (this.classList.contains('unread')) {
                this.classList.remove('unread');
                this.querySelector('.unread-badge')?.remove();
                // هنا يمكن إضافة كود لتحديث حالة الإشعار في الخادم
            }
        });
    });

    // تحسين أداء شريط التقدم
    const progressBars = document.querySelectorAll('.progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const width = progress.style.width;
                progress.style.width = '0';
                setTimeout(() => {
                    progress.style.width = width;
                }, 100);
                observer.unobserve(progress);
            }
        });
    });

    progressBars.forEach(bar => observer.observe(bar));

    // تحسين أداء الصور الشخصية
    const avatarInput = document.getElementById('profileAvatar');
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB
                    alert('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
                    this.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const maxSize = 300;
                        let width = img.width;
                        let height = img.height;
                        if (width > height) {
                            if (width > maxSize) {
                                height *= maxSize / width;
                                width = maxSize;
                            }
                        } else {
                            if (height > maxSize) {
                                width *= maxSize / height;
                                height = maxSize;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
                        document.getElementById('avatarPreview').src = resizedImage;
                        localStorage.setItem('userAvatar', resizedImage);
                    };
                    img.src = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// دالة تحميل الدورات
function loadMyCourses() {
    const coursesList = document.getElementById('coursesList');
    if (!coursesList) return;

    // بيانات تجريبية للدورات (يمكن استبدالها ببيانات حقيقية من الخادم)
    const courses = [
        {
            id: 1,
            title: 'دورة تطوير الويب',
            instructor: 'أحمد محمد',
            progress: 75,
            image: 'images/course1.jpg',
            status: 'جاري'
        },
        {
            id: 2,
            title: 'دورة البرمجة بلغة Python',
            instructor: 'سارة أحمد',
            progress: 100,
            image: 'images/course2.jpg',
            status: 'مكتملة'
        }
    ];

    // عرض الدورات
    coursesList.innerHTML = courses.map(course => `
        <div class="course-card">
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
                <span class="course-status ${course.status === 'مكتملة' ? 'completed' : 'in-progress'}">${course.status}</span>
            </div>
            <div class="course-info">
                <h3>${course.title}</h3>
                <p class="instructor">المدرب: ${course.instructor}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${course.progress}%"></div>
                    <span class="progress-text">${course.progress}%</span>
                </div>
                <a href="course-details.html?id=${course.id}" class="btn btn-primary">متابعة الدورة</a>
            </div>
        </div>
    `).join('');
}

// دالة تحميل الشهادات
function loadCertificates() {
    const certificatesList = document.getElementById('certificatesList');
    if (!certificatesList) return;

    // بيانات تجريبية للشهادات
    const certificates = [
        {
            id: 1,
            title: 'شهادة تطوير الويب',
            date: '2024-03-15',
            image: 'images/certificate1.jpg'
        },
        {
            id: 2,
            title: 'شهادة Python للمبتدئين',
            date: '2024-02-20',
            image: 'images/certificate2.jpg'
        }
    ];

    // عرض الشهادات
    certificatesList.innerHTML = certificates.map(cert => `
        <div class="certificate-card">
            <div class="certificate-image">
                <img src="${cert.image}" alt="${cert.title}">
            </div>
            <div class="certificate-info">
                <h3>${cert.title}</h3>
                <p class="date">تاريخ الإصدار: ${new Date(cert.date).toLocaleDateString('ar-SA')}</p>
                <a href="${cert.image}" class="btn btn-primary" download>تحميل الشهادة</a>
            </div>
        </div>
    `).join('');
}

// دالة تحميل الملف الشخصي
function loadProfile() {
    const profileForm = document.getElementById('profileForm');
    const avatarPreview = document.getElementById('avatarPreview');
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (!profileForm) return;

    // تحميل بيانات المستخدم
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    document.getElementById('profileName').value = userData.name || '';
    document.getElementById('profileEmail').value = userData.email || '';
    document.getElementById('profilePhone').value = userData.phone || '';
    
    // تحميل الصورة الشخصية
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        avatarPreview.src = savedAvatar;
    }

    // تحديث الصورة عند اختيار صورة جديدة
    profileAvatar.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                avatarPreview.src = evt.target.result;
                localStorage.setItem('userAvatar', evt.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // حفظ التعديلات
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const updatedData = {
            name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value
        };
        localStorage.setItem('userData', JSON.stringify(updatedData));
        alert('تم حفظ التعديلات بنجاح');
    });
}

// دالة تحميل الإشعارات
function loadNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    if (!notificationsList) return;

    // بيانات تجريبية للإشعارات
    const notifications = [
        {
            id: 1,
            title: 'دورة جديدة متاحة',
            message: 'تم إضافة دورة جديدة في مجال تطوير الويب',
            date: '2024-03-20',
            isRead: false
        },
        {
            id: 2,
            title: 'تم إصدار شهادتك',
            message: 'تم إصدار شهادة إتمام دورة Python للمبتدئين',
            date: '2024-03-15',
            isRead: true
        }
    ];

    // عرض الإشعارات
    notificationsList.innerHTML = notifications.map(notif => `
        <div class="notification-card ${notif.isRead ? 'read' : 'unread'}">
            <div class="notification-content">
                <h3>${notif.title}</h3>
                <p>${notif.message}</p>
                <span class="date">${new Date(notif.date).toLocaleDateString('ar-SA')}</span>
            </div>
            ${!notif.isRead ? '<span class="unread-badge"></span>' : ''}
        </div>
    `).join('');

    // تحديث حالة الإشعارات عند النقر عليها
    document.querySelectorAll('.notification-card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.add('read');
            this.querySelector('.unread-badge')?.remove();
        });
    });
}

// إضافة الأنماط CSS المطلوبة
const style = document.createElement('style');
style.textContent = `
    .dashboard-container {
        display: flex;
        min-height: 100vh;
    }
    .sidebar {
        width: 250px;
        background: #f8f9fa;
        padding: 20px;
        border-left: 1px solid #dee2e6;
    }
    .sidebar-logo {
        margin-bottom: 20px;
    }
    .sidebar-menu {
        list-style: none;
        padding: 0;
    }
    .sidebar-menu li {
        margin-bottom: 10px;
    }
    .sidebar-menu a {
        display: block;
        padding: 10px;
        color: #333;
        text-decoration: none;
        border-radius: 5px;
    }
    .sidebar-menu li.active a {
        background: #ffc107;
        color: #000;
    }
    .dashboard-main {
        flex: 1;
        padding: 20px;
    }
    .dashboard-title {
        margin-bottom: 20px;
        color: #333;
    }
    .course-card, .certificate-card, .notification-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 20px;
        padding: 15px;
        display: flex;
        gap: 20px;
    }
    .course-image, .certificate-image {
        width: 200px;
        height: 150px;
        overflow: hidden;
        border-radius: 4px;
    }
    .course-image img, .certificate-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .course-status {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
    }
    .course-status.completed {
        background: #28a745;
        color: #fff;
    }
    .course-status.in-progress {
        background: #ffc107;
        color: #000;
    }
    .progress-bar {
        background: #e9ecef;
        height: 10px;
        border-radius: 5px;
        margin: 10px 0;
        position: relative;
    }
    .progress {
        background: #007bff;
        height: 100%;
        border-radius: 5px;
    }
    .progress-text {
        position: absolute;
        right: 5px;
        top: -20px;
        font-size: 12px;
    }
    .profile-section {
        max-width: 600px;
        margin: 0 auto;
    }
    .profile-avatar {
        text-align: center;
        margin-bottom: 20px;
    }
    .profile-form .form-group {
        margin-bottom: 15px;
    }
    .profile-form label {
        display: block;
        margin-bottom: 5px;
    }
    .profile-form input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .notification-card {
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .notification-card:hover {
        background: #f8f9fa;
    }
    .notification-card.unread {
        border-right: 4px solid #007bff;
    }
    .unread-badge {
        width: 10px;
        height: 10px;
        background: #007bff;
        border-radius: 50%;
        margin: auto 0;
    }
    .btn {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 4px;
        text-decoration: none;
        cursor: pointer;
        border: none;
    }
    .btn-primary {
        background: #007bff;
        color: #fff;
    }
    .btn-primary:hover {
        background: #0056b3;
    }
`;
document.head.appendChild(style); 