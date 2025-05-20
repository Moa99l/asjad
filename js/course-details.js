// استيراد مدير المزامنة
import syncManager from './sync.js';

// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to clicked button and corresponding pane
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Material Modal
const addMaterialBtn = document.getElementById('addMaterialBtn');
const materialModal = document.getElementById('materialModal');
const closeMaterialModal = document.getElementById('closeMaterialModal');
const materialForm = document.getElementById('materialForm');

if (addMaterialBtn && materialModal) {
    addMaterialBtn.addEventListener('click', () => {
        materialModal.classList.add('show');
    });

    closeMaterialModal.addEventListener('click', () => {
        materialModal.classList.remove('show');
    });

    // Close modal when clicking outside
    materialModal.addEventListener('click', (e) => {
        if (e.target === materialModal) {
            materialModal.classList.remove('show');
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && materialModal.classList.contains('show')) {
            materialModal.classList.remove('show');
        }
    });
}

// Material Form Submission
if (materialForm) {
    materialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(materialForm);
        const materialData = {
            title: formData.get('title'),
            type: formData.get('type'),
            description: formData.get('description'),
            files: formData.getAll('files')
        };

        // Here you would typically send the data to your backend
        console.log('Material Data:', materialData);

        // Show success message
        showNotification('تم إضافة المادة التعليمية بنجاح', 'success');
        
        // Close modal and reset form
        materialModal.classList.remove('show');
        materialForm.reset();
    });
}

// Student Modal
const addStudentBtn = document.getElementById('addStudentBtn');
const studentModal = document.getElementById('studentModal');
const closeStudentModal = document.getElementById('closeStudentModal');
const studentForm = document.getElementById('studentForm');

if (addStudentBtn && studentModal) {
    addStudentBtn.addEventListener('click', () => {
        studentModal.classList.add('show');
    });

    closeStudentModal.addEventListener('click', () => {
        studentModal.classList.remove('show');
    });

    // Close modal when clicking outside
    studentModal.addEventListener('click', (e) => {
        if (e.target === studentModal) {
            studentModal.classList.remove('show');
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && studentModal.classList.contains('show')) {
            studentModal.classList.remove('show');
        }
    });
}

// Student Form Submission
if (studentForm) {
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(studentForm);
        const studentData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        };

        // Here you would typically send the data to your backend
        console.log('Student Data:', studentData);

        // Show success message
        showNotification('تم إضافة الطالب بنجاح', 'success');
        
        // Close modal and reset form
        studentModal.classList.remove('show');
        studentForm.reset();
    });
}

// Attendance Modal
const takeAttendanceBtn = document.getElementById('takeAttendanceBtn');
const attendanceModal = document.getElementById('attendanceModal');
const closeAttendanceModal = document.getElementById('closeAttendanceModal');
const attendanceForm = document.getElementById('attendanceForm');

if (takeAttendanceBtn && attendanceModal) {
    takeAttendanceBtn.addEventListener('click', () => {
        attendanceModal.classList.add('show');
    });

    closeAttendanceModal.addEventListener('click', () => {
        attendanceModal.classList.remove('show');
    });

    // Close modal when clicking outside
    attendanceModal.addEventListener('click', (e) => {
        if (e.target === attendanceModal) {
            attendanceModal.classList.remove('show');
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && attendanceModal.classList.contains('show')) {
            attendanceModal.classList.remove('show');
        }
    });
}

// Attendance Form Submission
if (attendanceForm) {
    attendanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(attendanceForm);
        const attendanceData = {
            date: formData.get('date'),
            students: Array.from(formData.getAll('attendance')).map(status => ({
                studentId: status.split('-')[0],
                status: status.split('-')[1]
            }))
        };

        // Here you would typically send the data to your backend
        console.log('Attendance Data:', attendanceData);

        // Show success message
        showNotification('تم تسجيل الحضور بنجاح', 'success');
        
        // Close modal and reset form
        attendanceModal.classList.remove('show');
        attendanceForm.reset();
    });
}

// Material Actions
document.querySelectorAll('.material-actions .btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const materialId = e.target.closest('.material-item').dataset.id;

        switch (action) {
            case 'edit':
                // Handle edit action
                console.log('Edit material:', materialId);
                break;
            case 'delete':
                if (confirm('هل أنت متأكد من حذف هذه المادة التعليمية؟')) {
                    // Handle delete action
                    console.log('Delete material:', materialId);
                    showNotification('تم حذف المادة التعليمية بنجاح', 'success');
                }
                break;
            case 'download':
                // Handle download action
                console.log('Download material:', materialId);
                break;
        }
    });
});

// Student Actions
document.querySelectorAll('.table-actions .btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const studentId = e.target.closest('tr').dataset.id;

        switch (action) {
            case 'view':
                // Handle view action
                console.log('View student:', studentId);
                break;
            case 'edit':
                // Handle edit action
                console.log('Edit student:', studentId);
                break;
            case 'delete':
                if (confirm('هل أنت متأكد من حذف هذا الطالب من الدورة؟')) {
                    // Handle delete action
                    console.log('Delete student:', studentId);
                    showNotification('تم حذف الطالب من الدورة بنجاح', 'success');
                }
                break;
        }
    });
});

// Review Actions
document.querySelectorAll('.review-actions .btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const reviewId = e.target.closest('.review-item').dataset.id;

        switch (action) {
            case 'edit':
                // Handle edit action
                console.log('Edit review:', reviewId);
                break;
            case 'delete':
                if (confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
                    // Handle delete action
                    console.log('Delete review:', reviewId);
                    showNotification('تم حذف التقييم بنجاح', 'success');
                }
                break;
        }
    });
});

// File Upload Preview
const fileInputs = document.querySelectorAll('input[type="file"]');
fileInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        const files = e.target.files;
        const previewContainer = e.target.nextElementSibling;
        
        if (previewContainer && previewContainer.classList.contains('file-preview')) {
            previewContainer.innerHTML = '';
            
            Array.from(files).forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <button type="button" class="btn btn-sm btn-danger remove-file">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                const removeBtn = fileItem.querySelector('.remove-file');
                removeBtn.addEventListener('click', () => {
                    fileItem.remove();
                    // Clear the file input
                    e.target.value = '';
                });
                
                previewContainer.appendChild(fileItem);
            });
        }
    });
});

// Calendar Initialization
document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    // Sample events data (in real application, this would come from your backend)
    const events = [
        {
            id: '1',
            title: 'محاضرة HTML5',
            start: '2024-02-15T10:00:00',
            end: '2024-02-15T12:00:00',
            className: 'event-lecture',
            extendedProps: {
                type: 'lecture',
                description: 'مقدمة في HTML5 و CSS3',
                location: 'القاعة 101',
                instructor: 'أحمد محمد'
            }
        },
        {
            id: '2',
            title: 'ورشة عمل JavaScript',
            start: '2024-02-17T14:00:00',
            end: '2024-02-17T16:00:00',
            className: 'event-workshop',
            extendedProps: {
                type: 'workshop',
                description: 'تطبيق عملي على JavaScript',
                location: 'معمل الحاسوب',
                instructor: 'محمد علي'
            }
        },
        {
            id: '3',
            title: 'اختبار HTML',
            start: '2024-02-20T09:00:00',
            end: '2024-02-20T10:30:00',
            className: 'event-exam',
            extendedProps: {
                type: 'exam',
                description: 'اختبار نهاية وحدة HTML',
                location: 'القاعة 102',
                instructor: 'أحمد محمد'
            }
        },
        {
            id: '4',
            title: 'تسليم المشروع',
            start: '2024-02-22T23:59:59',
            className: 'event-assignment',
            extendedProps: {
                type: 'assignment',
                description: 'تسليم مشروع الويب النهائي',
                location: 'منصة التعلم',
                instructor: 'محمد علي'
            }
        }
    ];

    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'ar',
        direction: 'rtl',
        initialView: 'dayGridMonth',
        headerToolbar: false, // We're using custom toolbar
        height: 'auto',
        events: events,
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
        },
        eventClick: function(info) {
            showEventDetails(info.event);
        },
        eventDidMount: function(info) {
            // Add tooltip
            info.el.title = info.event.extendedProps.description;
        },
        dayMaxEvents: true,
        nowIndicator: true,
        businessHours: {
            daysOfWeek: [0, 1, 2, 3, 4], // Sunday to Thursday
            startTime: '09:00',
            endTime: '17:00'
        }
    });

    calendar.render();

    // Calendar Navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        calendar.prev();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        calendar.next();
    });

    document.getElementById('today').addEventListener('click', () => {
        calendar.today();
    });

    // Calendar View Switching
    document.querySelectorAll('.calendar-view .btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.calendar-view .btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Change calendar view
            const view = button.dataset.view;
            calendar.changeView(view);
        });
    });

    // Initialize new calendar features
    initializeCalendarEvents();

    // Request notification permission
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // إضافة مستمعي المزامنة
    syncManager.addListener('events', (events) => {
        // تحديث التقويم عند تغيير البيانات
        calendar.removeAllEvents();
        Object.values(events).forEach(event => {
            if (!event.deleted) {
                calendar.addEvent({
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    className: `event-${event.type}`,
                    extendedProps: {
                        type: event.type,
                        description: event.description,
                        location: event.location,
                        instructor: event.instructor,
                        notes: event.notes,
                        attachments: event.attachments,
                        isRepeating: event.repeat ? true : false,
                        originalEventId: event.originalEventId
                    }
                });
            }
        });
    });

    // إضافة مستمع لتحديثات المواد التعليمية
    syncManager.addListener('materials', (materials) => {
        // تحديث قائمة المواد التعليمية
        updateMaterialsList(materials);
    });

    // إضافة مستمع لتحديثات الطلاب
    syncManager.addListener('students', (students) => {
        // تحديث قائمة الطلاب
        updateStudentsList(students);
    });

    // إضافة مستمع لتحديثات الحضور
    syncManager.addListener('attendance', (attendance) => {
        // تحديث سجلات الحضور
        updateAttendanceRecords(attendance);
    });

    // إضافة مستمع لتحديثات التقييمات
    syncManager.addListener('reviews', (reviews) => {
        // تحديث قائمة التقييمات
        updateReviewsList(reviews);
    });
});

// Event Details Modal
function showEventDetails(event) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${event.title}</h2>
                <button class="close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="event-details">
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${formatEventTime(event)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.extendedProps.location}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span>${event.extendedProps.instructor}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-info-circle"></i>
                        <span>${event.extendedProps.description}</span>
                    </div>
                </div>
                ${event.extendedProps.type === 'exam' ? `
                    <div class="exam-info">
                        <h3>معلومات الاختبار</h3>
                        <ul>
                            <li>المدة: 90 دقيقة</li>
                            <li>عدد الأسئلة: 30</li>
                            <li>الدرجة النهائية: 100</li>
                        </ul>
                    </div>
                ` : ''}
                ${event.extendedProps.type === 'assignment' ? `
                    <div class="assignment-info">
                        <h3>متطلبات التسليم</h3>
                        <ul>
                            <li>تسليم المشروع كملف ZIP</li>
                            <li>تضمين ملف README.md</li>
                            <li>تضمين الوثائق والملفات المطلوبة</li>
                        </ul>
                    </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">إغلاق</button>
                ${event.extendedProps.type === 'lecture' || event.extendedProps.type === 'workshop' ? `
                    <button class="btn btn-primary" onclick="joinSession('${event.id}')">
                        <i class="fas fa-video"></i>
                        الانضمام للجلسة
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

// Helper Functions
function formatEventTime(event) {
    const start = moment(event.start);
    const end = event.end ? moment(event.end) : null;
    
    if (!end) {
        return start.format('DD/MM/YYYY');
    }
    
    if (start.isSame(end, 'day')) {
        return `${start.format('DD/MM/YYYY')} ${start.format('HH:mm')} - ${end.format('HH:mm')}`;
    }
    
    return `${start.format('DD/MM/YYYY HH:mm')} - ${end.format('DD/MM/YYYY HH:mm')}`;
}

function joinSession(eventId) {
    // Here you would typically handle joining a video session
    console.log('Joining session:', eventId);
    showNotification('جاري الانضمام للجلسة...', 'info');
}

// Helper Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Calendar Event Management
function initializeCalendarEvents() {
    // Add Event Button
    const addEventBtn = document.createElement('button');
    addEventBtn.className = 'btn btn-primary';
    addEventBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة حدث';
    addEventBtn.onclick = () => showAddEventModal();
    document.querySelector('.calendar-toolbar .calendar-actions').appendChild(addEventBtn);

    // Add Export Button
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-secondary';
    exportBtn.innerHTML = '<i class="fas fa-download"></i> تصدير';
    exportBtn.onclick = exportCalendar;
    document.querySelector('.calendar-toolbar .calendar-actions').appendChild(exportBtn);
}

function showAddEventModal(event = null) {
    const isEdit = event !== null;
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${isEdit ? 'تعديل الحدث' : 'إضافة حدث جديد'}</h2>
                <button class="close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="eventForm" class="modal-body">
                <div class="form-group">
                    <label for="eventTitle">عنوان الحدث</label>
                    <input type="text" id="eventTitle" required value="${isEdit ? event.title : ''}">
                </div>
                <div class="form-group">
                    <label for="eventType">نوع الحدث</label>
                    <select id="eventType" required>
                        <option value="lecture" ${isEdit && event.extendedProps.type === 'lecture' ? 'selected' : ''}>محاضرة</option>
                        <option value="workshop" ${isEdit && event.extendedProps.type === 'workshop' ? 'selected' : ''}>ورشة عمل</option>
                        <option value="exam" ${isEdit && event.extendedProps.type === 'exam' ? 'selected' : ''}>اختبار</option>
                        <option value="assignment" ${isEdit && event.extendedProps.type === 'assignment' ? 'selected' : ''}>مهمة</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventStart">تاريخ البداية</label>
                        <input type="datetime-local" id="eventStart" required 
                            value="${isEdit ? moment(event.start).format('YYYY-MM-DDTHH:mm') : ''}">
                    </div>
                    <div class="form-group">
                        <label for="eventEnd">تاريخ النهاية</label>
                        <input type="datetime-local" id="eventEnd" required 
                            value="${isEdit && event.end ? moment(event.end).format('YYYY-MM-DDTHH:mm') : ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="eventLocation">الموقع</label>
                    <input type="text" id="eventLocation" required 
                        value="${isEdit ? event.extendedProps.location : ''}">
                </div>
                <div class="form-group">
                    <label for="eventInstructor">المدرب</label>
                    <input type="text" id="eventInstructor" required 
                        value="${isEdit ? event.extendedProps.instructor : ''}">
                </div>
                <div class="form-group">
                    <label for="eventDescription">الوصف</label>
                    <textarea id="eventDescription" rows="4" required>${isEdit ? event.extendedProps.description : ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="eventReminder">التذكير</label>
                    <select id="eventReminder">
                        <option value="">بدون تذكير</option>
                        <option value="15">15 دقيقة قبل</option>
                        <option value="30">30 دقيقة قبل</option>
                        <option value="60">ساعة قبل</option>
                        <option value="1440">يوم قبل</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="eventRepeat">تكرار الحدث</label>
                    <select id="eventRepeat">
                        <option value="">بدون تكرار</option>
                        <option value="daily">يومياً</option>
                        <option value="weekly">أسبوعياً</option>
                        <option value="monthly">شهرياً</option>
                    </select>
                </div>
                <div class="form-group repeat-options" style="display: none;">
                    <label for="repeatEndDate">تاريخ انتهاء التكرار</label>
                    <input type="date" id="repeatEndDate">
                </div>
                <div class="form-group">
                    <label for="eventNotes">ملاحظات خاصة</label>
                    <textarea id="eventNotes" rows="3" placeholder="ملاحظات خاصة للمدرب فقط...">${isEdit ? event.extendedProps.notes || '' : ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="eventAttachments">المرفقات</label>
                    <div class="attachments-container">
                        <input type="file" id="eventAttachments" multiple>
                        <div class="attachments-preview"></div>
                        ${isEdit && event.extendedProps.attachments ? `
                            <div class="existing-attachments">
                                ${event.extendedProps.attachments.map(attachment => `
                                    <div class="attachment-item">
                                        <i class="fas ${getFileIcon(attachment.name)}"></i>
                                        <span>${attachment.name}</span>
                                        <button type="button" class="btn btn-sm btn-danger remove-attachment" data-id="${attachment.id}">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="form-group">
                    <label>مشاركة الحدث</label>
                    <div class="share-options">
                        <label class="checkbox-label">
                            <input type="checkbox" id="shareEmail" ${isEdit && event.extendedProps.shareEmail ? 'checked' : ''}>
                            إرسال بريد إلكتروني للطلاب
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="shareNotification" ${isEdit && event.extendedProps.shareNotification ? 'checked' : ''}>
                            إرسال إشعار للطلاب
                        </label>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary close-modal">إلغاء</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'حفظ التغييرات' : 'إضافة الحدث'}</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Form Submission
    const form = modal.querySelector('#eventForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const eventData = {
            title: form.eventTitle.value,
            type: form.eventType.value,
            start: form.eventStart.value,
            end: form.eventEnd.value,
            location: form.eventLocation.value,
            instructor: form.eventInstructor.value,
            description: form.eventDescription.value,
            reminder: form.eventReminder.value,
            repeat: form.eventRepeat.value,
            repeatEndDate: form.repeatEndDate.value,
            notes: form.eventNotes.value,
            attachments: getAttachmentsData(form),
            shareEmail: form.shareEmail.checked,
            shareNotification: form.shareNotification.checked
        };

        if (isEdit) {
            updateEvent(event.id, eventData);
        } else {
            addEvent(eventData);
        }

        // Handle sharing if enabled
        if (eventData.shareEmail || eventData.shareNotification) {
            shareEvent(eventData);
        }

        closeModal();
    });

    // Close Modal Functionality
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

    // Add event listeners for new fields
    const repeatSelect = form.querySelector('#eventRepeat');
    const repeatOptions = form.querySelector('.repeat-options');
    
    repeatSelect.addEventListener('change', () => {
        repeatOptions.style.display = repeatSelect.value ? 'block' : 'none';
    });

    // Handle attachments
    const attachmentsInput = form.querySelector('#eventAttachments');
    const attachmentsPreview = form.querySelector('.attachments-preview');
    
    attachmentsInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const attachmentItem = document.createElement('div');
            attachmentItem.className = 'attachment-item';
            attachmentItem.innerHTML = `
                <i class="fas ${getFileIcon(file.name)}"></i>
                <span>${file.name}</span>
                <button type="button" class="btn btn-sm btn-danger remove-attachment">
                    <i class="fas fa-times"></i>
                </button>
            `;
            attachmentsPreview.appendChild(attachmentItem);
        });
    });
}

function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const icons = {
        pdf: 'fa-file-pdf',
        doc: 'fa-file-word',
        docx: 'fa-file-word',
        xls: 'fa-file-excel',
        xlsx: 'fa-file-excel',
        ppt: 'fa-file-powerpoint',
        pptx: 'fa-file-powerpoint',
        zip: 'fa-file-archive',
        rar: 'fa-file-archive',
        jpg: 'fa-file-image',
        jpeg: 'fa-file-image',
        png: 'fa-file-image',
        gif: 'fa-file-image',
        mp4: 'fa-file-video',
        mp3: 'fa-file-audio'
    };
    return icons[extension] || 'fa-file';
}

function getAttachmentsData(form) {
    const attachments = [];
    const files = form.eventAttachments.files;
    const existingAttachments = form.querySelector('.existing-attachments');
    
    // Add new files
    Array.from(files).forEach(file => {
        attachments.push({
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
            file: file
        });
    });
    
    // Add existing attachments that weren't removed
    if (existingAttachments) {
        existingAttachments.querySelectorAll('.attachment-item').forEach(item => {
            if (!item.classList.contains('removed')) {
                attachments.push({
                    id: item.dataset.id,
                    name: item.querySelector('span').textContent,
                    existing: true
                });
            }
        });
    }
    
    return attachments;
}

async function addEvent(eventData) {
    try {
        const newEvent = await syncManager.addItem('events', {
            title: eventData.title,
            start: eventData.start,
            end: eventData.end,
            type: eventData.type,
            description: eventData.description,
            location: eventData.location,
            instructor: eventData.instructor,
            notes: eventData.notes,
            attachments: eventData.attachments,
            repeat: eventData.repeat,
            repeatEndDate: eventData.repeatEndDate
        });

        // إضافة الحدث إلى التقويم
        calendar.addEvent({
            id: newEvent.id,
            title: newEvent.title,
            start: newEvent.start,
            end: newEvent.end,
            className: `event-${newEvent.type}`,
            extendedProps: {
                type: newEvent.type,
                description: newEvent.description,
                location: newEvent.location,
                instructor: newEvent.instructor,
                notes: newEvent.notes,
                attachments: newEvent.attachments,
                isRepeating: newEvent.repeat ? true : false,
                originalEventId: newEvent.originalEventId
            }
        });

        if (eventData.reminder) {
            scheduleReminder(newEvent, parseInt(eventData.reminder));
        }

        showNotification(`تم إضافة ${newEvent.repeat ? 'الأحداث المتكررة' : 'الحدث'} بنجاح`, 'success');
    } catch (error) {
        console.error('خطأ في إضافة الحدث:', error);
        showNotification('حدث خطأ أثناء إضافة الحدث', 'error');
    }
}

async function updateEvent(eventId, eventData) {
    try {
        const updatedEvent = await syncManager.updateItem('events', eventId, {
            title: eventData.title,
            start: eventData.start,
            end: eventData.end,
            type: eventData.type,
            description: eventData.description,
            location: eventData.location,
            instructor: eventData.instructor,
            notes: eventData.notes,
            attachments: eventData.attachments,
            repeat: eventData.repeat,
            repeatEndDate: eventData.repeatEndDate
        });

        // تحديث الحدث في التقويم
        const event = calendar.getEventById(eventId);
        if (event) {
            event.setProp('title', updatedEvent.title);
            event.setStart(updatedEvent.start);
            event.setEnd(updatedEvent.end);
            event.setProp('classNames', [`event-${updatedEvent.type}`]);
            event.setExtendedProp('type', updatedEvent.type);
            event.setExtendedProp('description', updatedEvent.description);
            event.setExtendedProp('location', updatedEvent.location);
            event.setExtendedProp('instructor', updatedEvent.instructor);
            event.setExtendedProp('notes', updatedEvent.notes);
            event.setExtendedProp('attachments', updatedEvent.attachments);
            event.setExtendedProp('isRepeating', updatedEvent.repeat ? true : false);
            event.setExtendedProp('originalEventId', updatedEvent.originalEventId);
        }

        if (eventData.reminder) {
            scheduleReminder(updatedEvent, parseInt(eventData.reminder));
        }

        showNotification('تم تحديث الحدث بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في تحديث الحدث:', error);
        showNotification('حدث خطأ أثناء تحديث الحدث', 'error');
    }
}

function scheduleReminder(event, minutesBefore) {
    const reminderTime = moment(event.start).subtract(minutesBefore, 'minutes');
    const now = moment();
    
    if (reminderTime.isAfter(now)) {
        const timeUntilReminder = reminderTime.diff(now);
        setTimeout(() => {
            showReminderNotification(event);
        }, timeUntilReminder);
    }
}

function showReminderNotification(event) {
    const notification = new Notification(event.title, {
        body: `سيبدأ ${event.extendedProps.type === 'lecture' ? 'المحاضرة' : 'الحدث'} في ${event.extendedProps.location}`,
        icon: '/images/logo.png'
    });

    // Also show in-app notification
    showNotification(`تذكير: ${event.title} سيبدأ قريباً`, 'info');
}

function exportCalendar() {
    const events = calendar.getEvents().map(event => ({
        title: event.title,
        start: event.start,
        end: event.end,
        type: event.extendedProps.type,
        description: event.extendedProps.description,
        location: event.extendedProps.location,
        instructor: event.extendedProps.instructor,
        notes: event.extendedProps.notes,
        attachments: event.extendedProps.attachments,
        isRepeating: event.extendedProps.isRepeating,
        originalEventId: event.extendedProps.originalEventId
    }));

    // Create ICS file with additional fields
    const icsContent = generateICS(events);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'course-calendar.ics';
    link.click();
}

function generateICS(events) {
    const formatDate = (date) => {
        return moment(date).format('YYYYMMDDTHHmmss');
    };

    let ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Asjad Training Center//Course Calendar//AR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:دورة تطوير الويب',
        'X-WR-TIMEZONE:Asia/Riyadh'
    ];

    events.forEach(event => {
        ics.push(
            'BEGIN:VEVENT',
            `DTSTART:${formatDate(event.start)}`,
            `DTEND:${formatDate(event.end)}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description}\n\nملاحظات: ${event.notes || ''}\nالمدرب: ${event.instructor}`,
            `LOCATION:${event.location}`,
            event.isRepeating ? `RRULE:FREQ=${event.repeat.toUpperCase()};UNTIL=${formatDate(event.repeatEndDate)}` : '',
            'END:VEVENT'
        );
    });

    ics.push('END:VCALENDAR');
    return ics.join('\r\n');
}

function shareEvent(eventData) {
    // Get enrolled students (in a real application, this would come from your backend)
    const students = getEnrolledStudents();
    
    if (eventData.shareEmail) {
        // Send email to students
        students.forEach(student => {
            sendEventEmail(student.email, eventData);
        });
    }
    
    if (eventData.shareNotification) {
        // Send in-app notification to students
        students.forEach(student => {
            sendEventNotification(student.id, eventData);
        });
    }
    
    showNotification('تم مشاركة الحدث مع الطلاب بنجاح', 'success');
}

// Helper function to get enrolled students (mock data)
function getEnrolledStudents() {
    return [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com' },
        { id: 2, name: 'محمد علي', email: 'mohammed@example.com' },
        // ... more students
    ];
}

// Function to send event email
function sendEventEmail(email, eventData) {
    // In a real application, this would send an actual email
    console.log(`Sending email to ${email} about event: ${eventData.title}`);
}

// Function to send event notification
function sendEventNotification(studentId, eventData) {
    // In a real application, this would send an actual notification
    console.log(`Sending notification to student ${studentId} about event: ${eventData.title}`);
}

// دالة تحديث قائمة المواد التعليمية
function updateMaterialsList(materials) {
    const materialsList = document.querySelector('.materials-list');
    if (!materialsList) return;

    materialsList.innerHTML = Object.values(materials)
        .filter(material => !material.deleted)
        .map(material => `
            <div class="material-item" data-id="${material.id}">
                <div class="material-info">
                    <h3>${material.title}</h3>
                    <p>${material.description}</p>
                    <span class="material-type">${material.type}</span>
                </div>
                <div class="material-actions">
                    <button class="btn btn-sm btn-primary" data-action="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" data-action="download">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `).join('');
}

// دالة تحديث قائمة الطلاب
function updateStudentsList(students) {
    const studentsTable = document.querySelector('.students-table tbody');
    if (!studentsTable) return;

    studentsTable.innerHTML = Object.values(students)
        .filter(student => !student.deleted)
        .map(student => `
            <tr data-id="${student.id}">
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.status}</td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-primary" data-action="view">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" data-action="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
}

// دالة تحديث سجلات الحضور
function updateAttendanceRecords(attendance) {
    const attendanceTable = document.querySelector('.attendance-table tbody');
    if (!attendanceTable) return;

    attendanceTable.innerHTML = Object.values(attendance)
        .filter(record => !record.deleted)
        .map(record => `
            <tr data-id="${record.id}">
                <td>${record.date}</td>
                <td>${record.studentName}</td>
                <td>${record.status}</td>
                <td>${record.notes || ''}</td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-secondary" data-action="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
}

// دالة تحديث قائمة التقييمات
function updateReviewsList(reviews) {
    const reviewsList = document.querySelector('.reviews-list');
    if (!reviewsList) return;

    reviewsList.innerHTML = Object.values(reviews)
        .filter(review => !review.deleted)
        .map(review => `
            <div class="review-item" data-id="${review.id}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <h3>${review.studentName}</h3>
                        <div class="rating">
                            ${generateRatingStars(review.rating)}
                        </div>
                    </div>
                    <span class="review-date">${formatDate(review.date)}</span>
                </div>
                <p class="review-content">${review.content}</p>
                <div class="review-actions">
                    <button class="btn btn-sm btn-secondary" data-action="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
}

// دالة مساعدة لتوليد نجوم التقييم
function generateRatingStars(rating) {
    return Array(5).fill('').map((_, index) => `
        <i class="fas fa-star ${index < rating ? 'active' : ''}"></i>
    `).join('');
}

// دالة مساعدة لتنسيق التاريخ
function formatDate(date) {
    return moment(date).format('DD/MM/YYYY');
} 