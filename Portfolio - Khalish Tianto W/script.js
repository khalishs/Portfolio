/* ============================================================
   PORTFOLIO — script.js
   ============================================================ */

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx - 5 + 'px';
    cursor.style.top  = my - 5 + 'px';
  });

  (function animateCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx - 16 + 'px';
    follower.style.top  = fy - 16 + 'px';
    requestAnimationFrame(animateCursor);
  })();

  const hoverTargets = 'a, button, .proj-card, .cert-card, .exp-item, .skill-chip, label';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform   = 'scale(2)';
      follower.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform   = 'scale(1)';
      follower.style.transform = 'scale(1)';
    });
  });
})();


/* ============================================================
   2. NAVBAR — scroll shrink + hamburger
   ============================================================ */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  // Scroll shrink
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hamburger (mobile)
  hamburger.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(10,10,10,0.98)';
    navLinks.style.padding = '1.5rem 2rem';
    navLinks.style.borderBottom = '1px solid rgba(200,169,110,0.15)';
    if (open) navLinks.style.display = 'none';
  });

  // Close menu on link click (mobile)
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) navLinks.style.display = 'none';
    });
  });
})();


/* ============================================================
   3. SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => io.observe(el));
})();


/* ============================================================
   4. PROJECT DETAIL MODAL
   ============================================================ */
(function initProjectModal() {
  const modal   = document.getElementById('projModal');
  const overlay = document.getElementById('projModalOverlay');
  const closeBtn= document.getElementById('projModalClose');

  if (!modal || !overlay || !closeBtn) {
    console.error('Modal elements not found');
    return;
  }

  const elTitle = document.getElementById('projModalTitle');
  const elDesc  = document.getElementById('projModalDesc');
  const elTags  = document.getElementById('projModalTags');
  const elRole  = document.getElementById('projModalRole');
  const elYear  = document.getElementById('projModalYear');
  const elImg   = document.getElementById('projModalImg');
  const elNum   = document.getElementById('projModalNum');
  const elPh    = document.getElementById('projModalPlaceholder');
  const elLink  = document.getElementById('projModalLink');

  function openModal(card) {
    const d = card.dataset;

    elTitle.textContent = d.title  || '';
    elDesc.textContent  = d.desc   || '';
    elRole.textContent  = d.role   || '';
    elYear.textContent  = d.year   || '';

    // Tags
    elTags.innerHTML = '';
    (d.tags || '').split(',').forEach(tag => {
      const span = document.createElement('span');
      span.className = 'proj-tag';
      span.textContent = tag.trim();
      elTags.appendChild(span);
    });

    // Fitur Utama
    const elFeatures = document.getElementById('projModalFeatures');
    const elFeaturesWrap = document.getElementById('projModalFeaturesWrap');
    if (elFeatures && elFeaturesWrap) {
      elFeatures.innerHTML = '';
      const features = (d.features || '').split(',').map(f => f.trim()).filter(Boolean);
      if (features.length > 0) {
        features.forEach(feature => {
          const li = document.createElement('li');
          li.textContent = feature;
          elFeatures.appendChild(li);
        });
        elFeaturesWrap.style.display = '';
      } else {
        elFeaturesWrap.style.display = 'none';
      }
    }

    // Nomor placeholder
    const numSpan = card.querySelector('.proj-img-placeholder > span');
    elNum.textContent = numSpan ? numSpan.textContent : '';

    // Image
    elImg.classList.add('hidden');
    elPh.style.display = '';
    if (d.img) {
      const tempImg = new Image();
      tempImg.onload = () => {
        elImg.src = d.img;
        elImg.alt = d.title || '';
        elImg.classList.remove('hidden');
        elPh.style.display = 'none';
      };
      tempImg.src = d.img;
    }

    // Link
    elLink.href = (d.link && d.link !== '#') ? d.link : '#';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { elImg.src = ''; elImg.classList.add('hidden'); }, 350);
  }

  // Click pada proj-card (bukan proj-add)
  document.addEventListener('click', e => {
    const card = e.target.closest('.proj-card');
    if (card && !card.classList.contains('proj-add')) {
      openModal(card);
    }
  });

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', e => { e.stopPropagation(); closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})()


/* ============================================================
   5. CERT IMAGE — load from src, fallback to placeholder
   ============================================================ */
(function initCertImages() {
  document.querySelectorAll('.cert-img').forEach(img => {
    // Jika gambar berhasil dimuat, sembunyikan placeholder
    img.addEventListener('load', function() {
      const wrap = img.closest('.cert-img-wrap');
      const ph   = wrap ? wrap.querySelector('.cert-img-placeholder') : null;
      if (ph) ph.style.display = 'none';
      img.classList.remove('hidden');
    });
    // Jika gagal (file tidak ada), tampilkan placeholder, sembunyikan img
    img.addEventListener('error', function() {
      const wrap = img.closest('.cert-img-wrap');
      const ph   = wrap ? wrap.querySelector('.cert-img-placeholder') : null;
      if (ph) ph.style.display = '';
      img.classList.add('hidden');
    });
    // Trigger jika src sudah ada saat load
    if (img.complete && img.naturalWidth > 0) {
      img.dispatchEvent(new Event('load'));
    }
  });
})();


/* ============================================================
   6. LIGHTBOX — click cert image to preview fullscreen
   ============================================================ */
(function initLightbox() {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbOverlay = document.getElementById('lightboxOverlay');
  const lbClose   = document.getElementById('lightboxClose');

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  // Click on a project/cert image to open lightbox
  document.addEventListener('click', e => {
    const imgEl = e.target.closest('.proj-img, .cert-img');
    if (imgEl && !imgEl.classList.contains('hidden') && imgEl.src) {
      open(imgEl.src, imgEl.alt);
    }
  });

  lbOverlay.addEventListener('click', close);
  lbClose.addEventListener('click', close);

  // Keyboard close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
  });

})();


/* ============================================================
   7. SMOOTH ACTIVE NAV HIGHLIGHT on scroll
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--accent)'
        : '';
    });
  });
})();