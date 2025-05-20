// نظام المزامنة المركزي
class SyncManager {
    constructor() {
        this.events = {};
        this.students = {};
        this.courses = {};
        this.materials = {};
        this.attendance = {};
        this.reviews = {};
        this.syncInterval = 30000; // 30 ثانية
        this.initializeSync();
    }

    // تهيئة المزامنة
    initializeSync() {
        // بدء المزامنة التلقائية
        setInterval(() => this.syncAll(), this.syncInterval);
        
        // إضافة مستمع لتغييرات التخزين المحلي
        window.addEventListener('storage', (e) => this.handleStorageChange(e));
        
        // إضافة مستمع لتغييرات الاتصال بالإنترنت
        window.addEventListener('online', () => this.handleConnectionChange(true));
        window.addEventListener('offline', () => this.handleConnectionChange(false));
        
        // تحميل البيانات المحلية
        this.loadLocalData();
    }

    // تحميل البيانات المحلية
    loadLocalData() {
        try {
            const localData = localStorage.getItem('trainingCenterData');
            if (localData) {
                const data = JSON.parse(localData);
                this.events = data.events || {};
                this.students = data.students || {};
                this.courses = data.courses || {};
                this.materials = data.materials || {};
                this.attendance = data.attendance || {};
                this.reviews = data.reviews || {};
            }
        } catch (error) {
            console.error('خطأ في تحميل البيانات المحلية:', error);
        }
    }

    // حفظ البيانات محلياً
    saveLocalData() {
        try {
            const data = {
                events: this.events,
                students: this.students,
                courses: this.courses,
                materials: this.materials,
                attendance: this.attendance,
                reviews: this.reviews
            };
            localStorage.setItem('trainingCenterData', JSON.stringify(data));
        } catch (error) {
            console.error('خطأ في حفظ البيانات المحلية:', error);
        }
    }

    // مزامنة جميع البيانات
    async syncAll() {
        if (!navigator.onLine) {
            this.showNotification('لا يوجد اتصال بالإنترنت. سيتم حفظ البيانات محلياً', 'warning');
            return;
        }

        try {
            // مزامنة الدورات
            await this.syncCourses();
            // مزامنة الطلاب
            await this.syncStudents();
            // مزامنة الأحداث
            await this.syncEvents();
            // مزامنة المواد التعليمية
            await this.syncMaterials();
            // مزامنة الحضور
            await this.syncAttendance();
            // مزامنة التقييمات
            await this.syncReviews();

            this.showNotification('تمت المزامنة بنجاح', 'success');
        } catch (error) {
            console.error('خطأ في المزامنة:', error);
            this.showNotification('حدث خطأ أثناء المزامنة', 'error');
        }
    }

    // مزامنة الدورات
    async syncCourses() {
        try {
            const response = await fetch('/api/courses');
            const courses = await response.json();
            this.courses = courses;
            this.notifyListeners('courses', courses);
        } catch (error) {
            console.error('خطأ في مزامنة الدورات:', error);
            throw error;
        }
    }

    // مزامنة الطلاب
    async syncStudents() {
        try {
            const response = await fetch('/api/students');
            const students = await response.json();
            this.students = students;
            this.notifyListeners('students', students);
        } catch (error) {
            console.error('خطأ في مزامنة الطلاب:', error);
            throw error;
        }
    }

    // مزامنة الأحداث
    async syncEvents() {
        try {
            const response = await fetch('/api/events');
            const events = await response.json();
            this.events = events;
            this.notifyListeners('events', events);
        } catch (error) {
            console.error('خطأ في مزامنة الأحداث:', error);
            throw error;
        }
    }

    // مزامنة المواد التعليمية
    async syncMaterials() {
        try {
            const response = await fetch('/api/materials');
            const materials = await response.json();
            this.materials = materials;
            this.notifyListeners('materials', materials);
        } catch (error) {
            console.error('خطأ في مزامنة المواد التعليمية:', error);
            throw error;
        }
    }

    // مزامنة الحضور
    async syncAttendance() {
        try {
            const response = await fetch('/api/attendance');
            const attendance = await response.json();
            this.attendance = attendance;
            this.notifyListeners('attendance', attendance);
        } catch (error) {
            console.error('خطأ في مزامنة الحضور:', error);
            throw error;
        }
    }

    // مزامنة التقييمات
    async syncReviews() {
        try {
            const response = await fetch('/api/reviews');
            const reviews = await response.json();
            this.reviews = reviews;
            this.notifyListeners('reviews', reviews);
        } catch (error) {
            console.error('خطأ في مزامنة التقييمات:', error);
            throw error;
        }
    }

    // إضافة مستمع للتغييرات
    addListener(type, callback) {
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].push(callback);
    }

    // إزالة مستمع
    removeListener(type, callback) {
        if (this.events[type]) {
            this.events[type] = this.events[type].filter(cb => cb !== callback);
        }
    }

    // إشعار المستمعين بالتغييرات
    notifyListeners(type, data) {
        if (this.events[type]) {
            this.events[type].forEach(callback => callback(data));
        }
    }

    // معالجة تغييرات التخزين المحلي
    handleStorageChange(event) {
        if (event.key === 'trainingCenterData') {
            this.loadLocalData();
            this.notifyListeners('storage', JSON.parse(event.newValue));
        }
    }

    // معالجة تغييرات الاتصال
    handleConnectionChange(isOnline) {
        if (isOnline) {
            this.syncAll();
            this.showNotification('تم استعادة الاتصال بالإنترنت. جاري المزامنة...', 'info');
        } else {
            this.showNotification('تم فقد الاتصال بالإنترنت. سيتم حفظ البيانات محلياً', 'warning');
        }
    }

    // إضافة عنصر جديد
    async addItem(type, data) {
        try {
            const response = await fetch(`/api/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`خطأ في إضافة ${type}`);
            }

            const newItem = await response.json();
            this[type][newItem.id] = newItem;
            this.saveLocalData();
            this.notifyListeners(type, this[type]);
            return newItem;
        } catch (error) {
            console.error(`خطأ في إضافة ${type}:`, error);
            // حفظ محلياً في حالة عدم وجود اتصال
            if (!navigator.onLine) {
                const tempId = Date.now().toString();
                this[type][tempId] = { ...data, id: tempId, synced: false };
                this.saveLocalData();
                this.notifyListeners(type, this[type]);
                return this[type][tempId];
            }
            throw error;
        }
    }

    // تحديث عنصر
    async updateItem(type, id, data) {
        try {
            const response = await fetch(`/api/${type}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`خطأ في تحديث ${type}`);
            }

            const updatedItem = await response.json();
            this[type][id] = updatedItem;
            this.saveLocalData();
            this.notifyListeners(type, this[type]);
            return updatedItem;
        } catch (error) {
            console.error(`خطأ في تحديث ${type}:`, error);
            // تحديث محلياً في حالة عدم وجود اتصال
            if (!navigator.onLine) {
                this[type][id] = { ...this[type][id], ...data, synced: false };
                this.saveLocalData();
                this.notifyListeners(type, this[type]);
                return this[type][id];
            }
            throw error;
        }
    }

    // حذف عنصر
    async deleteItem(type, id) {
        try {
            const response = await fetch(`/api/${type}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`خطأ في حذف ${type}`);
            }

            delete this[type][id];
            this.saveLocalData();
            this.notifyListeners(type, this[type]);
        } catch (error) {
            console.error(`خطأ في حذف ${type}:`, error);
            // حذف محلياً في حالة عدم وجود اتصال
            if (!navigator.onLine) {
                this[type][id].deleted = true;
                this.saveLocalData();
                this.notifyListeners(type, this[type]);
            } else {
                throw error;
            }
        }
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

// إنشاء نسخة عالمية من مدير المزامنة
window.syncManager = new SyncManager();

// تصدير المدير للاستخدام في الملفات الأخرى
export default window.syncManager; 