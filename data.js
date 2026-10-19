/**
 * Data Storage & State Management
 * Öğrenci & Danışan Yönetim Paneli
 */

const STORAGE_KEY = 'DANISAN_PRO_DATA_V2';

// Helper to format Date as YYYY-MM-DD
function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate sample initial data with relative dates around today
function generateInitialData() {
  const today = new Date();
  const todayStr = formatDate(today);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  const twoDaysAgoStr = formatDate(twoDaysAgo);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);

  const students = [
    {
      id: 'stu_1',
      fullName: 'Ahmet Yılmaz',
      phone: '0532 111 22 33',
      email: 'ahmet.yilmaz@gmail.com',
      status: 'Aktif', // Aktif or Pasif
      category: 'YKS Hazırlık (Sayısal)',
      notes: 'Matematik ve Fizik netlerinde istikrarlı artış var. Hedef: İTÜ / Boğaziçi Mühendislik.',
      createdAt: twoDaysAgoStr,
      isDeleted: false
    },
    {
      id: 'stu_2',
      fullName: 'Zeynep Kaya',
      phone: '0544 222 33 44',
      email: 'zeynep.kaya@outlook.com',
      status: 'Aktif',
      category: 'Kariyer Danışmanlığı',
      notes: 'Yurt dışı yüksek lisans ve mülakat hazırlığı yürütülüyor. CV güncellendi.',
      createdAt: twoDaysAgoStr,
      isDeleted: false
    },
    {
      id: 'stu_3',
      fullName: 'Mert Demir',
      phone: '0555 333 44 55',
      email: 'mert.demir@hotmail.com',
      status: 'Aktif',
      category: 'LGS Koçluğu',
      notes: 'Haftalık 400 soru hedefi verildi. Zaman yönetimi ve dikkat hataları çalışılıyor.',
      createdAt: yesterdayStr,
      isDeleted: false
    },
    {
      id: 'stu_4',
      fullName: 'Elif Yıldız',
      phone: '0533 444 55 66',
      email: 'elif.yildiz@gmail.com',
      status: 'Aktif',
      category: 'Dil Sınavı (IELTS / TOEFL)',
      notes: 'Writing Task 2 ve Speaking 2. bölüm simülasyonları yapılıyor.',
      createdAt: twoDaysAgoStr,
      isDeleted: false
    },
    {
      id: 'stu_5',
      fullName: 'Burak Şahin',
      phone: '0505 555 66 77',
      email: 'burak.sahin@yahoo.com',
      status: 'Pasif',
      category: 'Bireysel Gelişim',
      notes: 'İş yoğunluğu nedeniyle görüşmelere 1 ay ara verdi.',
      createdAt: twoDaysAgoStr,
      isDeleted: false
    },
    {
      id: 'stu_6',
      fullName: 'Selin Arslan',
      phone: '0536 777 88 99',
      email: 'selin.arslan@gmail.com',
      status: 'Aktif',
      category: 'Üniversite Tercih & Koçluk',
      notes: 'Tıp fakültesi hedefliyor, motivasyon ve deneme analizi yapılıyor.',
      createdAt: yesterdayStr,
      isDeleted: false
    }
  ];

  const appointments = [
    {
      id: 'apt_1',
      studentId: 'stu_1',
      date: todayStr,
      time: '11:00',
      type: 'Online (Zoom)',
      topic: 'TYT-AYT Deneme Analizi & Hedef Belirleme',
      status: 'Bekliyor', // Bekliyor, Tamamlandı, İptal
      summaryNote: '',
      completedAt: null
    },
    {
      id: 'apt_2',
      studentId: 'stu_2',
      date: todayStr,
      time: '14:30',
      type: 'Yüz Yüze Görüşme',
      topic: 'Mülakat Simülasyonu & İngilizce Sunum',
      status: 'Bekliyor',
      summaryNote: '',
      completedAt: null
    },
    {
      id: 'apt_3',
      studentId: 'stu_3',
      date: todayStr,
      time: '09:30',
      type: 'Online (Google Meet)',
      topic: 'Haftalık Çalışma Çizelgesi Kontrolü',
      status: 'Tamamlandı',
      summaryNote: 'Öğrencinin haftalık soru hedefi %90 oranında tamamlandı. Paragraf taktikleri gözden geçirildi.',
      completedAt: `${todayStr} 10:15`
    },
    {
      id: 'apt_4',
      studentId: 'stu_4',
      date: tomorrowStr,
      time: '16:00',
      type: 'Online (Zoom)',
      topic: 'IELTS Speaking Denemesi',
      status: 'Bekliyor',
      summaryNote: '',
      completedAt: null
    },
    {
      id: 'apt_5',
      studentId: 'stu_6',
      date: tomorrowStr,
      time: '10:00',
      type: 'Yüz Yüze Görüşme',
      topic: 'Biyoloji & Kimya Çalışma Stratejisi',
      status: 'Bekliyor',
      summaryNote: '',
      completedAt: null
    },
    {
      id: 'apt_6',
      studentId: 'stu_1',
      date: yesterdayStr,
      time: '15:00',
      type: 'Online (Zoom)',
      topic: 'Matematik Problemler Kampı Değerlendirmesi',
      status: 'Tamamlandı',
      summaryNote: 'Problemler fasikülü bitirildi, geometri için yeni kaynak belirlendi.',
      completedAt: `${yesterdayStr} 15:45`
    }
  ];

  const notes = [
    {
      id: 'note_1',
      studentId: 'stu_3',
      appointmentId: 'apt_3',
      title: 'Haftalık Çalışma Çizelgesi Kontrolü',
      content: 'Öğrencinin haftalık soru hedefi %90 oranında tamamlandı. Paragraf taktikleri gözden geçirildi. Fen bilimlerinde elektrik ünitesi için eksik konu anlatımı tekrar edilecek.',
      actionItems: '1. Fen Bilimleri 2 video izlenecek\n2. Günde 20 paragraf sorusu çözülecek',
      rating: 5,
      date: todayStr,
      time: '10:15'
    },
    {
      id: 'note_2',
      studentId: 'stu_1',
      appointmentId: 'apt_6',
      title: 'Matematik Problemler Kampı Değerlendirmesi',
      content: 'Problemler fasikülü bitirildi. Öğrencinin hızlanması için tur tekniği anlatıldı. Geometri üçgenler konusu için ek test ödevi verildi.',
      actionItems: '1. Karekök Geometri 3 test\n2. Hız Denemesi 1 adet',
      rating: 4,
      date: yesterdayStr,
      time: '15:45'
    },
    {
      id: 'note_3',
      studentId: 'stu_4',
      appointmentId: null,
      title: 'İlk Seviye Tespit & Tanışma Görüşmesi',
      content: 'Genel İngilizce seviyesi B2 olarak değerlendirildi. Hedeflenen IELTS skoru: 7.5. Dinleme ve Okuma alanları güçlü, konuşma pratiği gerektiriyor.',
      actionItems: '1. Cambridge IELTS 16 Test 1 çözümü\n2. 5 dakikalık ses kaydı teslimi',
      rating: 4,
      date: twoDaysAgoStr,
      time: '11:20'
    }
  ];

  const tasks = [
    { id: 'tsk_1', title: "Mert'e haftalık PDF çalışma planını ilet", completed: false, date: todayStr },
    { id: 'tsk_2', title: "Zeynep'in mülakat kaydını arşivle", completed: false, date: todayStr },
    { id: 'tsk_3', title: "Elif'e Speaking değerlendirme raporunu gönder", completed: true, date: todayStr },
    { id: 'tsk_4', title: "Ahmet'in geometri fasikül ödevini kontrol et", completed: false, date: todayStr }
  ];

  return { students, appointments, notes, tasks };
}

const DataStore = {
  data: null,

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
        // Validate keys
        if (!this.data.students || !this.data.appointments || !this.data.notes) {
          throw new Error('Geçersiz veri yapısı');
        }
      } else {
        this.data = generateInitialData();
        this.save();
      }
    } catch (e) {
      console.warn('Veri yüklenirken hata veya boş depo, varsayılan veriler yükleniyor:', e);
      this.data = generateInitialData();
      this.save();
    }
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('LocalStorage kaydetme hatası:', e);
    }
  },

  resetToDefault() {
    this.data = generateInitialData();
    this.save();
    return this.data;
  },

  // ---------------- STUDENTS CRUD ----------------
  getStudents(includeDeleted = false) {
    if (!this.data) this.init();
    if (includeDeleted) return this.data.students;
    return this.data.students.filter(s => !s.isDeleted);
  },

  getStudentById(id) {
    if (!this.data) this.init();
    return this.data.students.find(s => s.id === id) || null;
  },

  addStudent(studentData) {
    if (!this.data) this.init();
    const newStudent = {
      id: 'stu_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      fullName: studentData.fullName.trim(),
      phone: studentData.phone.trim(),
      email: (studentData.email || '').trim(),
      status: studentData.status || 'Aktif',
      category: (studentData.category || 'Genel Danışan').trim(),
      notes: (studentData.notes || '').trim(),
      createdAt: formatDate(new Date()),
      isDeleted: false
    };
    this.data.students.unshift(newStudent);
    this.save();
    return newStudent;
  },

  updateStudent(id, updatedFields) {
    if (!this.data) this.init();
    const index = this.data.students.findIndex(s => s.id === id);
    if (index === -1) return null;

    this.data.students[index] = {
      ...this.data.students[index],
      ...updatedFields,
      id // id stays immutable
    };
    this.save();
    return this.data.students[index];
  },

  // Soft delete (or toggle trash)
  deleteStudent(id, hardDelete = false) {
    if (!this.data) this.init();
    if (hardDelete) {
      this.data.students = this.data.students.filter(s => s.id !== id);
      // also optionally clean up or keep appointments/notes
    } else {
      const student = this.getStudentById(id);
      if (student) {
        student.isDeleted = true;
      }
    }
    this.save();
    return true;
  },

  restoreStudent(id) {
    if (!this.data) this.init();
    const student = this.data.students.find(s => s.id === id);
    if (student) {
      student.isDeleted = false;
      this.save();
      return true;
    }
    return false;
  },

  // ---------------- APPOINTMENTS CRUD ----------------
  getAppointments() {
    if (!this.data) this.init();
    return this.data.appointments;
  },

  getAppointmentById(id) {
    if (!this.data) this.init();
    return this.data.appointments.find(a => a.id === id) || null;
  },

  getAppointmentsByStudent(studentId) {
    if (!this.data) this.init();
    return this.data.appointments.filter(a => a.studentId === studentId);
  },

  getTodayAppointments() {
    if (!this.data) this.init();
    const todayStr = formatDate(new Date());
    return this.data.appointments
      .filter(a => a.date === todayStr)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  },

  addAppointment(aptData) {
    if (!this.data) this.init();
    const newApt = {
      id: 'apt_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      studentId: aptData.studentId,
      date: aptData.date,
      time: aptData.time || '10:00',
      type: aptData.type || 'Online (Zoom)',
      topic: (aptData.topic || 'Genel Değerlendirme').trim(),
      status: aptData.status || 'Bekliyor',
      summaryNote: '',
      completedAt: null
    };
    this.data.appointments.unshift(newApt);
    this.save();
    return newApt;
  },

  updateAppointment(id, updatedFields) {
    if (!this.data) this.init();
    const index = this.data.appointments.findIndex(a => a.id === id);
    if (index === -1) return null;

    this.data.appointments[index] = {
      ...this.data.appointments[index],
      ...updatedFields,
      id
    };
    this.save();
    return this.data.appointments[index];
  },

  deleteAppointment(id) {
    if (!this.data) this.init();
    this.data.appointments = this.data.appointments.filter(a => a.id !== id);
    this.save();
    return true;
  },

  // Tek Tıkla Özet Notu ve Durum "Tamamlandı" Yapma
  completeAppointmentWithNote(appointmentId, noteData) {
    if (!this.data) this.init();
    const apt = this.getAppointmentById(appointmentId);
    if (!apt) return null;

    const now = new Date();
    const nowStr = `${formatDate(now)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Update appointment
    apt.status = 'Tamamlandı';
    apt.summaryNote = noteData.content || '';
    apt.completedAt = nowStr;

    // Create note in Notes collection
    const newNote = {
      id: 'note_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      studentId: apt.studentId,
      appointmentId: apt.id,
      title: noteData.title || apt.topic || 'Görüşme Notu',
      content: noteData.content || '',
      actionItems: noteData.actionItems || '',
      rating: Number(noteData.rating) || 5,
      date: formatDate(now),
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    };

    this.data.notes.unshift(newNote);
    this.save();

    return { appointment: apt, note: newNote };
  },

  // ---------------- NOTES CRUD ----------------
  getNotes() {
    if (!this.data) this.init();
    return this.data.notes;
  },

  getNoteById(id) {
    if (!this.data) this.init();
    return this.data.notes.find(n => n.id === id) || null;
  },

  getNotesByStudent(studentId) {
    if (!this.data) this.init();
    return this.data.notes.filter(n => n.studentId === studentId);
  },

  addNote(noteData) {
    if (!this.data) this.init();
    const now = new Date();
    const newNote = {
      id: 'note_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      studentId: noteData.studentId,
      appointmentId: noteData.appointmentId || null,
      title: (noteData.title || 'Görüşme Notu').trim(),
      content: (noteData.content || '').trim(),
      actionItems: (noteData.actionItems || '').trim(),
      rating: Number(noteData.rating) || 5,
      date: noteData.date || formatDate(now),
      time: noteData.time || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    };
    this.data.notes.unshift(newNote);
    this.save();
    return newNote;
  },

  updateNote(id, updatedFields) {
    if (!this.data) this.init();
    const index = this.data.notes.findIndex(n => n.id === id);
    if (index === -1) return null;

    this.data.notes[index] = {
      ...this.data.notes[index],
      ...updatedFields,
      id
    };
    this.save();
    return this.data.notes[index];
  },

  deleteNote(id) {
    if (!this.data) this.init();
    this.data.notes = this.data.notes.filter(n => n.id !== id);
    this.save();
    return true;
  },

  // ---------------- TASKS (ACTION ITEMS) CRUD ----------------
  getTasks() {
    if (!this.data) this.init();
    if (!this.data.tasks) this.data.tasks = [];
    return this.data.tasks;
  },

  addTask(title) {
    if (!this.data) this.init();
    if (!this.data.tasks) this.data.tasks = [];
    const newTask = {
      id: 'tsk_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      title: title.trim(),
      completed: false,
      date: formatDate(new Date())
    };
    this.data.tasks.unshift(newTask);
    this.save();
    return newTask;
  },

  toggleTask(id) {
    if (!this.data) this.init();
    const task = (this.data.tasks || []).find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.save();
      return task;
    }
    return null;
  },

  deleteTask(id) {
    if (!this.data) this.init();
    if (!this.data.tasks) this.data.tasks = [];
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    this.save();
    return true;
  },

  resetSampleTasks() {
    if (!this.data) this.init();
    const todayStr = formatDate(new Date());
    this.data.tasks = [
      { id: 'tsk_1', title: "Mert'e haftalık PDF çalışma planını ilet", completed: false, date: todayStr },
      { id: 'tsk_2', title: "Zeynep'in mülakat kaydını arşivle", completed: false, date: todayStr },
      { id: 'tsk_3', title: "Elif'e Speaking değerlendirme raporunu gönder", completed: true, date: todayStr },
      { id: 'tsk_4', title: "Ahmet'in geometri fasikül ödevini kontrol et", completed: false, date: todayStr }
    ];
    this.save();
    return this.data.tasks;
  },

  // ---------------- STATS HELPER ----------------
  getStats() {
    const students = this.getStudents(false);
    const appointments = this.getAppointments();
    const notes = this.getNotes();
    const todayStr = formatDate(new Date());

    const activeStudents = students.filter(s => s.status === 'Aktif').length;
    const passiveStudents = students.filter(s => s.status === 'Pasif').length;

    const todayApts = appointments.filter(a => a.date === todayStr);
    const todayCompleted = todayApts.filter(a => a.status === 'Tamamlandı').length;
    const todayPending = todayApts.filter(a => a.status === 'Bekliyor').length;

    const totalCompletedApts = appointments.filter(a => a.status === 'Tamamlandı').length;

    return {
      totalStudents: students.length,
      activeStudents,
      passiveStudents,
      todayTotalApts: todayApts.length,
      todayPending,
      todayCompleted,
      totalNotes: notes.length,
      totalCompletedApts
    };
  }
};

window.DataStore = DataStore;
window.formatDate = formatDate;
