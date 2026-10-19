/**
 * Toast Notification System
 * DanışanPro & Öğrenci Yönetim Paneli
 */

const Notify = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success', title = '') {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;

    let icon = '✓';
    let defaultTitle = 'Başarılı';

    if (type === 'error') {
      icon = '✕';
      defaultTitle = 'Hata';
    } else if (type === 'warning') {
      icon = '⚠';
      defaultTitle = 'Dikkat';
    } else if (type === 'info') {
      icon = 'ℹ';
      defaultTitle = 'Bilgi';
    }

    const toastTitle = title || defaultTitle;

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${toastTitle}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Kapat">&times;</button>
    `;

    // Close on button click
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.dismiss(toast);
    });

    this.container.appendChild(toast);

    // Auto dismiss after 4 seconds
    const timer = setTimeout(() => {
      this.dismiss(toast);
    }, 4200);

    toast.dataset.timer = timer;
  },

  dismiss(toast) {
    if (!toast || toast.classList.contains('dismissing')) return;
    toast.classList.add('dismissing');
    if (toast.dataset.timer) clearTimeout(Number(toast.dataset.timer));
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  },

  success(msg, title) { this.show(msg, 'success', title); },
  error(msg, title) { this.show(msg, 'error', title); },
  warning(msg, title) { this.show(msg, 'warning', title); },
  info(msg, title) { this.show(msg, 'info', title); }
};

window.Notify = Notify;
