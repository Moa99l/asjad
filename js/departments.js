// استيراد مدير المزامنة
import syncManager from './sync.js';

class DepartmentManager {
    constructor() {
        this.initializeSync();
        this.initializeUI();
    }

    // تهيئة المزامنة
    initializeSync() {
        syncManager.addListener('departments', this.updateDepartmentsList.bind(this));
        syncManager.addListener('courses', this.updateDepartmentStats.bind(this));
        syncManager.addListener('students', this.updateDepartmentStats.bind(this));
        syncManager.addListener('instructors', this.updateDepartmentStats.bind(this));
    }

    // تهيئة واجهة المستخدم
    initializeUI() {
        // إضافة مستمعي الأحداث للنماذج والأزرار
        this.initializeForms();
        this.initializeFilters();
        this.initializeSearch();
    }

    // تحديث قائمة الأقسام
    updateDepartmentsList(departments) {
        const departmentsGrid = document.querySelector('.departments-grid');
        if (!departmentsGrid) return;

        departmentsGrid.innerHTML = Object.values(departments)
            .filter(dept => !dept.deleted)
            .map(dept => `
                <div class="department-card" data-id="${dept.id}">
                    <div class="department-header">
                        <div class="department-icon">
                            <i class="fas ${this.getDepartmentIcon(dept.type)}"></i>
                        </div>
                        <div class="department-status ${dept.status}">
                            ${this.getStatusText(dept.status)}
                        </div>
                    </div>
                    <div class="department-content">
                        <h3>${dept.name}</h3>
                        <p>${dept.description}</p>
                        <div class="department-stats">
                            <div class="stat-item">
                                <i class="fas fa-book"></i>
                                <span>${dept.coursesCount || 0}</span>
                                <small>الدورات</small>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <span>${dept.studentsCount || 0}</span>
                                <small>الطلاب</small>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-chalkboard-teacher"></i>
                                <span>${dept.instructorsCount || 0}</span>
                                <small>المدربين</small>
                            </div>
                        </div>
                        <div class="department-meta">
                            <span><i class="fas fa-user-tie"></i> ${dept.headName}</span>
                            <span><i class="fas fa-phone"></i> ${dept.contactPhone}</span>
                        </div>
                    </div>
                    <div class="department-actions">
                        <button class="btn btn-primary" onclick="departmentManager.viewDepartment('${dept.id}')">
                            <i class="fas fa-eye"></i> عرض التفاصيل
                        </button>
                        <button class="btn btn-secondary" onclick="departmentManager.editDepartment('${dept.id}')">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button class="btn btn-danger" onclick="departmentManager.deleteDepartment('${dept.id}')">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            `).join('');
    }

    // تحديث إحصائيات القسم
    async updateDepartmentStats(data) {
        const departments = await syncManager.getItems('departments');
        for (const dept of Object.values(departments)) {
            if (dept.deleted) continue;

            const stats = {
                coursesCount: 0,
                studentsCount: 0,
                instructorsCount: 0
            };

            // حساب عدد الدورات
            if (data.courses) {
                stats.coursesCount = Object.values(data.courses)
                    .filter(course => !course.deleted && course.departmentId === dept.id)
                    .length;
            }

            // حساب عدد الطلاب
            if (data.students) {
                stats.studentsCount = Object.values(data.students)
                    .filter(student => !student.deleted && student.departmentId === dept.id)
                    .length;
            }

            // حساب عدد المدربين
            if (data.instructors) {
                stats.instructorsCount = Object.values(data.instructors)
                    .filter(instructor => !instructor.deleted && instructor.departmentId === dept.id)
                    .length;
            }

            // تحديث إحصائيات القسم
            await syncManager.updateItem('departments', dept.id, stats);
        }
    }

    // تهيئة النماذج
    initializeForms() {
        const addDepartmentForm = document.getElementById('addDepartmentForm');
        if (addDepartmentForm) {
            addDepartmentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(addDepartmentForm);
                const departmentData = {
                    name: formData.get('name'),
                    type: formData.get('type'),
                    description: formData.get('description'),
                    headName: formData.get('headName'),
                    contactPhone: formData.get('contactPhone'),
                    email: formData.get('email'),
                    status: formData.get('status'),
                    location: formData.get('location'),
                    workingHours: formData.get('workingHours')
                };

                try {
                    await syncManager.addItem('departments', departmentData);
                    addDepartmentForm.reset();
                    document.getElementById('addDepartmentModal').classList.remove('show');
                    this.showNotification('تم إضافة القسم بنجاح', 'success');
                } catch (error) {
                    console.error('خطأ في إضافة القسم:', error);
                    this.showNotification('حدث خطأ أثناء إضافة القسم', 'error');
                }
            });
        }
    }

    // تهيئة الفلاتر
    initializeFilters() {
        const filterForm = document.getElementById('departmentFilterForm');
        if (filterForm) {
            filterForm.addEventListener('change', async (e) => {
                const formData = new FormData(filterForm);
                const filters = {
                    type: formData.get('type'),
                    status: formData.get('status')
                };

                try {
                    const departments = await syncManager.getFilteredDepartments(filters);
                    this.updateDepartmentsList(departments);
                } catch (error) {
                    console.error('خطأ في تطبيق الفلاتر:', error);
                    this.showNotification('حدث خطأ أثناء تطبيق الفلاتر', 'error');
                }
            });
        }
    }

    // تهيئة البحث
    initializeSearch() {
        const searchInput = document.getElementById('departmentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', async (e) => {
                const searchTerm = e.target.value.trim();
                if (searchTerm.length < 2) return;

                try {
                    const departments = await syncManager.searchDepartments(searchTerm);
                    this.updateDepartmentsList(departments);
                } catch (error) {
                    console.error('خطأ في البحث:', error);
                    this.showNotification('حدث خطأ أثناء البحث', 'error');
                }
            });
        }
    }

    // عرض تفاصيل القسم
    async viewDepartment(departmentId) {
        try {
            const department = await syncManager.getItem('departments', departmentId);
            if (!department) throw new Error('القسم غير موجود');

            const modal = document.createElement('div');
            modal.className = 'modal show';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${department.name}</h2>
                        <button class="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="department-details">
                            <div class="detail-item">
                                <i class="fas fa-info-circle"></i>
                                <span>${department.description}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-user-tie"></i>
                                <span>رئيس القسم: ${department.headName}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-phone"></i>
                                <span>رقم الاتصال: ${department.contactPhone}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-envelope"></i>
                                <span>البريد الإلكتروني: ${department.email}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>الموقع: ${department.location}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>ساعات العمل: ${department.workingHours}</span>
                            </div>
                        </div>
                        <div class="department-stats-grid">
                            <div class="stat-card">
                                <i class="fas fa-book"></i>
                                <h3>${department.coursesCount || 0}</h3>
                                <p>الدورات</p>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-users"></i>
                                <h3>${department.studentsCount || 0}</h3>
                                <p>الطلاب</p>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-chalkboard-teacher"></i>
                                <h3>${department.instructorsCount || 0}</h3>
                                <p>المدربين</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary close-modal">إغلاق</button>
                        <button class="btn btn-primary" onclick="departmentManager.editDepartment('${department.id}')">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // إضافة وظائف الإغلاق
            const closeModal = () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            };

            modal.querySelectorAll('.close-modal').forEach(button => {
                button.addEventListener('click', closeModal);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
            });
        } catch (error) {
            console.error('خطأ في عرض تفاصيل القسم:', error);
            this.showNotification('حدث خطأ أثناء عرض تفاصيل القسم', 'error');
        }
    }

    // تعديل القسم
    async editDepartment(departmentId) {
        try {
            const department = await syncManager.getItem('departments', departmentId);
            if (!department) throw new Error('القسم غير موجود');

            const modal = document.createElement('div');
            modal.className = 'modal show';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>تعديل القسم</h2>
                        <button class="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="editDepartmentForm" class="modal-body">
                        <div class="form-group">
                            <label for="editName">اسم القسم</label>
                            <input type="text" id="editName" name="name" value="${department.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editType">نوع القسم</label>
                            <select id="editType" name="type" required>
                                <option value="technical" ${department.type === 'technical' ? 'selected' : ''}>تقني</option>
                                <option value="administrative" ${department.type === 'administrative' ? 'selected' : ''}>إداري</option>
                                <option value="academic" ${department.type === 'academic' ? 'selected' : ''}>أكاديمي</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editDescription">الوصف</label>
                            <textarea id="editDescription" name="description" rows="4" required>${department.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="editHeadName">رئيس القسم</label>
                            <input type="text" id="editHeadName" name="headName" value="${department.headName}" required>
                        </div>
                        <div class="form-group">
                            <label for="editContactPhone">رقم الاتصال</label>
                            <input type="tel" id="editContactPhone" name="contactPhone" value="${department.contactPhone}" required>
                        </div>
                        <div class="form-group">
                            <label for="editEmail">البريد الإلكتروني</label>
                            <input type="email" id="editEmail" name="email" value="${department.email}" required>
                        </div>
                        <div class="form-group">
                            <label for="editLocation">الموقع</label>
                            <input type="text" id="editLocation" name="location" value="${department.location}" required>
                        </div>
                        <div class="form-group">
                            <label for="editWorkingHours">ساعات العمل</label>
                            <input type="text" id="editWorkingHours" name="workingHours" value="${department.workingHours}" required>
                        </div>
                        <div class="form-group">
                            <label for="editStatus">الحالة</label>
                            <select id="editStatus" name="status" required>
                                <option value="active" ${department.status === 'active' ? 'selected' : ''}>نشط</option>
                                <option value="inactive" ${department.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                                <option value="maintenance" ${department.status === 'maintenance' ? 'selected' : ''}>صيانة</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary close-modal">إلغاء</button>
                            <button type="submit" class="btn btn-primary">حفظ التغييرات</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // معالجة تحديث القسم
            const form = modal.querySelector('#editDepartmentForm');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const updatedData = {
                    name: formData.get('name'),
                    type: formData.get('type'),
                    description: formData.get('description'),
                    headName: formData.get('headName'),
                    contactPhone: formData.get('contactPhone'),
                    email: formData.get('email'),
                    location: formData.get('location'),
                    workingHours: formData.get('workingHours'),
                    status: formData.get('status')
                };

                try {
                    await syncManager.updateItem('departments', departmentId, updatedData);
                    modal.remove();
                    this.showNotification('تم تحديث القسم بنجاح', 'success');
                } catch (error) {
                    console.error('خطأ في تحديث القسم:', error);
                    this.showNotification('حدث خطأ أثناء تحديث القسم', 'error');
                }
            });

            // إضافة وظائف الإغلاق
            const closeModal = () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            };

            modal.querySelectorAll('.close-modal').forEach(button => {
                button.addEventListener('click', closeModal);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
            });
        } catch (error) {
            console.error('خطأ في تعديل القسم:', error);
            this.showNotification('حدث خطأ أثناء تعديل القسم', 'error');
        }
    }

    // حذف القسم
    async deleteDepartment(departmentId) {
        if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;

        try {
            await syncManager.deleteItem('departments', departmentId);
            this.showNotification('تم حذف القسم بنجاح', 'success');
        } catch (error) {
            console.error('خطأ في حذف القسم:', error);
            this.showNotification('حدث خطأ أثناء حذف القسم', 'error');
        }
    }

    // الحصول على أيقونة القسم
    getDepartmentIcon(type) {
        const icons = {
            technical: 'fa-laptop-code',
            administrative: 'fa-briefcase',
            academic: 'fa-graduation-cap'
        };
        return icons[type] || 'fa-building';
    }

    // الحصول على نص الحالة
    getStatusText(status) {
        const statusTexts = {
            active: 'نشط',
            inactive: 'غير نشط',
            maintenance: 'صيانة'
        };
        return statusTexts[status] || status;
    }

    // عرض إشعار
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // الحصول على أيقونة الإشعار
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// إنشاء نسخة عالمية من مدير الأقسام
window.departmentManager = new DepartmentManager();

// تصدير المدير للاستخدام في الملفات الأخرى
export default window.departmentManager; 