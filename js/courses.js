// استيراد مدير المزامنة
import syncManager from './sync.js';

// Modal Functionality
const addCourseBtn = document.getElementById('addCourseBtn');
const addCourseModal = document.getElementById('addCourseModal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelAddCourseBtn = document.getElementById('cancelAddCourse');
const addCourseForm = document.getElementById('addCourseForm');

// Show Modal
if (addCourseBtn) {
    addCourseBtn.addEventListener('click', () => {
        addCourseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close Modal Functions
function closeModal() {
    addCourseModal.classList.remove('active');
    document.body.style.overflow = '';
    addCourseForm.reset();
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

if (cancelAddCourseBtn) {
    cancelAddCourseBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside
addCourseModal.addEventListener('click', (e) => {
    if (e.target === addCourseModal) {
        closeModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addCourseModal.classList.contains('active')) {
        closeModal();
    }
});

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // إضافة مستمعي المزامنة
    syncManager.addListener('courses', updateCoursesList);
    syncManager.addListener('students', updateStudentsCount);
    syncManager.addListener('materials', updateMaterialsCount);
    syncManager.addListener('reviews', updateReviewsStats);

    // تهيئة النماذج والأزرار
    initializeForms();
    initializeFilters();
    initializeSearch();
});

// تحديث قائمة الدورات
function updateCoursesList(courses) {
    const coursesGrid = document.querySelector('.courses-grid');
    if (!coursesGrid) return;

    coursesGrid.innerHTML = Object.values(courses)
        .filter(course => !course.deleted)
        .map(course => `
            <div class="course-card" data-id="${course.id}">
                <div class="course-image">
                    <img src="${course.image || 'images/default-course.jpg'}" alt="${course.title}">
                    <span class="course-status ${course.status}">${getStatusText(course.status)}</span>
                </div>
                <div class="course-content">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span><i class="fas fa-users"></i> ${course.studentsCount} طالب</span>
                        <span><i class="fas fa-book"></i> ${course.materialsCount} مادة</span>
                        <span><i class="fas fa-star"></i> ${course.rating.toFixed(1)}</span>
                    </div>
                    <div class="course-actions">
                        <button class="btn btn-primary" data-action="view" onclick="viewCourse('${course.id}')">
                            <i class="fas fa-eye"></i> عرض التفاصيل
                        </button>
                        <button class="btn btn-secondary" data-action="edit" onclick="editCourse('${course.id}')">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button class="btn btn-danger" data-action="delete" onclick="deleteCourse('${course.id}')">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
}

// تحديث عدد الطلاب
function updateStudentsCount(students) {
    const studentsCount = document.querySelector('.students-count');
    if (studentsCount) {
        const activeStudents = Object.values(students).filter(student => !student.deleted && student.status === 'active').length;
        studentsCount.textContent = activeStudents;
    }
}

// تحديث عدد المواد التعليمية
function updateMaterialsCount(materials) {
    const materialsCount = document.querySelector('.materials-count');
    if (materialsCount) {
        const activeMaterials = Object.values(materials).filter(material => !material.deleted).length;
        materialsCount.textContent = activeMaterials;
    }
}

// تحديث إحصائيات التقييمات
function updateReviewsStats(reviews) {
    const reviewsStats = document.querySelector('.reviews-stats');
    if (reviewsStats) {
        const activeReviews = Object.values(reviews).filter(review => !review.deleted);
        const averageRating = activeReviews.reduce((sum, review) => sum + review.rating, 0) / activeReviews.length || 0;
        const totalReviews = activeReviews.length;

        reviewsStats.innerHTML = `
            <div class="stat-item">
                <i class="fas fa-star"></i>
                <span>${averageRating.toFixed(1)}</span>
                <small>متوسط التقييم</small>
            </div>
            <div class="stat-item">
                <i class="fas fa-comments"></i>
                <span>${totalReviews}</span>
                <small>عدد التقييمات</small>
            </div>
        `;
    }
}

// تهيئة النماذج
function initializeForms() {
    const addCourseForm = document.getElementById('addCourseForm');
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(addCourseForm);
            const courseData = {
                title: formData.get('title'),
                category: formData.get('category'),
                description: formData.get('description'),
                startDate: formData.get('startDate'),
                duration: formData.get('duration'),
                status: formData.get('status'),
                image: formData.get('image')
            };

            try {
                await syncManager.addItem('courses', courseData);
                addCourseForm.reset();
                document.getElementById('addCourseModal').classList.remove('show');
                showNotification('تم إضافة الدورة بنجاح', 'success');
            } catch (error) {
                console.error('خطأ في إضافة الدورة:', error);
                showNotification('حدث خطأ أثناء إضافة الدورة', 'error');
            }
        });
    }
}

// تهيئة الفلاتر
function initializeFilters() {
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('change', async (e) => {
            const formData = new FormData(filterForm);
            const filters = {
                category: formData.get('category'),
                status: formData.get('status'),
                dateRange: formData.get('dateRange')
            };

            try {
                const courses = await syncManager.getFilteredCourses(filters);
                updateCoursesList(courses);
            } catch (error) {
                console.error('خطأ في تطبيق الفلاتر:', error);
                showNotification('حدث خطأ أثناء تطبيق الفلاتر', 'error');
            }
        });
    }
}

// تهيئة البحث
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', async (e) => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length < 2) return;

            try {
                const courses = await syncManager.searchCourses(searchTerm);
                updateCoursesList(courses);
            } catch (error) {
                console.error('خطأ في البحث:', error);
                showNotification('حدث خطأ أثناء البحث', 'error');
            }
        });
    }
}

// عرض تفاصيل الدورة
function viewCourse(courseId) {
    window.location.href = `course-details.html?id=${courseId}`;
}

// تعديل الدورة
async function editCourse(courseId) {
    try {
        const course = await syncManager.getItem('courses', courseId);
        if (!course) throw new Error('الدورة غير موجودة');

        const modal = document.getElementById('editCourseModal');
        if (!modal) return;

        // تعبئة النموذج ببيانات الدورة
        const form = modal.querySelector('form');
        form.title.value = course.title;
        form.category.value = course.category;
        form.description.value = course.description;
        form.startDate.value = course.startDate;
        form.duration.value = course.duration;
        form.status.value = course.status;

        // عرض النافذة المنبثقة
        modal.classList.add('show');

        // معالجة تحديث الدورة
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const updatedData = {
                title: formData.get('title'),
                category: formData.get('category'),
                description: formData.get('description'),
                startDate: formData.get('startDate'),
                duration: formData.get('duration'),
                status: formData.get('status')
            };

            try {
                await syncManager.updateItem('courses', courseId, updatedData);
                modal.classList.remove('show');
                showNotification('تم تحديث الدورة بنجاح', 'success');
            } catch (error) {
                console.error('خطأ في تحديث الدورة:', error);
                showNotification('حدث خطأ أثناء تحديث الدورة', 'error');
            }
        });
    } catch (error) {
        console.error('خطأ في تحميل بيانات الدورة:', error);
        showNotification('حدث خطأ أثناء تحميل بيانات الدورة', 'error');
    }
}

// حذف الدورة
async function deleteCourse(courseId) {
    if (!confirm('هل أنت متأكد من حذف هذه الدورة؟')) return;

    try {
        await syncManager.deleteItem('courses', courseId);
        showNotification('تم حذف الدورة بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في حذف الدورة:', error);
        showNotification('حدث خطأ أثناء حذف الدورة', 'error');
    }
}

// دالة مساعدة للحصول على نص الحالة
function getStatusText(status) {
    const statusTexts = {
        active: 'نشط',
        upcoming: 'قادم',
        completed: 'مكتمل',
        cancelled: 'ملغي'
    };
    return statusTexts[status] || status;
}

// دالة مساعدة لعرض الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// دالة مساعدة للحصول على أيقونة الإشعار
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Course Filters
const filterSelects = document.querySelectorAll('.filter-select');

filterSelects.forEach(select => {
    select.addEventListener('change', () => {
        // Here you would typically filter the courses based on the selected values
        const statusFilter = document.querySelector('select[value="status"]').value;
        const categoryFilter = document.querySelector('select[value="category"]').value;
        
        console.log('Filters:', { status: statusFilter, category: categoryFilter });
        
        // For now, we'll just show a notification
        showNotification('تم تطبيق الفلتر', 'info');
    });
});

// Course Actions
const courseCards = document.querySelectorAll('.course-card');

courseCards.forEach(card => {
    const editBtn = card.querySelector('.btn-primary');
    const viewBtn = card.querySelector('.btn-secondary');
    const deleteBtn = card.querySelector('.btn-danger');

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            // Here you would typically open an edit modal
            console.log('Edit course:', card.querySelector('h3').textContent);
            showNotification('سيتم فتح نافذة التعديل قريباً', 'info');
        });
    }

    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            // Here you would typically navigate to the course details page
            console.log('View course:', card.querySelector('h3').textContent);
            showNotification('سيتم فتح صفحة تفاصيل الدورة قريباً', 'info');
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
                // Here you would typically send a delete request to your backend
                console.log('Delete course:', card.querySelector('h3').textContent);
                showNotification('تم حذف الدورة بنجاح', 'success');
                card.remove();
            }
        });
    }
});

// Search Functionality
const searchInput = document.querySelector('.search-box input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        
        // Here you would typically filter the courses based on the search term
        console.log('Searching for:', searchTerm);
        
        // For demonstration, we'll just highlight matching courses
        courseCards.forEach(card => {
            const courseName = card.querySelector('h3').textContent.toLowerCase();
            const courseDescription = card.querySelector('.course-description').textContent.toLowerCase();
            
            if (courseName.includes(searchTerm) || courseDescription.includes(searchTerm)) {
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0.5';
            }
        });
    });
}

// Pagination
const pageButtons = document.querySelectorAll('.page-numbers button');
const prevButton = document.querySelector('.pagination .btn-secondary:first-child');
const nextButton = document.querySelector('.pagination .btn-secondary:last-child');

pageButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        pageButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Here you would typically load the corresponding page of courses
        console.log('Loading page:', button.textContent);
        showNotification(`جاري تحميل الصفحة ${button.textContent}`, 'info');
    });
});

if (prevButton) {
    prevButton.addEventListener('click', () => {
        const activePage = document.querySelector('.page-numbers button.active');
        const prevPage = activePage.previousElementSibling;
        
        if (prevPage && !prevPage.classList.contains('btn-secondary')) {
            prevPage.click();
        }
    });
}

if (nextButton) {
    nextButton.addEventListener('click', () => {
        const activePage = document.querySelector('.page-numbers button.active');
        const nextPage = activePage.nextElementSibling;
        
        if (nextPage && !nextPage.classList.contains('btn-secondary')) {
            nextPage.click();
        }
    });
}

// Image Preview
const courseImageInput = document.getElementById('courseImage');
const imagePreview = document.createElement('div');
imagePreview.className = 'image-preview';
imagePreview.style.display = 'none';

if (courseImageInput) {
    courseImageInput.parentElement.appendChild(imagePreview);

    courseImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `
                    <img src="${e.target.result}" alt="معاينة الصورة">
                    <button type="button" class="remove-image">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                imagePreview.style.display = 'block';

                // Add remove image functionality
                const removeBtn = imagePreview.querySelector('.remove-image');
                removeBtn.addEventListener('click', () => {
                    courseImageInput.value = '';
                    imagePreview.style.display = 'none';
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Add styles for image preview
    const imagePreviewStyle = document.createElement('style');
    imagePreviewStyle.textContent = `
        .image-preview {
            margin-top: 1rem;
            position: relative;
            width: 100%;
            max-width: 300px;
        }

        .image-preview img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 5px;
        }

        .remove-image {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background-color: rgba(0, 0, 0, 0.5);
            border: none;
            color: var(--white);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
        }

        .remove-image:hover {
            background-color: #dc2626;
        }
    `;
    document.head.appendChild(imagePreviewStyle);
} 