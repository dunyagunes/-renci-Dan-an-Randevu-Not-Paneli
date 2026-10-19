/**
 * Main Application Logic & View Controllers
 * DanışanPro - Kurumsal Öğrenci & Danışan Yönetim Paneli
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Data & Notifications
  DataStore.init();
  Notify.init();

  // App State
  const state = {
    currentView: 'dashboard',
    theme: localStorage.getItem('DANISAN_THEME') || 'light',
    studentFilter: 'all', // all, Aktif, Pasif, deleted
    studentSearch: '',
    studentViewMode: 'table', // table, cards
    appointmentFilter: 'all', // all, today, upcoming, completed
    appointmentSearch: '',
    noteFilterStudentId: 'all',
    noteSearch: '',
    activeStudentDetailId: null,
    todayTableFilter: 'all', // all, pending, completed
    paletteQuery: ''
  };

  // DOM Elements
  const elements = {
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    sidebar: document.getElementById('sidebar'),
    currentDateEl: document.getElementById('current-date-display'),
    headerSearchTrigger: document.getElementById('header-search-trigger'),
    navItems: document.querySelectorAll('.nav-item'),
    viewSections: document.querySelectorAll('.view-section'),

    // User Profile
    userProfileBtn: document.getElementById('user-profile-btn'),
    userDropdownCard: document.getElementById('user-dropdown-card'),
    menuItemProfile: document.getElementById('menu-item-profile'),
    menuItemExportAll: document.getElementById('menu-item-export-all'),
    menuItemLogout: document.getElementById('menu-item-logout'),

    // Alert Banner
    alertBanner: document.getElementById('alert-banner'),
    alertBannerText: document.getElementById('alert-banner-text'),
    btnAlertQuickAction: document.getElementById('btn-alert-quick-action'),

    // Dashboard Elements
    statTotalStudents: document.getElementById('stat-total-students'),
    statActiveStudents: document.getElementById('stat-active-students'),
    statTodayAppointments: document.getElementById('stat-today-appointments'),
    statTodayPending: document.getElementById('stat-today-pending'),
    statTotalNotes: document.getElementById('stat-total-notes'),
    statCompletedApts: document.getElementById('stat-completed-apts'),
    todayAppointmentsTbody: document.getElementById('today-appointments-tbody'),
    todayBadgeCount: document.getElementById('today-badge-count'),
    navTodayBadge: document.getElementById('nav-today-badge'),
    todayFilterBtns: document.querySelectorAll('.today-filter-btn'),
    btnExportTodayCsv: document.getElementById('btn-export-today-csv'),

    // 2-Column Widgets
    recentNotesList: document.getElementById('recent-notes-list'),
    tasksList: document.getElementById('tasks-list'),
    taskAddForm: document.getElementById('task-add-form'),
    taskNewInput: document.getElementById('task-new-input'),
    tasksCounter: document.getElementById('tasks-counter'),
    btnSeedTasks: document.getElementById('btn-seed-tasks'),

    // Command Palette
    paletteOverlay: document.getElementById('palette-overlay'),
    paletteInput: document.getElementById('palette-input'),
    paletteResults: document.getElementById('palette-results'),

    // Students Elements
    studentsTableWrapper: document.getElementById('students-table-wrapper'),
    studentsTableBody: document.getElementById('students-table-body'),
    studentsCardGrid: document.getElementById('students-card-grid'),
    studentSearchInput: document.getElementById('student-search-input'),
    studentStatusFilter: document.getElementById('student-status-filter'),
    btnStudentViewTable: document.getElementById('btn-student-view-table'),
    btnStudentViewCards: document.getElementById('btn-student-view-cards'),

    // Appointments Elements
    appointmentsTableBody: document.getElementById('appointments-table-body'),
    appointmentSearchInput: document.getElementById('appointment-search-input'),
    appointmentStatusTabs: document.querySelectorAll('.appointment-status-tab'),

    // Notes Elements
    notesGrid: document.getElementById('notes-grid'),
    noteSearchInput: document.getElementById('note-search-input'),
    noteStudentFilter: document.getElementById('note-student-filter'),
    btnPrintNotesView: document.getElementById('btn-print-notes-view'),

    // Modals
    modalStudent: document.getElementById('modal-student'),
    studentForm: document.getElementById('student-form'),
    modalStudentTitle: document.getElementById('modal-student-title'),

    modalAppointment: document.getElementById('modal-appointment'),
    appointmentForm: document.getElementById('appointment-form'),
    modalAppointmentTitle: document.getElementById('modal-appointment-title'),
    aptStudentSelect: document.getElementById('apt-student-id'),

    modalQuickNote: document.getElementById('modal-quick-note'),
    quickNoteForm: document.getElementById('quick-note-form'),
    quickNoteStudentName: document.getElementById('quick-note-student-name'),
    quickNoteAppointmentTime: document.getElementById('quick-note-appointment-time'),
    quickNoteTopic: document.getElementById('quick-note-topic'),

    modalEditNote: document.getElementById('modal-edit-note'),
    editNoteForm: document.getElementById('edit-note-form'),
    editNoteStudentSelect: document.getElementById('edit-note-student-id'),

    // Slide-Over Drawer
    studentDrawerOverlay: document.getElementById('student-drawer-overlay'),
    studentDrawerPanel: document.getElementById('student-drawer-panel'),
    drawerStudentName: document.getElementById('drawer-student-name'),
    drawerStudentCategory: document.getElementById('drawer-student-category'),
    drawerStudentContent: document.getElementById('drawer-student-content'),
    drawerCloseBtn: document.getElementById('drawer-close-btn'),

    modalConfirm: document.getElementById('modal-confirm'),
    confirmModalTitle: document.getElementById('confirm-modal-title'),
    confirmModalMessage: document.getElementById('confirm-modal-message'),
    btnConfirmAction: document.getElementById('btn-confirm-action')
  };

  // Helper: Get Initials
  function getInitials(name = '') {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] || 'Ö').toUpperCase();
  }

  // Helper: Build WhatsApp Web URL with template
  function getWhatsAppUrl(phone = '', studentName = '', topic = '') {
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    let intPhone = cleanDigits;
    if (intPhone.startsWith('0')) {
      intPhone = '90' + intPhone.substring(1);
    } else if (!intPhone.startsWith('90') && intPhone.length === 10) {
      intPhone = '90' + intPhone;
    }
    const message = `Merhaba ${studentName}, DanışanPro üzerinden görüşmeniz hakkında bilgilendirme:` + (topic ? ` (${topic})` : '');
    return `https://wa.me/${intPhone}?text=${encodeURIComponent(message)}`;
  }

  // Inject Static Line Icons
  function injectStaticIcons() {
    if (window.Icons) {
      const setHtml = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
      };

      setHtml('brand-logo-icon', Icons.brand);
      setHtml('nav-icon-dashboard', Icons.dashboard);
      setHtml('nav-icon-students', Icons.users);
      setHtml('nav-icon-appointments', Icons.calendar);
      setHtml('nav-icon-notes', Icons.notes);
      setHtml('icon-btn-reset', Icons.refresh);
      setHtml('header-search-icon', Icons.search);
      setHtml('date-pill-icon', Icons.calendar);
      setHtml('profile-chevron', Icons.chevronDown);
      setHtml('icon-menu-profile', Icons.settings);
      setHtml('icon-menu-export', Icons.download);
      setHtml('icon-menu-logout', Icons.logOut);
      setHtml('alert-banner-bell', Icons.bell);
      setHtml('icon-btn-download', Icons.download);
      setHtml('icon-widget-notes', Icons.notes);
      setHtml('icon-widget-tasks', Icons.checkSquare);
      setHtml('palette-search-icon', Icons.search);
      setHtml('icon-btn-print', Icons.printer);

      setHtml('kpi-icon-students', Icons.users);
      setHtml('kpi-icon-today', Icons.calendar);
      setHtml('kpi-icon-completed', Icons.checkCircle);
      setHtml('kpi-icon-notes', Icons.notes);
      setHtml('spotlight-header-icon', Icons.clock);

      document.querySelectorAll('.btn-icon-slot[data-icon="plus"]').forEach(slot => {
        slot.innerHTML = Icons.plus;
      });
    }
  }

  // Set Theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    localStorage.setItem('DANISAN_THEME', theme);
    if (elements.themeToggleBtn && window.Icons) {
      elements.themeToggleBtn.innerHTML = theme === 'dark' ? Icons.sun : Icons.moon;
      elements.themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Açık Moda Geç' : 'Koyu Moda Geç');
    }
  }

  // Format Turkish Date Header
  function renderTodayDateHeader() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatted = now.toLocaleDateString('tr-TR', options);
    if (elements.currentDateEl) {
      elements.currentDateEl.textContent = dateFormatted;
    }
  }

  // Navigation Switch
  window.switchView = function(viewName) {
    state.currentView = viewName;
    elements.viewSections.forEach(sec => {
      sec.classList.remove('active');
      if (sec.id === `view-${viewName}`) {
        sec.classList.add('active');
      }
    });

    elements.navItems.forEach(item => {
      if (item.dataset.view === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (elements.sidebar.classList.contains('open')) {
      elements.sidebar.classList.remove('open');
    }

    renderAll();
  };

  // Modal helpers
  function openModal(modalEl) {
    if (modalEl) modalEl.classList.add('active');
  }

  function closeModal(modalEl) {
    if (modalEl) modalEl.classList.remove('active');
  }

  document.querySelectorAll('.modal-close, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Global Confirmation Modal
  let confirmCallback = null;
  function showConfirm(title, message, onConfirm) {
    elements.confirmModalTitle.textContent = title;
    elements.confirmModalMessage.textContent = message;
    confirmCallback = onConfirm;
    openModal(elements.modalConfirm);
  }

  elements.btnConfirmAction.addEventListener('click', () => {
    if (confirmCallback) {
      confirmCallback();
      confirmCallback = null;
    }
    closeModal(elements.modalConfirm);
  });

  // Populate Select dropdowns with active students
  function populateStudentSelects() {
    const students = DataStore.getStudents(false).sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'));

    if (elements.aptStudentSelect) {
      elements.aptStudentSelect.innerHTML = '<option value="">-- Danışan Seçin --</option>' +
        students.map(s => `<option value="${s.id}">${s.fullName} (${s.category || 'Genel'})</option>`).join('');
    }

    if (elements.editNoteStudentSelect) {
      elements.editNoteStudentSelect.innerHTML = '<option value="">-- Danışan Seçin --</option>' +
        students.map(s => `<option value="${s.id}">${s.fullName}</option>`).join('');
    }

    if (elements.noteStudentFilter) {
      const currentVal = elements.noteStudentFilter.value;
      elements.noteStudentFilter.innerHTML = '<option value="all">Tüm Öğrenciler & Danışanlar</option>' +
        students.map(s => `<option value="${s.id}">${s.fullName}</option>`).join('');
      elements.noteStudentFilter.value = currentVal || 'all';
    }
  }

  // ---------------- CRITICAL ALARM BANNER ----------------
  function checkCriticalAlarm() {
    const todayApts = DataStore.getTodayAppointments();
    const pendingToday = todayApts.filter(a => a.status === 'Bekliyor');

    if (pendingToday.length > 0) {
      const earliestPendingApt = pendingToday[0];
      const student = DataStore.getStudentById(earliestPendingApt.studentId);
      const studentName = student ? student.fullName : 'Danışan';

      elements.alertBannerText.innerHTML = `<strong>Kritik Hatırlatma:</strong> Bugün saat <strong>${earliestPendingApt.time}</strong>'da <strong>${studentName}</strong> görüşmesi planlandı.`;
      elements.alertBanner.style.display = 'flex';

      elements.btnAlertQuickAction.onclick = () => {
        window.openQuickNoteModal(earliestPendingApt.id);
      };
    } else {
      elements.alertBanner.style.display = 'none';
    }
  }

  // ---------------- RENDER DASHBOARD & STATS ----------------
  function renderDashboard() {
    const stats = DataStore.getStats();

    elements.statTotalStudents.textContent = stats.totalStudents;
    elements.statActiveStudents.textContent = `${stats.activeStudents} Aktif / ${stats.passiveStudents} Pasif`;
    elements.statTodayAppointments.textContent = stats.todayTotalApts;
    elements.statTodayPending.textContent = `${stats.todayPending} Bekleyen`;
    elements.statTotalNotes.textContent = stats.totalNotes;
    elements.statCompletedApts.textContent = stats.totalCompletedApts;

    elements.todayBadgeCount.textContent = `${stats.todayPending} Bekliyor`;
    elements.navTodayBadge.textContent = stats.todayPending;
    elements.navTodayBadge.style.display = stats.todayTotalApts > 0 ? 'inline-block' : 'none';

    checkCriticalAlarm();

    // Render Today's Appointments with Fast Filters
    let todayApts = DataStore.getTodayAppointments();

    if (state.todayTableFilter === 'pending') {
      todayApts = todayApts.filter(a => a.status === 'Bekliyor');
    } else if (state.todayTableFilter === 'completed') {
      todayApts = todayApts.filter(a => a.status === 'Tamamlandı');
    }

    if (todayApts.length === 0) {
      elements.todayAppointmentsTbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 36px 16px;">
            <div class="empty-state">
              <div class="empty-icon">${Icons.calendar}</div>
              <div class="empty-title">Bu Filtrede Randevu Bulunamadı</div>
              <div class="empty-desc">Bugün için seçili durumda randevu kaydı yok.</div>
            </div>
          </td>
        </tr>
      `;
    } else {
      elements.todayAppointmentsTbody.innerHTML = todayApts.map(apt => {
        const student = DataStore.getStudentById(apt.studentId) || { fullName: 'Bilinmeyen Öğrenci', phone: '', category: '-' };
        const isCompleted = apt.status === 'Tamamlandı';
        const isCancelled = apt.status === 'İptal';

        let rowClass = 'row-status-pending';
        let statusBadge = `<span class="badge badge-pending">Bekliyor</span>`;

        if (isCompleted) {
          rowClass = 'row-status-completed';
          statusBadge = `<span class="badge badge-completed">Tamamlandı</span>`;
        } else if (isCancelled) {
          rowClass = 'row-status-cancelled';
          statusBadge = `<span class="badge badge-cancelled">İptal</span>`;
        }

        // Online Meeting Link
        let meetingLinkHtml = '';
        if (apt.type && apt.type.includes('Zoom')) {
          meetingLinkHtml = `<a href="https://zoom.us/join" target="_blank" rel="noopener noreferrer" class="meeting-link-chip" title="Zoom Toplantısına Git">${Icons.externalLink} Bağlantı</a>`;
        } else if (apt.type && apt.type.includes('Meet')) {
          meetingLinkHtml = `<a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer" class="meeting-link-chip" title="Google Meet Toplantısına Git">${Icons.externalLink} Bağlantı</a>`;
        }

        // WhatsApp link
        const waLink = getWhatsAppUrl(student.phone, student.fullName, apt.topic);

        return `
          <tr class="${rowClass}">
            <td>
              <div style="font-family: var(--font-mono); font-weight: 700; color: var(--text-main); font-size: 0.88rem; display: flex; align-items: center; gap: 5px;">
                <span style="color: var(--text-muted);">${Icons.clock}</span>
                <span>${apt.time || '10:00'}</span>
              </div>
            </td>
            <td>
              <div class="student-cell">
                <div class="avatar">${getInitials(student.fullName)}</div>
                <div>
                  <div class="student-name" onclick="window.openStudentDrawer('${student.id}')">${student.fullName}</div>
                  <div class="student-phone-sub">
                    ${Icons.phone} <a href="tel:${student.phone}">${student.phone || 'Telefon yok'}</a>
                    <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="whatsapp-link" title="WhatsApp Web üzerinden mesaj gönder">
                      ${Icons.whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div style="display: inline-flex; align-items: center;">
                <span class="badge badge-type">${apt.type || 'Online'}</span>
                ${meetingLinkHtml}
              </div>
            </td>
            <td>
              <span style="font-size: 0.86rem; color: var(--text-main);">${apt.topic || 'Genel Değerlendirme'}</span>
            </td>
            <td>
              ${statusBadge}
            </td>
            <td style="text-align: right;">
              ${!isCompleted ? `
                <button class="btn btn-sm btn-note-quick" onclick="window.openQuickNoteModal('${apt.id}')" title="Görüşme notunu gir ve tamamla">
                  ${Icons.zap} Not Gir & Tamamla
                </button>
              ` : `
                <div style="display: inline-flex; align-items: center; gap: 6px;">
                  <span style="font-size: 0.8rem; font-weight: 600; color: var(--success); display: inline-flex; align-items: center; gap: 3px;">
                    ${Icons.check} Not Alındı
                  </span>
                  <button class="action-icon-btn" title="Danışan Çekmecesini Aç" onclick="window.openStudentDrawer('${student.id}')">
                    ${Icons.eye}
                  </button>
                </div>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }

    renderRecentNotesWidget();
    renderTasksWidget();
  }

  // ---------------- 2-COLUMN WIDGETS ----------------
  function renderRecentNotesWidget() {
    const notes = DataStore.getNotes().slice(0, 3);

    if (notes.length === 0) {
      elements.recentNotesList.innerHTML = `
        <div style="text-align: center; padding: 24px 10px; color: var(--text-muted); font-size: 0.82rem;">
          Henüz görüşme notu kaydedilmemiş.
        </div>
      `;
      return;
    }

    elements.recentNotesList.innerHTML = notes.map(note => {
      const student = DataStore.getStudentById(note.studentId) || { fullName: 'Bilinmeyen Danışan' };
      return `
        <div class="recent-note-item" onclick="window.openStudentDrawer('${note.studentId}')">
          <div class="recent-note-item-top">
            <span class="recent-note-student">${student.fullName}</span>
            <span class="recent-note-date">${note.date}</span>
          </div>
          <div style="font-weight: 600; font-size: 0.82rem; color: var(--text-main); margin-top: 2px;">
            ${note.title || 'Görüşme Notu'}
          </div>
          <div class="recent-note-preview">
            ${note.content || 'Açıklama girilmedi.'}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderTasksWidget() {
    const tasks = DataStore.getTasks();
    const completedCount = tasks.filter(t => t.completed).length;

    elements.tasksCounter.textContent = `${completedCount} / ${tasks.length} Tamamlandı`;
    if (tasks.length > 0 && completedCount === tasks.length) {
      elements.tasksCounter.className = 'badge badge-completed';
      elements.tasksCounter.textContent = `✓ ${completedCount} / ${tasks.length} Tamamlandı`;
    } else {
      elements.tasksCounter.className = 'badge badge-active';
    }

    if (tasks.length === 0) {
      elements.tasksList.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.82rem;">
          Tüm seans görevleri tamamlandı!
          <div style="margin-top: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="window.seedSampleTasks()" style="font-size: 0.75rem;">
              + Örnek Görevleri Ekle
            </button>
          </div>
        </div>
      `;
      return;
    }

    elements.tasksList.innerHTML = tasks.map(t => `
      <div class="task-item ${t.completed ? 'completed' : ''}" data-task-id="${t.id}">
        <label class="task-item-left">
          <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="window.toggleTaskItem('${t.id}')">
          <span class="task-text">${t.title}</span>
        </label>
        <button class="task-delete-btn" onclick="window.deleteTaskItem('${t.id}')" title="Görevi Sil">
          ${Icons.trash}
        </button>
      </div>
    `).join('');
  }

  window.toggleTaskItem = function(taskId) {
    DataStore.toggleTask(taskId);
    renderTasksWidget();
  };

  window.deleteTaskItem = function(taskId) {
    DataStore.deleteTask(taskId);
    renderTasksWidget();
  };

  window.seedSampleTasks = function() {
    DataStore.resetSampleTasks();
    renderTasksWidget();
    Notify.success('Örnek seans görevleri yüklendi.');
  };

  if (elements.btnSeedTasks) {
    elements.btnSeedTasks.addEventListener('click', () => {
      window.seedSampleTasks();
    });
  }

  if (elements.taskAddForm) {
    elements.taskAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = elements.taskNewInput.value.trim();
      if (!title) return;
      DataStore.addTask(title);
      elements.taskNewInput.value = '';
      renderTasksWidget();
      Notify.success('Yeni seans görevi eklendi.');
    });
  }

  // ---------------- EXPORT CSV ----------------
  function exportTodayAppointmentsToCsv() {
    const todayApts = DataStore.getTodayAppointments();
    const todayStr = formatDate(new Date());

    if (todayApts.length === 0) {
      Notify.warning('Bugün için indirilecek randevu bulunmuyor.');
      return;
    }

    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'Saat,Öğrenci Adı,Telefon,Görüşme Türü,Konu,Durum,Özet Not\n';

    todayApts.forEach(a => {
      const student = DataStore.getStudentById(a.studentId) || { fullName: 'Bilinmiyor', phone: '' };
      const row = [
        `"${a.time || ''}"`,
        `"${student.fullName.replace(/"/g, '""')}"`,
        `"${student.phone}"`,
        `"${(a.type || '').replace(/"/g, '""')}"`,
        `"${(a.topic || '').replace(/"/g, '""')}"`,
        `"${a.status}"`,
        `"${(a.summaryNote || '').replace(/"/g, '""')}"`
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bugunun_Randevulari_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Notify.success('Bugünün randevu listesi CSV olarak indirildi.');
  }

  if (elements.btnExportTodayCsv) {
    elements.btnExportTodayCsv.addEventListener('click', exportTodayAppointmentsToCsv);
  }

  // Fast Filter Buttons on Today Table
  elements.todayFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.todayFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.todayTableFilter = btn.dataset.todayFilter;
      renderDashboard();
    });
  });

  // ---------------- COMMAND PALETTE (SPOTLIGHT SEARCH CTRL + K) ----------------
  function openCommandPalette() {
    elements.paletteOverlay.classList.add('active');
    elements.paletteInput.value = '';
    renderPaletteResults('');
    setTimeout(() => elements.paletteInput.focus(), 50);
  }

  function closeCommandPalette() {
    elements.paletteOverlay.classList.remove('active');
  }

  function renderPaletteResults(query = '') {
    const q = query.trim().toLowerCase();
    const students = DataStore.getStudents(false);
    const appointments = DataStore.getTodayAppointments();

    let html = '';

    const commands = [
      { title: 'Yeni Randevu Planla', sub: 'Hızlıca danışan randevusu oluştur', icon: Icons.calendar, action: () => { closeCommandPalette(); window.openAppointmentModal(); } },
      { title: 'Yeni Danışan Ekle', sub: 'Sisteme yeni öğrenci/danışan kaydet', icon: Icons.users, action: () => { closeCommandPalette(); window.openStudentModal(); } },
      { title: 'Yeni Görüşme Notu Yaz', sub: 'Seans değerlendirmesi notu gir', icon: Icons.notes, action: () => { closeCommandPalette(); window.openEditNoteModal(); } },
      { title: 'Koyu / Açık Mod Değiştir', sub: 'Arayüz temasını değiştir', icon: Icons.sun, action: () => { closeCommandPalette(); applyTheme(state.theme === 'dark' ? 'light' : 'dark'); } },
      { title: 'Bugünün Randevularını CSV İndir', sub: 'Excel uyumlu döküm al', icon: Icons.download, action: () => { closeCommandPalette(); exportTodayAppointmentsToCsv(); } }
    ];

    const matchingCommands = commands.filter(c => !q || c.title.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q));

    if (matchingCommands.length > 0) {
      html += `<div class="palette-category-title">Hızlı İşlemler</div>`;
      matchingCommands.forEach((cmd, idx) => {
        html += `
          <div class="palette-item" onclick="window.executePaletteCmd(${idx})">
            <div class="palette-item-left">
              <span class="palette-item-icon">${cmd.icon}</span>
              <div>
                <div class="palette-item-title">${cmd.title}</div>
                <div class="palette-item-sub">${cmd.sub}</div>
              </div>
            </div>
            <span class="kbd-badge">Aksiyon</span>
          </div>
        `;
      });
      window._activePaletteCommands = matchingCommands;
    }

    const matchingStudents = students.filter(s =>
      !q || s.fullName.toLowerCase().includes(q) || s.phone.includes(q) || (s.category && s.category.toLowerCase().includes(q))
    ).slice(0, 5);

    if (matchingStudents.length > 0) {
      html += `<div class="palette-category-title">Öğrenciler & Danışanlar</div>`;
      matchingStudents.forEach(s => {
        html += `
          <div class="palette-item" onclick="closeCommandPalette(); window.openStudentDrawer('${s.id}')">
            <div class="palette-item-left">
              <span class="palette-item-icon">${Icons.users}</span>
              <div>
                <div class="palette-item-title">${s.fullName}</div>
                <div class="palette-item-sub">${s.phone} • ${s.category || 'Danışan'}</div>
              </div>
            </div>
            <span class="badge ${s.status === 'Aktif' ? 'badge-active' : 'badge-passive'}">${s.status}</span>
          </div>
        `;
      });
    }

    const matchingApts = appointments.filter(a => {
      const s = DataStore.getStudentById(a.studentId);
      const name = s ? s.fullName.toLowerCase() : '';
      return !q || name.includes(q) || (a.topic && a.topic.toLowerCase().includes(q));
    }).slice(0, 4);

    if (matchingApts.length > 0) {
      html += `<div class="palette-category-title">Bugünün Randevuları</div>`;
      matchingApts.forEach(a => {
        const s = DataStore.getStudentById(a.studentId);
        html += `
          <div class="palette-item" onclick="closeCommandPalette(); window.openQuickNoteModal('${a.id}')">
            <div class="palette-item-left">
              <span class="palette-item-icon">${Icons.clock}</span>
              <div>
                <div class="palette-item-title">${a.time} - ${s ? s.fullName : 'Danışan'}</div>
                <div class="palette-item-sub">${a.topic || 'Görüşme'} • ${a.type}</div>
              </div>
            </div>
            <span class="badge ${a.status === 'Tamamlandı' ? 'badge-completed' : 'badge-pending'}">${a.status}</span>
          </div>
        `;
      });
    }

    if (!html) {
      html = `
        <div style="text-align: center; padding: 32px 16px; color: var(--text-muted); font-size: 0.88rem;">
          "${query}" ile eşleşen sonuç bulunamadı.
        </div>
      `;
    }

    elements.paletteResults.innerHTML = html;
  }

  window.executePaletteCmd = function(idx) {
    if (window._activePaletteCommands && window._activePaletteCommands[idx]) {
      window._activePaletteCommands[idx].action();
    }
  };

  if (elements.headerSearchTrigger) {
    elements.headerSearchTrigger.addEventListener('click', openCommandPalette);
  }

  if (elements.paletteInput) {
    elements.paletteInput.addEventListener('input', (e) => {
      renderPaletteResults(e.target.value);
    });
  }

  if (elements.paletteOverlay) {
    elements.paletteOverlay.addEventListener('click', (e) => {
      if (e.target === elements.paletteOverlay) closeCommandPalette();
    });
  }

  const paletteCloseBadge = document.getElementById('palette-close-badge');
  if (paletteCloseBadge) {
    paletteCloseBadge.addEventListener('click', closeCommandPalette);
  }

  // ---------------- USER PROFILE DROPDOWN ----------------
  if (elements.userProfileBtn) {
    elements.userProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.userDropdownCard.classList.toggle('active');
    });
  }

  document.addEventListener('click', (e) => {
    if (elements.userDropdownCard && !elements.userDropdownCard.contains(e.target) && e.target !== elements.userProfileBtn) {
      elements.userDropdownCard.classList.remove('active');
    }
  });

  if (elements.menuItemProfile) {
    elements.menuItemProfile.addEventListener('click', () => {
      elements.userDropdownCard.classList.remove('active');
      Notify.info('Uzm. Psk. Canan Demir • DanışanPro Yönetici Hesabı', 'Danışman Profili');
    });
  }

  if (elements.menuItemExportAll) {
    elements.menuItemExportAll.addEventListener('click', () => {
      elements.userDropdownCard.classList.remove('active');
      exportTodayAppointmentsToCsv();
    });
  }

  if (elements.menuItemLogout) {
    elements.menuItemLogout.addEventListener('click', () => {
      elements.userDropdownCard.classList.remove('active');
      Notify.info('Oturum kapatma simülasyonu çalıştırıldı.');
    });
  }

  // ---------------- RENDER STUDENTS CRUD (TABLE & CARDS) ----------------
  function renderStudents() {
    let students = DataStore.getStudents(state.studentFilter === 'deleted');

    if (state.studentFilter === 'Aktif' || state.studentFilter === 'Pasif') {
      students = students.filter(s => s.status === state.studentFilter);
    }

    if (state.studentSearch.trim()) {
      const q = state.studentSearch.toLowerCase();
      students = students.filter(s =>
        s.fullName.toLowerCase().includes(q) ||
        (s.phone && s.phone.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.category && s.category.toLowerCase().includes(q))
      );
    }

    if (students.length === 0) {
      const emptyHtml = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">${Icons.users}</div>
          <div class="empty-title">Danışan Bulunamadı</div>
          <div class="empty-desc">Arama kriterlerinize uygun kayıt bulunamadı.</div>
          <button class="btn btn-primary btn-sm" onclick="window.openStudentModal()" style="margin-top: 8px;">
            ${Icons.plus} Yeni Danışan Ekle
          </button>
        </div>
      `;
      elements.studentsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 36px 16px;">${emptyHtml}</td></tr>`;
      elements.studentsCardGrid.innerHTML = emptyHtml;
      return;
    }

    // 1. Render Table View
    elements.studentsTableBody.innerHTML = students.map(student => {
      const isDeleted = student.isDeleted;
      const apts = DataStore.getAppointmentsByStudent(student.id);
      const notes = DataStore.getNotesByStudent(student.id);
      const waLink = getWhatsAppUrl(student.phone, student.fullName);

      return `
        <tr data-student-id="${student.id}" style="${isDeleted ? 'opacity: 0.6;' : ''}">
          <td>
            <div class="student-cell">
              <div class="avatar">${getInitials(student.fullName)}</div>
              <div>
                <div class="student-name" onclick="window.openStudentDrawer('${student.id}')">
                  ${student.fullName}
                  ${isDeleted ? '<span class="badge badge-cancelled" style="margin-left: 6px;">Silindi</span>' : ''}
                </div>
                <div class="student-phone-sub">
                  ${Icons.phone} <a href="tel:${student.phone}">${student.phone}</a>
                  <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="whatsapp-link" title="WhatsApp Mesajı">
                    ${Icons.whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge badge-type">${student.category || 'Genel'}</span>
          </td>
          <td>
            ${!isDeleted ? `
              <span class="badge ${student.status === 'Aktif' ? 'badge-active' : 'badge-passive'}"
                    style="cursor: pointer;"
                    onclick="window.toggleStudentStatus('${student.id}')"
                    title="Tıklayarak durumu değiştirin (Aktif / Pasif)">
                ${student.status}
              </span>
            ` : `
              <span class="badge badge-cancelled">Çöp Kutusu</span>
            `}
          </td>
          <td>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              <span>${apts.length} Randevu</span> • <span>${notes.length} Not</span>
            </div>
          </td>
          <td style="text-align: right;">
            <div class="table-actions">
              ${!isDeleted ? `
                <button class="action-icon-btn" title="Danışan Çekmecesini Aç" onclick="window.openStudentDrawer('${student.id}')">
                  ${Icons.eye}
                </button>
                <button class="action-icon-btn" title="Randevu Planla" onclick="window.openAppointmentModal(null, null, '${student.id}')">
                  ${Icons.calendar}
                </button>
                <button class="action-icon-btn" title="Düzenle" onclick="window.openStudentModal('${student.id}')">
                  ${Icons.edit}
                </button>
                <button class="action-icon-btn btn-delete" title="Sil (Soft Delete)" onclick="window.promptDeleteStudent('${student.id}')">
                  ${Icons.trash}
                </button>
              ` : `
                <button class="btn btn-sm btn-secondary" onclick="window.restoreStudent('${student.id}')" title="Geri Yükle">
                  ${Icons.refresh} Geri Yükle
                </button>
                <button class="action-icon-btn btn-delete" title="Kalıcı Sil" onclick="window.promptHardDeleteStudent('${student.id}')">
                  ${Icons.trash}
                </button>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // 2. Render Cards View
    elements.studentsCardGrid.innerHTML = students.map(student => {
      const isDeleted = student.isDeleted;
      const apts = DataStore.getAppointmentsByStudent(student.id);
      const notes = DataStore.getNotesByStudent(student.id);
      const waLink = getWhatsAppUrl(student.phone, student.fullName);

      return `
        <div class="student-grid-card">
          <div class="student-grid-card-top">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="avatar" style="width: 42px; height: 42px; font-size: 1rem;">
                ${getInitials(student.fullName)}
              </div>
              <div>
                <div class="student-name" style="font-size: 0.95rem;" onclick="window.openStudentDrawer('${student.id}')">
                  ${student.fullName}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${student.category || 'Danışan'}</div>
              </div>
            </div>
            <span class="badge ${student.status === 'Aktif' ? 'badge-active' : 'badge-passive'}">${student.status}</span>
          </div>

          <div style="font-size: 0.82rem; color: var(--text-body); background-color: var(--bg-subtle); padding: 8px 12px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              ${Icons.phone} <a href="tel:${student.phone}" style="text-decoration: none; color: inherit; font-weight: 500;">${student.phone}</a>
            </div>
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="whatsapp-link" title="WhatsApp Mesajı Gönder">
              ${Icons.whatsapp}
            </a>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>📅 ${apts.length} Randevu • 📝 ${notes.length} Not</span>
            <div style="display: flex; gap: 4px;">
              <button class="action-icon-btn" title="Danışan Çekmecesi" onclick="window.openStudentDrawer('${student.id}')">
                ${Icons.eye}
              </button>
              <button class="action-icon-btn" title="Randevu Ver" onclick="window.openAppointmentModal(null, null, '${student.id}')">
                ${Icons.calendar}
              </button>
              <button class="action-icon-btn" title="Düzenle" onclick="window.openStudentModal('${student.id}')">
                ${Icons.edit}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Switch between Table and Cards View for Students
  if (elements.btnStudentViewTable && elements.btnStudentViewCards) {
    elements.btnStudentViewTable.addEventListener('click', () => {
      elements.btnStudentViewTable.classList.add('active');
      elements.btnStudentViewCards.classList.remove('active');
      elements.studentsTableWrapper.style.display = 'block';
      elements.studentsCardGrid.style.display = 'none';
      state.studentViewMode = 'table';
    });

    elements.btnStudentViewCards.addEventListener('click', () => {
      elements.btnStudentViewCards.classList.add('active');
      elements.btnStudentViewTable.classList.remove('active');
      elements.studentsTableWrapper.style.display = 'none';
      elements.studentsCardGrid.style.display = 'grid';
      state.studentViewMode = 'cards';
    });
  }

  // ---------------- RENDER APPOINTMENTS CRUD ----------------
  function renderAppointments() {
    let appointments = DataStore.getAppointments();
    const todayStr = formatDate(new Date());

    if (state.appointmentFilter === 'today') {
      appointments = appointments.filter(a => a.date === todayStr);
    } else if (state.appointmentFilter === 'upcoming') {
      appointments = appointments.filter(a => a.date >= todayStr && a.status === 'Bekliyor');
    } else if (state.appointmentFilter === 'completed') {
      appointments = appointments.filter(a => a.status === 'Tamamlandı');
    }

    if (state.appointmentSearch.trim()) {
      const q = state.appointmentSearch.toLowerCase();
      appointments = appointments.filter(a => {
        const student = DataStore.getStudentById(a.studentId);
        const name = student ? student.fullName.toLowerCase() : '';
        const topic = (a.topic || '').toLowerCase();
        return name.includes(q) || topic.includes(q);
      });
    }

    appointments.sort((a, b) => {
      const dateDiff = b.date.localeCompare(a.date);
      if (dateDiff !== 0) return dateDiff;
      return (b.time || '').localeCompare(a.time || '');
    });

    if (appointments.length === 0) {
      elements.appointmentsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 36px 16px;">
            <div class="empty-state">
              <div class="empty-icon">${Icons.calendar}</div>
              <div class="empty-title">Randevu Bulunamadı</div>
              <div class="empty-desc">Seçili kriterlerde randevu kaydı mevcut değil.</div>
              <button class="btn btn-primary btn-sm" onclick="window.openAppointmentModal()" style="margin-top: 8px;">
                ${Icons.plus} Randevu Planla
              </button>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    elements.appointmentsTableBody.innerHTML = appointments.map(apt => {
      const student = DataStore.getStudentById(apt.studentId) || { fullName: 'Bilinmeyen Danışan', phone: '' };
      const isCompleted = apt.status === 'Tamamlandı';
      const isCancelled = apt.status === 'İptal';

      let rowClass = 'row-status-pending';
      let statusBadge = `<span class="badge badge-pending">Bekliyor</span>`;

      if (isCompleted) {
        rowClass = 'row-status-completed';
        statusBadge = `<span class="badge badge-completed">Tamamlandı</span>`;
      } else if (isCancelled) {
        rowClass = 'row-status-cancelled';
        statusBadge = `<span class="badge badge-cancelled">İptal</span>`;
      }

      let meetingLinkHtml = '';
      if (apt.type && apt.type.includes('Zoom')) {
        meetingLinkHtml = `<a href="https://zoom.us/join" target="_blank" rel="noopener noreferrer" class="meeting-link-chip" title="Zoom Toplantısına Git">${Icons.externalLink} Bağlantı</a>`;
      } else if (apt.type && apt.type.includes('Meet')) {
        meetingLinkHtml = `<a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer" class="meeting-link-chip" title="Google Meet Toplantısına Git">${Icons.externalLink} Bağlantı</a>`;
      }

      const waLink = getWhatsAppUrl(student.phone, student.fullName, apt.topic);

      return `
        <tr class="${rowClass}">
          <td>
            <div style="font-weight: 600; color: var(--text-main); font-size: 0.85rem;">${apt.date}</div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--primary);">
              ${apt.time || '10:00'}
            </div>
          </td>
          <td>
            <div class="student-cell">
              <div class="avatar">${getInitials(student.fullName)}</div>
              <div>
                <div class="student-name" onclick="window.openStudentDrawer('${student.id}')">${student.fullName}</div>
                <div class="student-phone-sub">
                  ${Icons.phone} <a href="tel:${student.phone}">${student.phone}</a>
                  <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="whatsapp-link" title="WhatsApp Mesajı">
                    ${Icons.whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div style="display: inline-flex; align-items: center;">
              <span class="badge badge-type">${apt.type || 'Online'}</span>
              ${meetingLinkHtml}
            </div>
          </td>
          <td>
            <div style="font-size: 0.85rem; color: var(--text-main);">${apt.topic || 'Genel Değerlendirme'}</div>
          </td>
          <td>
            ${statusBadge}
          </td>
          <td style="text-align: right;">
            <div class="table-actions">
              ${!isCompleted ? `
                <button class="btn btn-sm btn-note-quick" onclick="window.openQuickNoteModal('${apt.id}')" title="Not gir ve tamamla">
                  ${Icons.zap} Not Gir
                </button>
              ` : `
                <button class="action-icon-btn" title="Danışan Çekmecesi" onclick="window.openStudentDrawer('${student.id}')">
                  ${Icons.eye}
                </button>
              `}
              <button class="action-icon-btn" title="Düzenle" onclick="window.openAppointmentModal('${apt.id}')">
                ${Icons.edit}
              </button>
              <button class="action-icon-btn btn-delete" title="Sil" onclick="window.promptDeleteAppointment('${apt.id}')">
                ${Icons.trash}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ---------------- RENDER NOTES GRID (CRUD) ----------------
  function renderNotes() {
    let notes = DataStore.getNotes();

    if (state.noteFilterStudentId && state.noteFilterStudentId !== 'all') {
      notes = notes.filter(n => n.studentId === state.noteFilterStudentId);
    }

    if (state.noteSearch.trim()) {
      const q = state.noteSearch.toLowerCase();
      notes = notes.filter(n => {
        const student = DataStore.getStudentById(n.studentId);
        const name = student ? student.fullName.toLowerCase() : '';
        const title = (n.title || '').toLowerCase();
        const content = (n.content || '').toLowerCase();
        const actions = (n.actionItems || '').toLowerCase();
        return name.includes(q) || title.includes(q) || content.includes(q) || actions.includes(q);
      });
    }

    if (notes.length === 0) {
      elements.notesGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 40px 16px;">
          <div class="empty-icon">${Icons.notes}</div>
          <div class="empty-title">Kayıtlı Görüşme Notu Bulunamadı</div>
          <div class="empty-desc">Henüz bir görüşme notu eklenmedi veya aramanızla eşleşen not yok.</div>
          <button class="btn btn-primary btn-sm" onclick="window.openEditNoteModal()" style="margin-top: 8px;">
            ${Icons.plus} Yeni Not Yaz
          </button>
        </div>
      `;
      return;
    }

    elements.notesGrid.innerHTML = notes.map(note => {
      const student = DataStore.getStudentById(note.studentId) || { fullName: 'Bilinmeyen Danışan' };

      return `
        <div class="note-card" data-note-id="${note.id}">
          <div>
            <div class="note-card-header">
              <div>
                <div class="note-title">${note.title || 'Görüşme Notu'}</div>
                <div style="font-size: 0.8rem; font-weight: 600; color: var(--primary); cursor: pointer; margin-top: 2px;" onclick="window.openStudentDrawer('${student.id}')">
                  ${student.fullName}
                </div>
              </div>
              <div class="note-date">${note.date}</div>
            </div>

            <div class="note-body">${note.content || 'Açıklama girilmedi.'}</div>

            ${note.actionItems ? `
              <div class="note-actions-section">
                <strong>Kararlar / Ödev:</strong> ${note.actionItems}
              </div>
            ` : ''}
          </div>

          <div class="note-footer">
            <span>${note.appointmentId ? 'Randevulu Görüşme' : 'Müstakil Not'}</span>

            <div style="display: flex; gap: 6px;">
              <button class="action-icon-btn" title="Düzenle" onclick="window.openEditNoteModal('${note.id}')">
                ${Icons.edit}
              </button>
              <button class="action-icon-btn btn-delete" title="Sil" onclick="window.promptDeleteNote('${note.id}')">
                ${Icons.trash}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Print Notes
  if (elements.btnPrintNotesView) {
    elements.btnPrintNotesView.addEventListener('click', () => {
      window.print();
    });
  }

  // Master Render
  function renderAll() {
    populateStudentSelects();
    renderDashboard();
    renderStudents();
    renderAppointments();
    renderNotes();
  }

  // ---------------- STUDENT CRUD HANDLERS ----------------
  window.openStudentModal = function(studentId = null) {
    elements.studentForm.reset();
    document.getElementById('student-id-field').value = '';

    if (studentId) {
      const student = DataStore.getStudentById(studentId);
      if (!student) return;
      elements.modalStudentTitle.textContent = 'Danışan Bilgilerini Düzenle';
      document.getElementById('student-id-field').value = student.id;
      document.getElementById('student-fullname').value = student.fullName;
      document.getElementById('student-phone').value = student.phone;
      document.getElementById('student-email').value = student.email || '';
      document.getElementById('student-category').value = student.category || '';
      document.getElementById('student-notes').value = student.notes || '';

      const statusRadio = elements.studentForm.querySelector(`input[name="student-status"][value="${student.status}"]`);
      if (statusRadio) statusRadio.checked = true;
    } else {
      elements.modalStudentTitle.textContent = 'Yeni Danışan Ekle';
      const defaultActive = elements.studentForm.querySelector('input[name="student-status"][value="Aktif"]');
      if (defaultActive) defaultActive.checked = true;
    }

    openModal(elements.modalStudent);
  };

  elements.studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('student-id-field').value;
    const fullName = document.getElementById('student-fullname').value.trim();
    const phone = document.getElementById('student-phone').value.trim();
    const email = document.getElementById('student-email').value.trim();
    const category = document.getElementById('student-category').value.trim();
    const notes = document.getElementById('student-notes').value.trim();
    const statusRadio = elements.studentForm.querySelector('input[name="student-status"]:checked');
    const status = statusRadio ? statusRadio.value : 'Aktif';

    if (!fullName || !phone) {
      Notify.error('Lütfen Ad-Soyad ve Telefon alanlarını doldurun.');
      return;
    }

    if (id) {
      DataStore.updateStudent(id, { fullName, phone, email, category, notes, status });
      Notify.success(`${fullName} bilgileri güncellendi.`);
    } else {
      DataStore.addStudent({ fullName, phone, email, category, notes, status });
      Notify.success(`"${fullName}" başarıyla eklendi.`);
    }

    closeModal(elements.modalStudent);
    renderAll();
  });

  window.toggleStudentStatus = function(studentId) {
    const student = DataStore.getStudentById(studentId);
    if (!student) return;
    const newStatus = student.status === 'Aktif' ? 'Pasif' : 'Aktif';
    DataStore.updateStudent(studentId, { status: newStatus });
    Notify.info(`${student.fullName} durumu "${newStatus}" yapıldı.`);
    renderAll();
  };

  window.promptDeleteStudent = function(studentId) {
    const student = DataStore.getStudentById(studentId);
    if (!student) return;

    showConfirm(
      'Danışanı Sil',
      `"${student.fullName}" adlı danışanı silmek istediğinize emin misiniz? Danışan çöp kutusuna taşınacaktır.`,
      () => {
        DataStore.deleteStudent(studentId, false);
        Notify.warning(`"${student.fullName}" çöp kutusuna taşındı.`);
        renderAll();
      }
    );
  };

  window.promptHardDeleteStudent = function(studentId) {
    const student = DataStore.getStudentById(studentId);
    if (!student) return;

    showConfirm(
      'Kalıcı Olarak Sil',
      `"${student.fullName}" kaydı kalıcı olarak silinecektir. Bu işlem geri alınamaz!`,
      () => {
        DataStore.deleteStudent(studentId, true);
        Notify.error(`"${student.fullName}" kalıcı olarak silindi.`);
        renderAll();
      }
    );
  };

  window.restoreStudent = function(studentId) {
    const student = DataStore.getStudentById(studentId);
    DataStore.restoreStudent(studentId);
    Notify.success(`"${student ? student.fullName : 'Danışan'}" geri yüklendi.`);
    renderAll();
  };

  // ---------------- APPOINTMENTS CRUD HANDLERS ----------------
  window.openAppointmentModal = function(aptId = null, prefilledDate = null, prefilledStudentId = null) {
    elements.appointmentForm.reset();
    document.getElementById('apt-id-field').value = '';
    populateStudentSelects();

    const todayStr = formatDate(new Date());

    if (aptId) {
      const apt = DataStore.getAppointmentById(aptId);
      if (!apt) return;
      elements.modalAppointmentTitle.textContent = 'Randevu Bilgilerini Düzenle';
      document.getElementById('apt-id-field').value = apt.id;
      document.getElementById('apt-student-id').value = apt.studentId;
      document.getElementById('apt-date').value = apt.date;
      document.getElementById('apt-time').value = apt.time;
      document.getElementById('apt-type').value = apt.type;
      document.getElementById('apt-topic').value = apt.topic || '';
      document.getElementById('apt-status').value = apt.status || 'Bekliyor';
    } else {
      elements.modalAppointmentTitle.textContent = 'Randevu Planla';
      document.getElementById('apt-date').value = prefilledDate || todayStr;
      document.getElementById('apt-time').value = '11:00';
      document.getElementById('apt-status').value = 'Bekliyor';
      if (prefilledStudentId) {
        document.getElementById('apt-student-id').value = prefilledStudentId;
      }
    }

    openModal(elements.modalAppointment);
  };

  elements.appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('apt-id-field').value;
    const studentId = document.getElementById('apt-student-id').value;
    const date = document.getElementById('apt-date').value;
    const time = document.getElementById('apt-time').value;
    const type = document.getElementById('apt-type').value;
    const topic = document.getElementById('apt-topic').value.trim();
    const status = document.getElementById('apt-status').value;

    if (!studentId || !date || !time) {
      Notify.error('Lütfen Öğrenci, Tarih ve Saat alanlarını eksiksiz doldurun.');
      return;
    }

    const student = DataStore.getStudentById(studentId);
    const studentName = student ? student.fullName : 'Danışan';

    if (id) {
      DataStore.updateAppointment(id, { studentId, date, time, type, topic, status });
      Notify.success(`${studentName} randevusu güncellendi.`);
    } else {
      DataStore.addAppointment({ studentId, date, time, type, topic, status });
      Notify.success(`${studentName} için ${date} ${time} saatine randevu planlandı.`);
    }

    closeModal(elements.modalAppointment);
    renderAll();
  });

  window.promptDeleteAppointment = function(aptId) {
    const apt = DataStore.getAppointmentById(aptId);
    if (!apt) return;
    const student = DataStore.getStudentById(apt.studentId);

    showConfirm(
      'Randevuyu Sil',
      `${student ? student.fullName : 'Danışan'} için planlanmış ${apt.date} ${apt.time} randevusunu silmek istediğinize emin misiniz?`,
      () => {
        DataStore.deleteAppointment(aptId);
        Notify.info('Randevu silindi.');
        renderAll();
      }
    );
  };

  // ---------------- TEK TIKLA ÖZET NOTU & HAZIR ŞABLONLAR ----------------
  window.openQuickNoteModal = function(aptId) {
    const apt = DataStore.getAppointmentById(aptId);
    if (!apt) return;
    const student = DataStore.getStudentById(apt.studentId);

    elements.quickNoteForm.reset();
    document.getElementById('quick-note-apt-id').value = apt.id;
    elements.quickNoteStudentName.textContent = student ? student.fullName : 'Danışan';
    elements.quickNoteAppointmentTime.textContent = `${apt.date} • ${apt.time || '10:00'}`;
    elements.quickNoteTopic.textContent = apt.topic || 'Genel Değerlendirme';

    document.getElementById('quick-note-title').value = `${apt.topic || 'Görüşme'} Değerlendirmesi`;
    document.getElementById('quick-note-rating').value = '5';

    openModal(elements.modalQuickNote);
  };

  // Quick Templates Handler
  document.querySelectorAll('.template-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const templateType = btn.dataset.template;
      const contentField = document.getElementById('quick-note-content');
      const actionsField = document.getElementById('quick-note-actions');

      if (templateType === 'general') {
        contentField.value = `Seans Konusu: TYT-AYT Deneme Analizi\nDanışanın Durumu: Motivasyonu yüksek, haftalık soru hedefine yaklaştı.\nGözlemler: Matematik netlerinde belirgin artış var, geometri tekrar edilmeli.\nSonraki Seans Odak Noktası: Zaman yönetimi ve süre tutarak soru çözümü.`;
        actionsField.value = `1. Matematik branş denemesi çözülecek (2 adet)\n2. Geometri üçgenler fasikülü tamamlanacak`;
      } else if (templateType === 'homework') {
        contentField.value = `Verilen Görev / Kaynak: Karekök Geometri 3 Test + Paragraf 40 soru/gün\nHedef Soru Sayısı: Haftalık 350 soru hedefi verildi.\nTeslim Tarihi: Gelecek seans gününe kadar teslim edilecek.\nKontrol Yöntemi: Soru takip çizelgesi üzerinden kontrol edilecek.`;
        actionsField.value = `1. Günlük 40 paragraf sorusu\n2. Cuma gününe kadar soru çizelgesi teslimi`;
      } else if (templateType === 'goal') {
        contentField.value = `Kısa Vadeli Hedef: Matematik netlerini 25+ üzerine sabitlemek.\nUzun Vadeli Hedef: İlk 15.000 sıralama ve hedef mühendislik fakültesi.\nAksiyon Adımları: Haftada 2 branş denemesi ve eksik konu analizi.\nTakip Kriteri: Deneme karnesi üzerinden haftalık kontrol.`;
        actionsField.value = `1. Hedef çizelgesi çalışma masasına asılacak\n2. Haftalık net grafiği güncellenecek`;
      }

      Notify.info(`"${btn.textContent.trim()}" şablonu yerleştirildi.`);
    });
  });

  elements.quickNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const aptId = document.getElementById('quick-note-apt-id').value;
    const title = document.getElementById('quick-note-title').value.trim();
    const content = document.getElementById('quick-note-content').value.trim();
    const actionItems = document.getElementById('quick-note-actions').value.trim();
    const rating = document.getElementById('quick-note-rating').value;

    if (!content) {
      Notify.error('Lütfen görüşme özeti girin.');
      return;
    }

    const result = DataStore.completeAppointmentWithNote(aptId, {
      title,
      content,
      actionItems,
      rating
    });

    if (result) {
      const student = DataStore.getStudentById(result.appointment.studentId);
      Notify.success(
        `Görüşme notu kaydedildi ve ${student ? student.fullName : 'danışan'} randevusu tamamlandı.`,
        'Başarılı'
      );
      closeModal(elements.modalQuickNote);
      renderAll();
    }
  });

  // ---------------- NOTES CRUD HANDLERS ----------------
  window.openEditNoteModal = function(noteId = null) {
    elements.editNoteForm.reset();
    document.getElementById('edit-note-id-field').value = '';
    populateStudentSelects();

    const titleEl = document.getElementById('modal-edit-note-title');

    if (noteId) {
      const note = DataStore.getNoteById(noteId);
      if (!note) return;
      titleEl.textContent = 'Görüşme Notunu Düzenle';
      document.getElementById('edit-note-id-field').value = note.id;
      document.getElementById('edit-note-student-id').value = note.studentId;
      document.getElementById('edit-note-title').value = note.title || '';
      document.getElementById('edit-note-content').value = note.content || '';
      document.getElementById('edit-note-actions').value = note.actionItems || '';
      document.getElementById('edit-note-rating').value = note.rating || 5;
    } else {
      titleEl.textContent = 'Yeni Görüşme Notu';
      document.getElementById('edit-note-rating').value = 5;
    }

    openModal(elements.modalEditNote);
  };

  elements.editNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-note-id-field').value;
    const studentId = document.getElementById('edit-note-student-id').value;
    const title = document.getElementById('edit-note-title').value.trim();
    const content = document.getElementById('edit-note-content').value.trim();
    const actionItems = document.getElementById('edit-note-actions').value.trim();
    const rating = document.getElementById('edit-note-rating').value;

    if (!studentId || !content) {
      Notify.error('Lütfen Danışan seçin ve Not içeriğini doldurun.');
      return;
    }

    if (id) {
      DataStore.updateNote(id, { studentId, title, content, actionItems, rating });
      Notify.success('Görüşme notu güncellendi.');
    } else {
      DataStore.addNote({ studentId, title, content, actionItems, rating });
      Notify.success('Yeni görüşme notu kaydedildi.');
    }

    closeModal(elements.modalEditNote);
    renderAll();
  });

  window.promptDeleteNote = function(noteId) {
    showConfirm(
      'Notu Sil',
      'Bu görüşme notunu silmek istediğinize emin misiniz?',
      () => {
        DataStore.deleteNote(noteId);
        Notify.info('Görüşme notu silindi.');
        renderAll();
      }
    );
  };

  // ---------------- SLIDE-OVER PROFILE DRAWER ----------------
  window.openStudentDrawer = function(studentId) {
    const student = DataStore.getStudentById(studentId);
    if (!student) return;

    state.activeStudentDetailId = studentId;
    const apts = DataStore.getAppointmentsByStudent(studentId);
    const notes = DataStore.getNotesByStudent(studentId);
    const waLink = getWhatsAppUrl(student.phone, student.fullName);

    elements.drawerStudentName.textContent = student.fullName;
    elements.drawerStudentCategory.textContent = student.category || 'Danışan';

    elements.drawerStudentContent.innerHTML = `
      <!-- Profile Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div class="avatar" style="width: 52px; height: 52px; font-size: 1.2rem;">
            ${getInitials(student.fullName)}
          </div>
          <div>
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-main);">${student.fullName}</div>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
              <span class="badge ${student.status === 'Aktif' ? 'badge-active' : 'badge-passive'}">${student.status}</span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">${student.category || 'Danışan'}</span>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-sm btn-secondary" onclick="window.closeStudentDrawer(); window.openStudentModal('${student.id}')">
            Düzenle
          </button>
          <button class="btn btn-sm btn-primary" onclick="window.closeStudentDrawer(); window.openAppointmentModal(null, null, '${student.id}')">
            ${Icons.plus} Randevu
          </button>
        </div>
      </div>

      <!-- Contact Info with WhatsApp -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div style="background-color: var(--bg-subtle); padding: 10px 12px; border-radius: var(--radius-md);">
          <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">TELEFON & WHATSAPP</div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
            <a href="tel:${student.phone}" style="font-size: 0.85rem; font-weight: 600; color: var(--text-main); text-decoration: none;">📞 ${student.phone}</a>
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="whatsapp-link" title="WhatsApp Mesajı Gönder">
              ${Icons.whatsapp}
            </a>
          </div>
        </div>
        <div style="background-color: var(--bg-subtle); padding: 10px 12px; border-radius: var(--radius-md);">
          <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">E-POSTA</div>
          <div style="font-size: 0.82rem; margin-top: 4px; color: var(--text-main);">${student.email || 'Belirtilmedi'}</div>
        </div>
      </div>

      ${student.notes ? `
        <div style="background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 12px 14px;">
          <div style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Özel Danışan Hedef & Notları</div>
          <p style="font-size: 0.84rem; color: var(--text-body); margin-top: 3px;">${student.notes}</p>
        </div>
      ` : ''}

      <!-- Past Notes Timeline -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main);">📝 Seans Notları (${notes.length})</h4>
          <button class="btn btn-secondary btn-sm" onclick="window.closeStudentDrawer(); window.openEditNoteModal();" style="font-size: 0.72rem;">
            + Not Ekle
          </button>
        </div>
        ${notes.length === 0 ? `
          <div style="text-align: center; padding: 16px; color: var(--text-muted); font-size: 0.82rem; background: var(--bg-subtle); border-radius: var(--radius-md);">
            Henüz görüşme notu bulunmuyor.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px; max-height: 260px; overflow-y: auto;">
            ${notes.map(n => `
              <div style="background-color: var(--bg-subtle); padding: 10px 14px; border-radius: var(--radius-md); border-left: 3px solid var(--primary);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: var(--text-main); font-size: 0.88rem;">${n.title}</strong>
                  <span style="font-size: 0.72rem; color: var(--text-subtle); font-family: var(--font-mono);">${n.date}</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-body); margin-top: 4px;">${n.content}</p>
                ${n.actionItems ? `<div style="font-size: 0.78rem; color: var(--primary); font-weight: 600; margin-top: 4px;">Ödev / Kararlar: ${n.actionItems}</div>` : ''}
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Past Appointments -->
      <div>
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px;">📅 Randevu Geçmişi (${apts.length})</h4>
        ${apts.length === 0 ? `
          <div style="text-align: center; padding: 16px; color: var(--text-muted); font-size: 0.82rem; background: var(--bg-subtle); border-radius: var(--radius-md);">
            Kayıtlı randevu bulunmuyor.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${apts.map(a => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-subtle); border-radius: var(--radius-md);">
                <div>
                  <span style="font-weight: 600; font-family: var(--font-mono); font-size: 0.82rem; color: var(--primary);">${a.date} ${a.time}</span>
                  <span style="font-size: 0.82rem; margin-left: 6px; color: var(--text-main);">${a.topic || 'Görüşme'}</span>
                </div>
                <span class="badge ${a.status === 'Tamamlandı' ? 'badge-completed' : (a.status === 'Bekliyor' ? 'badge-pending' : 'badge-cancelled')}">${a.status}</span>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    elements.studentDrawerOverlay.classList.add('active');
  };

  window.closeStudentDrawer = function() {
    if (elements.studentDrawerOverlay) {
      elements.studentDrawerOverlay.classList.remove('active');
    }
  };

  if (elements.drawerCloseBtn) {
    elements.drawerCloseBtn.addEventListener('click', window.closeStudentDrawer);
  }

  if (elements.studentDrawerOverlay) {
    elements.studentDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === elements.studentDrawerOverlay) {
        window.closeStudentDrawer();
      }
    });
  }

  // ---------------- EVENT LISTENERS ----------------

  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  if (elements.mobileMenuBtn) {
    elements.mobileMenuBtn.addEventListener('click', () => {
      elements.sidebar.classList.toggle('open');
    });
  }

  elements.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) window.switchView(view);
    });
  });

  if (elements.studentSearchInput) {
    elements.studentSearchInput.addEventListener('input', (e) => {
      state.studentSearch = e.target.value;
      renderStudents();
    });
  }

  if (elements.studentStatusFilter) {
    elements.studentStatusFilter.addEventListener('change', (e) => {
      state.studentFilter = e.target.value;
      renderStudents();
    });
  }

  if (elements.appointmentSearchInput) {
    elements.appointmentSearchInput.addEventListener('input', (e) => {
      state.appointmentSearch = e.target.value;
      renderAppointments();
    });
  }

  elements.appointmentStatusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.appointmentStatusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.appointmentFilter = tab.dataset.filter;
      renderAppointments();
    });
  });

  if (elements.noteSearchInput) {
    elements.noteSearchInput.addEventListener('input', (e) => {
      state.noteSearch = e.target.value;
      renderNotes();
    });
  }

  if (elements.noteStudentFilter) {
    elements.noteStudentFilter.addEventListener('change', (e) => {
      state.noteFilterStudentId = e.target.value;
      renderNotes();
    });
  }

  const btnResetData = document.getElementById('btn-reset-demo-data');
  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      showConfirm(
        'Örnek Verileri Yükle',
        'Tüm mevcut veriler sıfırlanıp zengin örnek danışanlar, randevular ve görüşme notları yeniden yüklenecektir.',
        () => {
          DataStore.resetToDefault();
          Notify.success('Örnek veriler başarıyla yüklendi.');
          renderAll();
        }
      );
    });
  }

  // Hotkeys
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (elements.paletteOverlay.classList.contains('active')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === 'Escape') {
      if (elements.paletteOverlay.classList.contains('active')) {
        closeCommandPalette();
      }
      if (elements.studentDrawerOverlay && elements.studentDrawerOverlay.classList.contains('active')) {
        window.closeStudentDrawer();
      }
    }
  });

  // Startup
  injectStaticIcons();
  applyTheme(state.theme);
  renderTodayDateHeader();
  renderAll();
});
