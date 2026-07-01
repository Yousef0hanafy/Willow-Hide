// ========================================
// Willow & Hide — Main Script
// ========================================

(function() {
  'use strict';

  // ===== Mobile Menu Toggle =====
  const toggleButton = document.querySelector('header nav .toggle');
  const navUl = document.querySelector('header nav ul');

  if (toggleButton && navUl) {
    toggleButton.addEventListener('click', () => {
      navUl.classList.toggle('active');
    });
  }

  // ===== Dynamic Year for Footer =====
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== Smooth Scroll for Navigation Links =====
  document.querySelectorAll('header nav ul li a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
        // Close mobile menu after click
        if (navUl && navUl.classList.contains('active')) {
          navUl.classList.remove('active');
        }
      }
    });
  });

  // ===== Video Poster Fallback =====
  const video = document.querySelector('.video video');
  if (video) {
    video.setAttribute('poster', 'Images/Craft/BG_9.jpg');
  }

  // ===== Hero Background Carousel =====
  const landing = document.querySelector('.landing');
  const leftArrow = document.querySelector('.landing .fa-angle-left');
  const rightArrow = document.querySelector('.landing .fa-angle-right');
  const slideBullets = document.querySelectorAll('.landing .bullets li');

  const slides = [
    'Images/Craft/BG_9.jpg',
    'Images/Craft/CraftMan_1.jpg',
    'Images/Craft/BG_8.jpg'
  ];

  let currentSlide = 1;
  let autoPlayTimer;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlide = index;

    landing.style.backgroundImage = 'url("' + slides[currentSlide] + '")';

    // Trigger fade animation
    landing.classList.remove('slide-changing');
    void landing.offsetWidth; // Force reflow
    landing.classList.add('slide-changing');

    // Update bullet indicators
    slideBullets.forEach((bullet, i) => {
      bullet.classList.toggle('active', i === currentSlide);
    });
  }

  // Arrow click handlers
  if (rightArrow) {
    rightArrow.addEventListener('click', function() {
      goToSlide(currentSlide + 1);
      resetAutoPlay();
    });
  }
  if (leftArrow) {
    leftArrow.addEventListener('click', function() {
      goToSlide(currentSlide - 1);
      resetAutoPlay();
    });
  }

  // Bullet click handlers
  slideBullets.forEach(function(bullet, i) {
    bullet.addEventListener('click', function() {
      goToSlide(i);
      resetAutoPlay();
    });
  });

  // Auto-play
  function startAutoPlay() {
    autoPlayTimer = setInterval(function() {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  // Pause on hover
  if (landing) {
    landing.addEventListener('mouseenter', function() {
      clearInterval(autoPlayTimer);
    });
    landing.addEventListener('mouseleave', function() {
      startAutoPlay();
    });
  }

  // Initialize the carousel
  landing.style.backgroundImage = 'url("' + slides[currentSlide] + '")';
  startAutoPlay();

  // ===== Gallery Filtering (Shuffle) =====
  const shuffleLis = document.querySelectorAll('.shuffle li');
  const imgs = document.querySelectorAll('.imgs-container .box');

  shuffleLis.forEach(function(li) {
    li.addEventListener('click', function() {
      // Update active class
      shuffleLis.forEach(function(item) {
        item.classList.remove('active');
      });
      this.classList.add('active');

      // Filter gallery items
      imgs.forEach(function(img) {
        img.style.display = 'none';
      });

      const category = this.textContent.toLowerCase();

      if (category === 'all') {
        imgs.forEach(function(img) {
          img.style.display = 'block';
        });
      } else {
        document.querySelectorAll('.imgs-container .' + category).forEach(function(el) {
          el.style.display = 'block';
        });
      }
    });
  });

  // ===== Scroll-Triggered Animations =====
  const fadeSections = document.querySelectorAll('.fade-section');

  const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeSections.forEach(function(section) {
    sectionObserver.observe(section);
  });

  // ===== Animated Stat Counters =====
  function animateCounter(element, target, suffix, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(eased * target);
      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target + suffix;
        element.classList.add('counting');
      }
    }

    requestAnimationFrame(update);
  }

  const statObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.num');
        if (numEl && numEl.dataset.target) {
          const target = parseInt(numEl.dataset.target, 10);
          const suffix = numEl.dataset.suffix || '';
          animateCounter(numEl, target, suffix, 1500);
        }
        statObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  document.querySelectorAll('.stats .box').forEach(function(box) {
    statObserver.observe(box);
  });

  // ===== Animated Skill Bars =====
  const skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const span = entry.target.querySelector('span');
        if (span && span.dataset.progress) {
          span.style.width = span.dataset.progress;
          span.classList.add('animated');
        }
        skillObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.4
  });

  document.querySelectorAll('.porg-holder').forEach(function(holder) {
    skillObserver.observe(holder);
  });

})();
