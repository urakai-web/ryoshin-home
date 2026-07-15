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
  //  WORKS: カルーセル
  // ================================================================
  (function initWorks() {

    // ── DOM refs ──
    const track        = document.getElementById('worksTrack');
    const viewport     = document.getElementById('worksViewport');
    const dotsWrap     = document.getElementById('worksDots');
    const prevBtn      = document.getElementById('worksPrev');
    const nextBtn      = document.getElementById('worksNext');
    const currentEl    = document.getElementById('worksCurrentNum');
    const totalEl      = document.getElementById('worksTotalNum');

    if (!track || !viewport) return;

    // ── Before/After トグル ──
    track.addEventListener('click', e => {
      const btn = e.target.closest('.ba-btn');
      if (!btn) return;
      const wrap = btn.closest('.work-card-img-wrap');
      const img  = wrap && wrap.querySelector('.work-card-img');
      if (!img) return;

      const state = btn.getAttribute('data-state');
      const src   = state === 'before' ? img.getAttribute('data-before-src') : img.getAttribute('data-after-src');
      if (!src) return;

      img.src = src;
      wrap.querySelectorAll('.ba-btn').forEach(b => b.classList.toggle('active', b === btn));
    });

    // 状態
    let allWorks       = window.__WORKS__ || [];
    let currentWorks   = allWorks.slice();
    let currentIndex   = 0;

    // ── カードHTML生成 ──
    function buildCardHTML(item, idx) {
      const label = item.categoryLabel || '';
      const hasBeforeAfter = !!item.beforeImage;
      return `
        <article class="work-card${idx === 0 ? ' active-card' : ''}" data-index="${String(idx + 1).padStart(2, '0')}">
          <div class="work-card-img-wrap">
            <img src="${item.image}" alt="${escHtml(item.title)}" class="work-card-img" loading="lazy" data-after-src="${escHtml(item.image)}" data-before-src="${escHtml(item.beforeImage || '')}">
            <div class="work-card-overlay">
              <span class="work-card-category">${escHtml(label)}</span>
            </div>
            ${hasBeforeAfter ? `
            <div class="work-card-ba-toggle">
              <button type="button" class="ba-btn active" data-state="after">After</button>
              <button type="button" class="ba-btn" data-state="before">Before</button>
            </div>` : ''}
          </div>
          <div class="work-card-body">
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
      viewport.scrollLeft = 0;

      // dots再描画
      if (dotsWrap) {
        dotsWrap.innerHTML = works.map((_, i) =>
          `<button class="works-dot${i === 0 ? ' active' : ''}" data-goto="${i}" aria-label="施工事例 ${i + 1}"></button>`
        ).join('');
        bindDots();
      }

      updateUI();

      // IntersectionObserver 再登録
      const wrap = document.getElementById('worksCarouselWrap');
      if (wrap && !wrap.classList.contains('animate-in')) {
        observer.observe(wrap);
      }
    }

    // ── カードの幅 + gap（ネイティブスクロールの1コマ分の移動量） ──
    function getCardStep() {
      const cards = Array.from(track.querySelectorAll('.work-card'));
      if (cards.length === 0) return 0;
      const gap  = parseFloat(window.getComputedStyle(track).gap) || 28;
      const cardW = cards[0].getBoundingClientRect().width;
      return cardW + gap;
    }

    // ── 現在位置からカウンター・ドット・ボタン状態を更新 ──
    function updateUI() {
      const cards = Array.from(track.querySelectorAll('.work-card'));
      const total = cards.length;

      cards.forEach((card, i) => card.classList.toggle('active-card', i === currentIndex));

      if (dotsWrap) {
        dotsWrap.querySelectorAll('.works-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }

      if (currentEl) currentEl.textContent = total > 0 ? String(currentIndex + 1).padStart(2, '0') : '--';
      if (totalEl)   totalEl.textContent   = String(total).padStart(2, '0');
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= total - 1;
    }

    // ── 指定インデックスへネイティブスクロールで移動 ──
    function scrollToIndex(index, smooth) {
      const total = track.querySelectorAll('.work-card').length;
      if (total === 0) return;
      currentIndex = Math.max(0, Math.min(index, total - 1));
      viewport.scrollTo({ left: currentIndex * getCardStep(), behavior: smooth === false ? 'auto' : 'smooth' });
      updateUI();
    }

    // ── ネイティブスクロールに合わせて現在位置を追従（スワイプ・トラックパッド・慣性スクロール全て対応） ──
    let scrollRAF = null;
    viewport.addEventListener('scroll', () => {
      if (scrollRAF) return;
      scrollRAF = requestAnimationFrame(() => {
        scrollRAF = null;
        const step = getCardStep();
        if (step <= 0) return;
        const total = track.querySelectorAll('.work-card').length;
        const idx = Math.round(viewport.scrollLeft / step);
        currentIndex = Math.max(0, Math.min(idx, total - 1));
      });
    }, { passive: true });

    // ── ドットのイベント ──
    function bindDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.works-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-goto'), 10);
          if (!isNaN(idx)) scrollToIndex(idx);
        });
      });
    }

    // ── 前後ボタン ──
    if (prevBtn) prevBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1));

    // ── キーボード ──
    document.addEventListener('keydown', e => {
      const section = document.getElementById('works');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      if (e.key === 'ArrowLeft')  scrollToIndex(currentIndex - 1);
      if (e.key === 'ArrowRight') scrollToIndex(currentIndex + 1);
    });

    // ── デスクトップのマウスドラッグでもスクロールできるようにする ──
    // （タッチ操作はブラウザのネイティブスクロール + scroll-snapに完全に任せる）
    let isMouseDragging  = false;
    let mouseDownX       = 0;
    let mouseScrollStart = 0;
    let mouseMoved       = false;

    viewport.addEventListener('mousedown', e => {
      isMouseDragging  = true;
      mouseMoved       = false;
      mouseDownX       = e.clientX;
      mouseScrollStart = viewport.scrollLeft;
    });
    document.addEventListener('mousemove', e => {
      if (!isMouseDragging) return;
      const dx = e.clientX - mouseDownX;
      if (Math.abs(dx) > 3) mouseMoved = true;
      viewport.scrollLeft = mouseScrollStart - dx;
    });
    document.addEventListener('mouseup', () => {
      if (!isMouseDragging) return;
      isMouseDragging = false;
    });
    // ドラッグ後に画像等がクリックとして誤発火しないようにする
    viewport.addEventListener('click', e => {
      if (mouseMoved) { e.stopPropagation(); e.preventDefault(); mouseMoved = false; }
    }, true);
    // mouseupが発火しないケース（ウィンドウ外でボタンを離す等）への保険
    window.addEventListener('blur', () => {
      if (!isMouseDragging) return;
      isMouseDragging = false;
    });

    // リサイズ
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => scrollToIndex(currentIndex, false), 100);
    });

    // ── 初期描画 ──
    // SSRで埋め込まれたデータをそのまま表示
    renderCarousel(allWorks);

    // ドット初期バインド（SSRで描画済みのドット用）
    bindDots();

  })(); // end initWorks

})();
