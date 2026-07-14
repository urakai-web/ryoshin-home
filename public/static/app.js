/* ================================================================
   株式会社 RYOSHIN — Main Application JavaScript
   ================================================================ */

(function () {
  'use strict';

  // ── SPLASH SCREEN ──
  const splash = document.getElementById('splash');
  const SPLASH_DURATION = 1800;

  function dismissSplash() {
    if (!splash) return;
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
      triggerHeroAnimations();
    }, 800);
  }

  setTimeout(dismissSplash, SPLASH_DURATION);

  // ── HERO ANIMATIONS ──
  function triggerHeroAnimations() {
    const label      = document.querySelector('.hero-label');
    const titleLines = document.querySelectorAll('.hero-title-line');
    const sub        = document.querySelector('.hero-sub');
    const data       = document.querySelector('.hero-data');

    if (label) {
      label.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      label.style.opacity    = '1';
      label.style.transform  = 'translateY(0)';
    }

    titleLines.forEach((line, i) => {
      setTimeout(() => {
        line.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
        line.style.opacity    = '1';
        line.style.transform  = 'translateY(0)';
      }, 200 + i * 200);
    });

    if (sub) {
      setTimeout(() => {
        sub.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sub.style.opacity    = '1';
        sub.style.transform  = 'translateY(0)';
      }, 700);
    }

    if (data) {
      setTimeout(() => {
        data.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        data.style.opacity    = '1';
        data.style.transform  = 'translateY(0)';
        animateCounters();
      }, 900);
    }

    setTimeout(() => {
      const header = document.getElementById('header');
      if (header) header.classList.add('visible');
    }, 1200);
  }

  // ── COUNTER ANIMATION ──
  function animateCounters() {
    document.querySelectorAll('.hero-data-num').forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      if (isNaN(target)) return;
      const duration  = 2000;
      const startTime = performance.now();
      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 4);
        counter.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // ── HEADER / NAV ──
  const hamburger = document.getElementById('hamburger');
  const headerNav = document.getElementById('headerNav');

  if (hamburger && headerNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      headerNav.classList.toggle('open');
    });
    headerNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        headerNav.classList.remove('open');
      });
    });
  }

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 70;
        const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── INTERSECTION OBSERVER ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.service-card').forEach(card => observer.observe(card));
  document.querySelectorAll('.philosophy-row, .philosophy-closing').forEach(row => observer.observe(row));

  const carouselWrap = document.getElementById('worksCarouselWrap');
  if (carouselWrap) observer.observe(carouselWrap);

  // ── HEADER ON SCROLL ──
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (!header) return;
    if (window.pageYOffset > 100) header.classList.add('visible');
  }, { passive: true });

  // ================================================================
  //  WORKS: カテゴリフィルタ + カルーセル
  // ================================================================
  (function initWorks() {

    // ── DOM refs ──
    const filterWrap   = document.getElementById('worksFilter');
    const track        = document.getElementById('worksTrack');
    const viewport     = document.getElementById('worksViewport');
    const dotsWrap     = document.getElementById('worksDots');
    const prevBtn      = document.getElementById('worksPrev');
    const nextBtn      = document.getElementById('worksNext');
    const currentEl    = document.getElementById('worksCurrentNum');
    const totalEl      = document.getElementById('worksTotalNum');

    if (!track || !viewport) return;

    // 状態
    let allWorks       = window.__WORKS__      || [];  // 全件キャッシュ（フィルタ前）
    let currentWorks   = allWorks.slice();              // 現在表示中
    let currentIndex   = 0;
    let activeCategory = 'all';

    // ── カードHTML生成 ──
    function buildCardHTML(item, idx) {
      const label = item.categoryLabel || '';
      return `
        <article class="work-card${idx === 0 ? ' active-card' : ''}" data-index="${String(idx + 1).padStart(2, '0')}">
          <div class="work-card-img-wrap">
            <img src="${item.image}" alt="${escHtml(item.title)}" class="work-card-img" loading="lazy">
            <div class="work-card-overlay">
              <span class="work-card-category">${escHtml(label)}</span>
            </div>
          </div>
          <div class="work-card-body">
            <div class="work-card-meta">
              <span class="work-card-area"><i class="pin-icon"></i>${escHtml(item.area)}</span>
            </div>
            <h3 class="work-card-title">${escHtml(item.title)}</h3>
            <p class="work-card-desc">${escHtml(item.description)}</p>
            <div class="work-card-footer">
              <span class="work-card-duration">対応内容: ${escHtml(item.content)}</span>
            </div>
          </div>
        </article>`;
    }

    function buildEmptyHTML() {
      return `<div class="works-empty"><p>該当する施工事例がありません。</p></div>`;
    }

    function escHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // ── カルーセル描画 ──
    function renderCarousel(works) {
      currentWorks = works;
      currentIndex  = 0;

      // track再描画
      if (works.length === 0) {
        track.innerHTML = buildEmptyHTML();
      } else {
        track.innerHTML = works.map((item, i) => buildCardHTML(item, i)).join('');
      }
      track.style.transition = 'none';
      track.style.transform  = 'translateX(0)';

      // dots再描画
      if (dotsWrap) {
        dotsWrap.innerHTML = works.map((_, i) =>
          `<button class="works-dot${i === 0 ? ' active' : ''}" data-goto="${i}" aria-label="施工事例 ${i + 1}"></button>`
        ).join('');
        bindDots();
      }

      // カウンター更新
      updateCounter();

      // ボタン状態
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = works.length <= 1;

      // IntersectionObserver 再登録
      const wrap = document.getElementById('worksCarouselWrap');
      if (wrap && !wrap.classList.contains('animate-in')) {
        observer.observe(wrap);
      }
    }

    // ── カウンター & ボタン更新 ──
    function updateCounter() {
      const total = currentWorks.length;
      if (currentEl) currentEl.textContent = total > 0 ? String(currentIndex + 1).padStart(2, '0') : '--';
      if (totalEl)   totalEl.textContent   = String(total).padStart(2, '0');
    }

    // ── カードの幅 + gap ──
    function getCardStep() {
      const cards = Array.from(track.querySelectorAll('.work-card'));
      if (cards.length === 0) return 0;
      const gap  = parseFloat(window.getComputedStyle(track).gap) || 28;
      const cardW = cards[0].getBoundingClientRect().width;
      return cardW + gap;
    }

    // ── スライド ──
    function slideTo(index, animate) {
      const cards = Array.from(track.querySelectorAll('.work-card'));
      const total = cards.length;
      if (total === 0) return;

      currentIndex = Math.max(0, Math.min(index, total - 1));

      const offset = currentIndex * getCardStep();
      track.style.transition = animate === false
        ? 'none'
        : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      track.style.transform = `translateX(-${offset}px)`;

      cards.forEach((card, i) => card.classList.toggle('active-card', i === currentIndex));

      if (dotsWrap) {
        dotsWrap.querySelectorAll('.works-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }

      updateCounter();
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === total - 1;
    }

    // ── ドットのイベント ──
    function bindDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.works-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-goto'), 10);
          if (!isNaN(idx)) slideTo(idx);
        });
      });
    }

    // ── 前後ボタン ──
    if (prevBtn) prevBtn.addEventListener('click', () => slideTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => slideTo(currentIndex + 1));

    // ── キーボード ──
    document.addEventListener('keydown', e => {
      const section = document.getElementById('works');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      if (e.key === 'ArrowLeft')  slideTo(currentIndex - 1);
      if (e.key === 'ArrowRight') slideTo(currentIndex + 1);
    });

    // ── タッチ / マウスドラッグ ──
    let pointerStartX   = 0;
    let pointerCurrentX = 0;
    let isDragging      = false;
    const DRAG_THRESHOLD = 40;

    function onDragStart(x) {
      isDragging      = true;
      pointerStartX   = x;
      pointerCurrentX = x;
      track.style.transition = 'none';
    }
    function onDragMove(x) {
      if (!isDragging) return;
      pointerCurrentX = x;
      const diff = pointerCurrentX - pointerStartX;
      track.style.transform = `translateX(${-(currentIndex * getCardStep() - diff)}px)`;
    }
    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      const diff = pointerCurrentX - pointerStartX;
      const total = track.querySelectorAll('.work-card').length;
      if (diff < -DRAG_THRESHOLD && currentIndex < total - 1) {
        slideTo(currentIndex + 1);
      } else if (diff > DRAG_THRESHOLD && currentIndex > 0) {
        slideTo(currentIndex - 1);
      } else {
        slideTo(currentIndex);
      }
    }

    viewport.addEventListener('touchstart',  e => onDragStart(e.touches[0].clientX), { passive: true });
    viewport.addEventListener('touchmove',   e => onDragMove(e.touches[0].clientX),  { passive: true });
    viewport.addEventListener('touchend',    onDragEnd);
    viewport.addEventListener('mousedown',   e => { e.preventDefault(); onDragStart(e.clientX); });
    document.addEventListener('mousemove',   e => { if (isDragging) onDragMove(e.clientX); });
    document.addEventListener('mouseup',     () => { if (isDragging) onDragEnd(); });

    // リサイズ
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => slideTo(currentIndex, false), 100);
    });

    // ── カテゴリフィルタ ──
    // フィルタボタン押下時の処理（ローカルデータをカテゴリスラッグで絞り込み）
    function filterBySlug(categoryId, slug) {
      activeCategory = categoryId;

      // ボタンのactive状態を更新
      if (filterWrap) {
        filterWrap.querySelectorAll('.works-filter-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-category') === categoryId);
        });
      }

      const filtered = slug === 'all'
        ? allWorks
        : allWorks.filter(item => (item.categorySlugs || []).includes(slug));

      renderCarousel(filtered);
    }

    // フィルタボタンにイベントをバインド
    if (filterWrap) {
      filterWrap.querySelectorAll('.works-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const categoryId = btn.getAttribute('data-category') || 'all';
          const slug       = btn.getAttribute('data-slug')     || 'all';
          if (categoryId === activeCategory) return; // 同じカテゴリは無視
          filterBySlug(categoryId, slug);
        });
      });
    }

    // ── 初期描画 ──
    // SSRで埋め込まれたデータをそのまま表示
    renderCarousel(allWorks);

    // ドット初期バインド（SSRで描画済みのドット用）
    bindDots();

  })(); // end initWorks

})();
