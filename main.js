/* ==========================================================================
   BLACK LIGHT RESULTS — Main JavaScript

   Handles:
   - Navigation scroll effect, scroll spy & mobile menu
   - Scroll reveal animations (staggered)
   - Hero parallax & floating shapes
   - Counter animation (trust bar numbers)
   - FAQ accordion (smooth grid-based animation)
   - Contact form inline validation
   - Back to top button
   - Page transitions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------------------
     NAVIGATION — Add background on scroll + glowing accent line
     ----------------------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }


  /* -----------------------------------------------------------------------
     SCROLL SPY — Highlight active nav link based on scroll position
     Only runs on index.html (where sections exist)
     ----------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const spySections = document.querySelectorAll('section[id]');

  if (navLinks.length > 0 && spySections.length > 0) {
    const updateSpy = () => {
      const scrollY = window.scrollY + 200;
      let currentId = '';

      spySections.forEach(section => {
        if (scrollY >= section.offsetTop) {
          currentId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    };

    window.addEventListener('scroll', updateSpy, { passive: true });
    updateSpy();
  }


  /* -----------------------------------------------------------------------
     MOBILE MENU — Animated hamburger to X toggle
     ----------------------------------------------------------------------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      /* Prevent body scroll when menu is open */
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close when clicking a link */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  /* -----------------------------------------------------------------------
     SCROLL REVEAL — Staggered fade-in as elements enter viewport
     Uses IntersectionObserver for performance.
     Add class "reveal" to any element you want to animate in.
     Parent grids with "stagger-children" class get staggered delays via CSS.
     ----------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  /* -----------------------------------------------------------------------
     COUNTER ANIMATION — Animate percentage numbers counting up
     ----------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.card-stat');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          const target = parseInt(entry.target.textContent);
          const duration = 500; // 1s
          const start = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            entry.target.textContent = current + '%';

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              entry.target.textContent = target + '%';
            }
          };

          requestAnimationFrame(animate);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
  }





  /* -----------------------------------------------------------------------
     HERO PARALLAX — Move grid and orbs at different speeds on scroll
     ----------------------------------------------------------------------- */
  const heroGrid = document.querySelector('.hero-grid');

  if (heroGrid) {
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            heroGrid.style.transform = `translateY(${y * 0.15}px)`;
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }


  /* -----------------------------------------------------------------------
     FAQ ACCORDION — Smooth toggle with grid-based height animation
     ----------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        /* Close other open items */
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
      });
    }
  });


  /* -----------------------------------------------------------------------
     CONTACT FORM — Inline real-time validation with visual feedback
     ----------------------------------------------------------------------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    /* Real-time inline validation on blur */
    const nameInput = contactForm.querySelector('#name');
    const emailInput = contactForm.querySelector('#email');
    const messageInput = contactForm.querySelector('#message');

    const validateField = (input, test) => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        group.classList.remove('valid', 'invalid');
        return;
      }
      const isValid = test(input.value);
      group.classList.toggle('valid', isValid);
      group.classList.toggle('invalid', !isValid);
    };

    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        validateField(nameInput, v => v.trim().length >= 2);
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        validateField(emailInput, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      });
    }

    if (messageInput) {
      messageInput.addEventListener('blur', () => {
        validateField(messageInput, v => v.trim().length >= 10);
      });
    }

    /* Form submission */
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      /* Validate all fields */
      let hasErrors = false;

      const setError = (input, condition) => {
        const group = input.closest('.form-group');
        if (condition) {
          group.classList.add('invalid');
          group.classList.remove('valid');
          hasErrors = true;
        }
      };

      if (nameInput) setError(nameInput, !data.name || data.name.trim().length < 2);
      if (emailInput) setError(emailInput, !data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email));
      if (messageInput) setError(messageInput, !data.message || data.message.trim().length < 10);

      if (hasErrors) return;

      /* Submit to webhook */
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span style="color:#fff">Wird gesendet...</span>';
      submitBtn.disabled = true;

      /* Send as form-urlencoded format */
      const formBody = Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');

      fetch('https://hook.eu2.make.com/4ohht2g27czd4r8zxoak9ckb28dwaknd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-make-apikey': 'Webhook_API_key'
        },
        body: formBody
      })
      .then(response => {
        /* Make.com webhooks typically return 200 even for successful submissions */
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        /* Try to parse JSON, but don't fail if response is empty */
        return response.text().then(text => {
          try {
            return text ? JSON.parse(text) : {};
          } catch (e) {
            return { raw: text };
          }
        });
      })
      .then(result => {
        /* Show success feedback */
        console.log('Form submitted successfully:', result);
        submitBtn.innerHTML = '<span style="color:#fff">Nachricht gesendet!</span>';
        submitBtn.style.background = '#06d6a0';

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
          /* Clear validation states */
          contactForm.querySelectorAll('.form-group').forEach(g => {
            g.classList.remove('valid', 'invalid');
          });
        }, 3000);
      })
      .catch(error => {
        /* Show error feedback */
        console.error('Form submission error:', error);
        submitBtn.innerHTML = '<span style="color:#fff">Fehler beim Senden. Bitte versuche es erneut.</span>';
        submitBtn.style.background = '#ff4757';

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      });
    });
  }


  /* -----------------------------------------------------------------------
     BACK TO TOP BUTTON — Appears after scrolling past the hero
     ----------------------------------------------------------------------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* -----------------------------------------------------------------------
     PAGE TRANSITIONS — Fade out before navigating to a new page
     Intercepts local link clicks for a smooth exit animation.
     ----------------------------------------------------------------------- */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    /* Only apply to local HTML pages, not anchors or external links */
    if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.transition = 'opacity 0.08s ease-out';
        document.body.style.opacity = '0.88';
        setTimeout(() => {
          window.location.href = href;
        }, 80);
      });
    }
  });

});
