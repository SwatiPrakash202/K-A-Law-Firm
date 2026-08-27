/* ==========================================================================
   Kashyap & Associates — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var HEADER_OFFSET = document.getElementById('site-header') ? document.getElementById('site-header').offsetHeight : 100;

  /* ------------------------------------------------------------------
     0. DYNAMIC COPYRIGHT YEAR
  ------------------------------------------------------------------ */
  var yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------
     1. UTILITIES: MODAL SCROLL LOCK
  ------------------------------------------------------------------ */
 function lockScroll() {
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.body.style.overflow = '';
  }
  

  /* ------------------------------------------------------------------
     2. SMOOTH SCROLL WITH HEADER OFFSET COMPENSATION
  ------------------------------------------------------------------ */
  function scrollToSection(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }



/* ------------------------------------------------------------------
    3. BAR COUNCIL DISCLAIMER MODAL (HARD GATE)
------------------------------------------------------------------ */
var barCouncilModal = document.getElementById('bar-council-modal');
var barCouncilAgreeBtn = document.getElementById('bar-council-agree-btn');
var BAR_COUNCIL_KEY = 'barCouncilAgreed';

function hasAgreedToBarCouncil() {
  try {
    return window.localStorage.getItem(BAR_COUNCIL_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function setBarCouncilAgreed() {
  try {
    window.localStorage.setItem(BAR_COUNCIL_KEY, 'true');
    } catch (e) {}
  }
  

function showBarCouncilModal() {
  if (!barCouncilModal) return;
  barCouncilModal.removeAttribute('hidden');
  barCouncilModal.style.display = 'flex';
  lockScroll();
}

function hideBarCouncilModal() {
 if (!barCouncilModal) return;
  barCouncilModal.setAttribute('hidden', '');
  barCouncilModal.style.display = 'none';
  unlockScroll();
}
/* Initial check on page load: Always display on refresh */
if (barCouncilModal) {
  showBarCouncilModal();
}
  /* Click Handler for "I Agree" Button */
if (barCouncilAgreeBtn) {
  barCouncilAgreeBtn.addEventListener('click', function (e) {
    e.preventDefault();
    hideBarCouncilModal();
  });
}


/* Block Escape Key until agreed */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !hasAgreedToBarCouncil()) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}, true);


  /* ------------------------------------------------------------------
     4. MOBILE HAMBURGER NAVIGATION
  ------------------------------------------------------------------ */
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var mainNav = document.getElementById('main-nav');

  function closeMobileMenu() {
    mainNav.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    var isOpen = mainNav.classList.toggle('is-open');
    hamburgerBtn.classList.toggle('is-open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  var navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var sectionId = link.getAttribute('data-section');
      closeMobileMenu();
      scrollToSection(sectionId);
      history.pushState(null, '', '#' + sectionId);
    });
  });

  var homeBrandLink = document.getElementById('home-brand-link');
  if (homeBrandLink) {
    homeBrandLink.addEventListener('click', function (e) {
      e.preventDefault();
      closeMobileMenu();
      scrollToSection('hero');
    });
  }

  /* ------------------------------------------------------------------
     5. SCROLL-SPY NAVIGATION HIGHLIGHT
  ------------------------------------------------------------------ */
  var spySections = ['hero', 'about', 'people', 'practice-areas', 'gallery', 'blogs', 'consultation', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var navLinkMap = {};
  navLinks.forEach(function (link) {
    navLinkMap[link.getAttribute('data-section')] = link;
  });

  function setActiveNavLink(id) {
    navLinks.forEach(function (link) { link.classList.remove('active'); });
    if (navLinkMap[id]) {
      navLinkMap[id].classList.add('active');
    }
  }

  if ('IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveNavLink(entry.target.id);
        }
      });
    }, {
      rootMargin: '-' + (HEADER_OFFSET + 10) + 'px 0px -60% 0px',
      threshold: 0
    });

    spySections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     6. CTA BUTTONS -> SCROLL TO CONTACT
  ------------------------------------------------------------------ */
  var heroConsultationBtn = document.getElementById('hero-consultation-btn');
  var consultationCtaBtn = document.getElementById('consultation-cta-btn');

  [heroConsultationBtn, consultationCtaBtn].forEach(function (btn) {
    if (btn) {
      btn.addEventListener('click', function () {
        scrollToSection('contact');
      });
    }
  });

  /* ------------------------------------------------------------------
     7. BLOGS: VIEW MORE / SHOW LESS TOGGLE
  ------------------------------------------------------------------ */
  var viewMoreBtn = document.getElementById('view-more-articles-btn');
  var hiddenArticleCards = document.querySelectorAll('.blog-card.hidden-article');

  function revealHiddenArticles() {
    hiddenArticleCards.forEach(function (card) { card.classList.add('is-visible'); });
    if (viewMoreBtn) {
      viewMoreBtn.textContent = 'Show Less';
      viewMoreBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function hideHiddenArticles() {
    hiddenArticleCards.forEach(function (card) { card.classList.remove('is-visible'); });
    if (viewMoreBtn) {
      viewMoreBtn.textContent = 'View More Legal Articles';
      viewMoreBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', function () {
      var isExpanded = viewMoreBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        hideHiddenArticles();
      } else {
        revealHiddenArticles();
        scrollToSection('blogs');
      }
    });
  }




   
  /* ------------------------------------------------------------------
     9. FORM SUCCESS MODAL
  ------------------------------------------------------------------ */
  var successModal = document.getElementById('success-modal');
  var successModalCloseBtn = document.getElementById('success-modal-close');

  function openSuccessModal() {
    successModal.hidden = false;
    lockScroll();
  }

  function closeSuccessModal() {
    successModal.hidden = true;
    unlockScroll();;
  }

  if (successModalCloseBtn) {
    successModalCloseBtn.addEventListener('click', closeSuccessModal);
  }

  if (successModal) {
    successModal.addEventListener('click', function (e) {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }

  /* ------------------------------------------------------------------
     10. UNIVERSAL ESCAPE KEY HANDLING ( Success modals only)
  ------------------------------------------------------------------ */
 document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (successModal && !successModal.hidden) {
      closeSuccessModal();
    }
  });
 
  
  /* ------------------------------------------------------------------
     12. CONTACT & CASE INTAKE FORM — VALIDATION + AJAX SUBMISSION
  ------------------------------------------------------------------ */
  var intakeForm = document.getElementById('intake-form');
  var emailField = document.getElementById('field-email');
  var phoneField = document.getElementById('field-phone');
  var emailError = document.getElementById('email-error');
  var phoneError = document.getElementById('phone-error');
  var formSubmitBtn = document.getElementById('form-submit-btn');
  var formStatusMessage = document.getElementById('form-status-message');

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_REGEX = /^[6-9][0-9]{9}$/;

  function validateEmail() {
    var isValid = EMAIL_REGEX.test(emailField.value.trim());
    emailField.classList.toggle('field-invalid', !isValid);
    emailError.hidden = isValid;
    return isValid;
  }

  function validatePhone() {
    var isValid = PHONE_REGEX.test(phoneField.value.trim());
    phoneField.classList.toggle('field-invalid', !isValid);
    phoneError.hidden = isValid;
    return isValid;
  }

  if (emailField) {
    emailField.addEventListener('blur', validateEmail);
    emailField.addEventListener('input', function () {
      if (emailField.classList.contains('field-invalid')) validateEmail();
    });
  }

  if (phoneField) {
    phoneField.addEventListener('input', function () {
      phoneField.value = phoneField.value.replace(/[^0-9]/g, '').slice(0, 10);
      if (phoneField.classList.contains('field-invalid')) validatePhone();
    });
    phoneField.addEventListener('blur', validatePhone);
  }

  function showFormStatus(message, type) {
    formStatusMessage.textContent = message;
    formStatusMessage.className = 'form-status status-' + type;
    formStatusMessage.hidden = false;
  }

  function clearFormStatus() {
    formStatusMessage.hidden = true;
    formStatusMessage.textContent = '';
    formStatusMessage.className = 'form-status';
  }

  function setSubmitting(isSubmitting) {
    formSubmitBtn.disabled = isSubmitting;
    formSubmitBtn.textContent = isSubmitting ? 'Sending...' : 'Send Message';
  }

  if (intakeForm) {
    intakeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormStatus();

      var isEmailValid = validateEmail();
      var isPhoneValid = validatePhone();

      if (!isEmailValid || !isPhoneValid) {
        showFormStatus('Please correct the highlighted fields before submitting.', 'error');
        return;
      }

      setSubmitting(true);

      var formData = new FormData(intakeForm);

      fetch(intakeForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            intakeForm.reset();
            emailField.classList.remove('field-invalid');
            phoneField.classList.remove('field-invalid');
            emailError.hidden = true;
            phoneError.hidden = true;
            clearFormStatus();
            openSuccessModal();
          } else {
            showFormStatus('Something went wrong while sending your message. Please try again or email us directly at pkashyapassociates@kashyapandassociates.com.', 'error');
          }
        })
        .catch(function () {
          showFormStatus('We could not reach the server. Please check your connection and try again, or email us directly at pkashyapassociates@kashyapandassociates.com.', 'error');
        })
        .finally(function () {
          setSubmitting(false);
        });
    });
  }

});


