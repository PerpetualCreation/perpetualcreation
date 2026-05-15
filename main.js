/* main.js — Perpetual Creation interactions & animations */

(function () {
  'use strict';

  /* ===== CUSTOM CURSOR ===== */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let fx = 0, fy = 0, mx = 0, my = 0;

  if (cursor && follower && window.innerWidth > 700) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    (function movFollower() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(movFollower);
    })();

    const hoverTargets = document.querySelectorAll('a, button, .service-card, .hex, .pillar, .social-link');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
    });
  }

  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ===== MOBILE MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu(open) {
    hamburger.classList.toggle('active', open);
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  }

  hamburger && hamburger.addEventListener('click', () => {
    toggleMenu(!mobileMenu.classList.contains('open'));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  /* ===== COUNTER ANIMATION ===== */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  /* ===== INTERSECTION OBSERVER ===== */
  const revealItems = document.querySelectorAll('.reveal');
  const serviceCards = document.querySelectorAll('.service-card');
  const steps = document.querySelectorAll('.step');
  const statNums = document.querySelectorAll('.stat-num');

  let statsAnimated = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach(el => io.observe(el));

  const cardIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.index) || 0;
        setTimeout(() => entry.target.classList.add('visible'), idx * 80);
        cardIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  serviceCards.forEach(card => cardIO.observe(card));

  const stepIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stepEls = document.querySelectorAll('.step');
        stepEls.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 150);
        });
        stepIO.disconnect();
      }
    });
  }, { threshold: 0.1 });

  steps.length && stepIO.observe(steps[0]);

  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNums.forEach(el => animateCounter(el));
        statsIO.disconnect();
      }
    });
  }, { threshold: 0.5 });

  statNums.length && statsIO.observe(statNums[0]);

  /* ===== SCROLL REVEAL for sobre/process sections ===== */
  document.querySelectorAll('.sobre-card, .sobre-text, .floating-badge, .contato-info, .contato-form').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.getElementById('navbar').offsetHeight;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        toggleMenu(false);
      }
    });
  });

  /* ===== CONTACT FORM ===== */
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const btnText = document.getElementById('btnText');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      formMsg.className = 'form-msg';
      formMsg.style.display = 'none';

      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const servico = form.servico.value;
      const mensagem = form.mensagem.value.trim();

      if (!nome || !email || !servico || !mensagem) {
        formMsg.textContent = '⚠️ Por favor, preencha todos os campos obrigatórios.';
        formMsg.className = 'form-msg error';
        return;
      }

      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailReg.test(email)) {
        formMsg.textContent = '⚠️ Por favor, informe um e-mail válido.';
        formMsg.className = 'form-msg error';
        return;
      }

      btnText.textContent = 'Enviando...';

      // Simula envio (substitua por fetch real para backend/formspree/emailjs)
      await new Promise(r => setTimeout(r, 1500));

      btnText.textContent = 'Enviar Mensagem';
      formMsg.textContent = '✅ Mensagem enviada! Retornaremos em até 24 horas.';
      formMsg.className = 'form-msg success';
      form.reset();

      setTimeout(() => {
        formMsg.className = 'form-msg';
        formMsg.style.display = 'none';
      }, 6000);
    });
  }

  /* ===== PARALLAX HERO BG TEXT ===== */
  const bgText = document.querySelector('.hero-bg-text');
  const ctaBgText = document.querySelector('.cta-bg-text');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (bgText) bgText.style.transform = `translate(-50%, calc(-50% + ${sy * 0.25}px))`;
    if (ctaBgText) {
      const rect = ctaBgText.closest('.cta-banner').getBoundingClientRect();
      ctaBgText.style.transform = `translate(-50%, calc(-50% + ${rect.top * 0.08}px))`;
    }
  }, { passive: true });

  /* ===== TILT on SERVICE CARDS ===== */
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ===== ACTIVE NAV LINK on scroll ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 120;
      if (window.scrollY >= top) current = s.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--yellow)'
        : '';
    });
  }, { passive: true });

})();

(function(){
  emailjs.init("VEuNeOyJJFo36DNkf");
})();

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("contactForm");
  const msg = document.getElementById("formMsg");

  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    emailjs.send("service_804371", "template_myw6ujk", {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      servico: document.getElementById("servico").value,
      mensagem: document.getElementById("mensagem").value
    })
   .then(function() {

      window.location.href = "obrigado.html";

    });

  });

});