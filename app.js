// ============================================
// EduElite Student Portal — app.js
// ============================================

// ---- SECTION NAVIGATION ----
function showSection(id, navEl) {
  // hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // show target
  const target = document.getElementById('section-' + id);
  if (target) {
    target.classList.add('active');
    // restart animation
    target.style.animation = 'none';
    target.offsetHeight;
    target.style.animation = '';
  }
  // update nav links
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  // update sidebar links
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  // scroll to content
  document.querySelector('.main-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // re-trigger scroll reveal for newly visible section
  setTimeout(observeRevealElements, 80);
}

// ---- HAMBURGER MENU ----
function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, isFloat, duration = 1400) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = isFloat ? current.toFixed(2) : Math.floor(current);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(2) : target;
  };
  requestAnimationFrame(update);
}

// ---- INIT COUNTERS ----
function initCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const raw = el.getAttribute('data-target');
    const isFloat = raw.includes('.');
    const target = parseFloat(raw);
    animateCounter(el, target, isFloat);
  });
}

// ---- INTERSECTION OBSERVER for stat cards ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      initCounters();
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) observer.observe(statsGrid);

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function observeRevealElements() {
  document.querySelectorAll('.reveal').forEach(el => {
    // Reset if already visible so re-entering a section re-animates
    el.classList.remove('visible');
    revealObserver.observe(el);
  });
}

// ---- NAVBAR SCROLL EFFECT ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 40) {
    nav.style.background = 'rgba(5,5,5,0.97)';
    nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
  } else {
    nav.style.background = 'rgba(8,8,8,0.9)';
    nav.style.boxShadow = 'none';
  }
});

// ---- NOTIFICATION BUTTON ----
document.getElementById('btn-notification')?.addEventListener('click', () => {
  const badge = document.querySelector('.notif-badge');
  if (badge) {
    badge.style.transform = 'scale(1.4)';
    badge.style.transition = 'transform 0.2s ease';
    setTimeout(() => {
      badge.style.transform = 'scale(1)';
      badge.textContent = '0';
      badge.style.background = '#555';
    }, 600);
    showToast('All notifications marked as read ✓');
  }
});

// ---- TOAST NOTIFICATION ----
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
    background: rgba(20,18,12,0.95);
    border: 1px solid rgba(212,175,55,0.4);
    color: #D4AF37;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    font-size: 0.82rem;
    font-family: 'Inter', sans-serif;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    animation: toastIn 0.3s ease;
    cursor: pointer;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(16px); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);

  toast.addEventListener('click', () => {
    toast.style.animation = 'toastOut 0.25s ease forwards';
    setTimeout(() => toast.remove(), 300);
  });

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'toastOut 0.25s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, 3500);
}

// ---- COURSE CARD HOVER RIPPLE ----
document.querySelectorAll('.course-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'transform 0.25s cubic-bezier(0.4,0,0.2,1), border-color 0.25s, box-shadow 0.25s';
  });
});

// ---- STAT CARD CLICK RIPPLE ----
document.querySelectorAll('.stat-card').forEach(card => {
  card.addEventListener('click', function () {
    this.style.transform = 'scale(0.96)';
    setTimeout(() => this.style.transform = '', 150);
  });
});

// ---- RIPPLE EFFECT ----
function attachRipple(el) {
  el.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    this.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  });
}

document.querySelectorAll('.ripple-btn').forEach(attachRipple);

// ---- INITIAL PAGE LOAD ----
window.addEventListener('DOMContentLoaded', () => {
  // Show dashboard by default
  showSection('dashboard', document.querySelector('.nav-link.active'));

  // Trigger stat animation after short delay
  setTimeout(initCounters, 400);

  // Init scroll reveal
  observeRevealElements();

  // Greet with toast
  setTimeout(() => showToast('Welcome back, Alexander 👋'), 800);

  // Auto-fetch attendance if credentials exist
  const savedRedgNo = localStorage.getItem('att_redgno');
  const savedPass = localStorage.getItem('att_password');
  if (savedRedgNo && savedPass) {
    document.getElementById('att-redgno').value = savedRedgNo;
    document.getElementById('att-password').value = savedPass;
    // Optional: Auto fetch on load
    // fetchRealAttendance(savedRedgNo, savedPass, true);
  }
});

// ==== ATTENDANCE INTEGRATION ====

function openAttendanceModal() {
  const modal = document.getElementById('attendance-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

function closeAttendanceModal() {
  const modal = document.getElementById('attendance-modal');
  if (modal) {
    modal.classList.remove('open');
    document.getElementById('att-error').textContent = '';
  }
}

async function fetchRealAttendance(rNo, pass, isSilent = false) {
  const redgnoInput = document.getElementById('att-redgno');
  const passInput = document.getElementById('att-password');
  const errorEl = document.getElementById('att-error');
  const btn = document.getElementById('btn-fetch-attendance');

  const redgNo = rNo || redgnoInput.value.trim();
  const password = pass || passInput.value.trim();

  if (!redgNo || !password) {
    if (!isSilent) errorEl.textContent = 'Please enter both fields.';
    return;
  }

  if (!isSilent) {
    btn.textContent = 'Fetching...';
    btn.disabled = true;
    errorEl.textContent = '';
  }

  try {
    const targetUrl = 'https://attendancetracker-six.vercel.app/api/render/attendance';
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(targetUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ redgNo, password })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if valid data
    if (data && data.attendance_data) {
      // Save credentials
      localStorage.setItem('att_redgno', redgNo);
      localStorage.setItem('att_password', password);

      updateAttendanceUI(data);
      
      if (!isSilent) {
        closeAttendanceModal();
        showToast('Attendance fetched successfully! ✓');
      }
    } else {
      throw new Error('Invalid credentials or data structure.');
    }
  } catch (err) {
    console.error("Attendance fetch error:", err);
    if (!isSilent) {
      errorEl.textContent = `Error: ${err.message}`;
      // Also show an alert to make it very obvious for debugging
      alert(`Debug Info: ${err.message}\nMake sure to run a local server if testing from file:// due to CORS.`);
    }
  } finally {
    if (!isSilent) {
      btn.textContent = 'Fetch Attendance';
      btn.disabled = false;
    }
  }
}

function updateAttendanceUI(data) {
  console.log("API response data:", data); // For debugging
  
  const attData = data.subjectwise_summary || data.attendance_data || [];
  const totalInfo = data.total_info || {};

  // Calculate overall percentage
  let overallPct = 0;
  if (totalInfo.total_percentage) {
    overallPct = parseFloat(totalInfo.total_percentage);
  } else if (attData.length > 0) {
    let totalHeld = 0;
    let totalPresent = 0;
    attData.forEach(sub => {
      // Fallback for different possible field names
      const held = parseInt(sub.total_classes || sub.held || sub.total, 10) || 0;
      const present = parseInt(sub.present_classes || sub.present, 10) || 0;
      totalHeld += held;
      totalPresent += present;
    });
    overallPct = totalHeld > 0 ? ((totalPresent / totalHeld) * 100).toFixed(1) : 0;
  }

  if (attData.length === 0) return;

  // Update global stat card
  const valEl = document.getElementById('attendance-value');
  const ringEl = document.getElementById('attendance-ring');
  
  if (valEl) {
    valEl.textContent = overallPct;
    // Animate counter logic (bypassing initCounters to avoid resetting others)
    animateCounter(valEl, parseFloat(overallPct), true, 1000);
  }
  
  if (ringEl) {
    ringEl.style.strokeDasharray = `${overallPct}, 100`;
  }

  // Update Detailed section
  const detailedCard = document.getElementById('detailed-attendance-card');
  const gridEl = document.getElementById('attendance-subjects-grid');
  const timeEl = document.getElementById('attendance-last-updated');
  
  if (detailedCard && gridEl) {
    detailedCard.style.display = 'block';
    if (timeEl && data.time) {
      timeEl.textContent = `Last updated: ${data.time}`;
    }

    gridEl.innerHTML = ''; // clear

    attData.forEach(sub => {
      const pct = parseFloat(sub.percentage) || 0;
      // Fallbacks
      const present = sub.present_classes ?? sub.present ?? 0;
      const total = sub.total_classes ?? sub.held ?? sub.total ?? 0;
      const absents = sub.absent_classes ?? sub.absent ?? (total - present);
      
      // Pick a color based on percentage
      let color = '#00ce86'; // green
      if (pct < 75) color = '#ff4d4d'; // red
      else if (pct < 85) color = '#D4AF37'; // gold

      const card = document.createElement('div');
      card.className = 'attendance-subject-card';
      card.innerHTML = `
        <div class="att-subject-name">${sub.subject || 'Unknown Subject'}</div>
        <div class="att-subject-stats">
          <span>${present} / ${total} (${absents} absents)</span>
          <span style="color: ${color}; font-weight: bold;">${pct}%</span>
        </div>
        <div class="att-progress-bar">
          <div class="att-progress-fill" style="width: ${pct}%; background: ${color};"></div>
        </div>
      `;
      gridEl.appendChild(card);
    });
    
    // Re-trigger scroll observer to fade it in
    observeRevealElements();
  }
}
