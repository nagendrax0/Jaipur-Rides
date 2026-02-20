// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const icon = type === 'success' ? '✓' : '!';
  toastMsg.innerHTML = `<strong>${icon}</strong> ${message}`;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ===== HERO BOOKING FORM =====
const heroForm = document.getElementById('heroBookingForm');
heroForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const pickup = document.getElementById('pickup').value.trim();
  const tripType = document.getElementById('tripType').value;
  const date = document.getElementById('tripDate').value;
  const passengers = document.getElementById('passengers').value;

  if (!pickup || !tripType || !date || !passengers) {
    showToast('Please fill in all fields before searching.', 'error');
    return;
  }

  showToast(`Searching cabs for ${tripType} on ${formatDate(date)}...`);
  setTimeout(() => {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  }, 1200);
});

// ===== MAIN BOOKING FORM =====
const mainBookingForm = document.getElementById('mainBookingForm');
mainBookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const fields = ['bookName', 'bookPhone', 'bookEmail', 'bookService', 'bookDate', 'bookPassengers'];
  const values = {};
  let valid = true;

  fields.forEach(id => {
    const el = document.getElementById(id);
    const val = el.value.trim();
    if (!val) {
      el.style.borderColor = '#e74c3c';
      valid = false;
    } else {
      el.style.borderColor = '#e8e8e8';
      values[id] = val;
    }
  });

  if (!valid) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // Simulate booking
  const btn = mainBookingForm.querySelector('.btn');
  btn.textContent = 'Processing...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Book Now';
    btn.disabled = false;
    mainBookingForm.reset();
    showToast(`Booking confirmed! We'll contact ${values.bookName} on ${values.bookPhone} shortly.`);
  }, 1800);
});

// ===== AUTO-FILL BOOKING FORM =====
function selectServiceAndScroll(serviceValue, label) {
  const select = document.getElementById('bookService');
  select.value = serviceValue;
  // Brief highlight on the field
  select.style.borderColor = '#f39c12';
  select.style.boxShadow = '0 0 0 3px rgba(243,156,18,0.2)';
  setTimeout(() => {
    select.style.borderColor = '';
    select.style.boxShadow = '';
  }, 1800);
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  showToast(`"${label}" selected — fill in your details below.`);
}

// Package cards: click on the card body (not on the View Details link) pre-fills the form
document.querySelectorAll('.package-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    if (e.target.closest('.pkg-btn')) return; // let View Details link navigate normally
    const service = card.dataset.service;
    const label = card.dataset.label;
    if (service) selectServiceAndScroll(service, label);
  });
});

// Service cards: any click pre-fills the form
document.querySelectorAll('.service-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const service = card.dataset.service;
    const label = card.dataset.label;
    if (service) selectServiceAndScroll(service, label);
  });
});

// Attraction "Book a visit" links: pre-fill then smooth-scroll
document.querySelectorAll('.attraction-link[data-service]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    selectServiceAndScroll(link.dataset.service, link.dataset.label);
  });
});

// ===== CAB SELECTION =====
document.querySelectorAll('.cab-card').forEach(card => {
  card.addEventListener('click', () => {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    const cabType = card.querySelector('h4').textContent;
    showToast(`${cabType} selected! Complete booking details below.`);
  });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const animatedEls = document.querySelectorAll(
  '.service-card, .attraction-card, .package-card, .cab-card, .why-card, .testimonial-card'
);

animatedEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.1}s, transform 0.5s ease ${(i % 4) * 0.1}s`;
  observer.observe(el);
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 60;
  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.getAttribute('data-suffix') || '';
        animateCounter(counter, target, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== HELPERS =====
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ===== PHONE CTA =====
document.querySelectorAll('.phone-cta').forEach(el => {
  el.addEventListener('click', () => {
    showToast('Calling +91 98765 43210...', 'success');
  });
});

// ===== SET MIN DATE =====
const dateInputs = document.querySelectorAll('input[type="date"]');
const today = new Date().toISOString().split('T')[0];
dateInputs.forEach(input => input.setAttribute('min', today));

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (navLink) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(l => l.style.color = '');
        navLink.style.color = '#f39c12';
      }
    }
  });
}, { passive: true });
