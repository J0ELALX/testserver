// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu?.addEventListener('click', () => {
  navLinks?.classList.toggle('active');
  document.body.style.overflow = navLinks?.classList.contains('active')
    ? 'hidden'
    : '';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    navLinks?.classList.contains('active') &&
    !e.target.closest('.nav-links') &&
    !e.target.closest('.menu-toggle')
  ) {
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Progress bar
const progressBar = document.getElementById('progress-bar');
const updateProgressBar = () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.scrollY;
  const progress = (scrolled / documentHeight) * 100;
  if (progressBar) progressBar.style.width = `${progress}%`;
};

window.addEventListener('scroll', updateProgressBar);
window.addEventListener('resize', updateProgressBar);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = anchor.getAttribute('href');
    if (!targetId) return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    if (navLinks?.classList.contains('active')) {
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
});

// 3D Tilt Effect for Project Cards
const cards = document.querySelectorAll('.project-card');

cards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    if (window.matchMedia('(hover: hover)').matches) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(30px)
      `;
    }
  });

  card.addEventListener('mouseleave', () => {
    if (window.matchMedia('(hover: hover)').matches) {
      card.style.transform = 'translateZ(0)';
    }
  });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
const newsletterForm = document.querySelector('.newsletter-form');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  // Add form submission logic here
  alert('Thank you for your message! We will get back to you soon.');
  contactForm.reset();
});

newsletterForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  // Add newsletter subscription logic here
  alert('Thank you for subscribing to our newsletter!');
  newsletterForm.reset();
});
