import { Hono } from 'hono'

const app = new Hono()

const SITE_URL = 'https://ryoshin-home.com'

// ================================================================
//  施工事例データ（静的）
//  ※ 太陽光発電・エコキュートは実際の施工写真、それ以外は準備中のため
//    プレースホルダー画像です。実際の施工写真が届き次第、
//    /public/static/images/works/ 配下の画像を差し替えてください。
// ================================================================
const CATEGORIES = [
  { id: 'energy', name: '省エネ設備事業', slug: 'energy' },
  { id: 'reform', name: 'リフォーム事業', slug: 'reform' },
  { id: 'vacant', name: '空き家事業', slug: 'vacant' },
]

const WORKS = [
  {
    title: '太陽光発電システム設置工事',
    categoryLabel: '省エネ設備事業',
    categorySlugs: ['energy'],
    area: '対応エリア: 大阪府全域',
    content: 'パネル・パワーコンディショナ設置',
    description: '屋根の状況に合わせた最適なパネル配置で、電気代削減と売電収入をサポートします。',
    image: '/static/images/works/solar.jpg',
  },
  {
    title: '蓄電池システム導入工事',
    categoryLabel: '省エネ設備事業',
    categorySlugs: ['energy'],
    area: '対応エリア: 大阪府全域',
    content: '蓄電池本体・システム連携設置',
    description: '太陽光との連携で、停電時にも安心な自家発電・自家消費の仕組みを構築します。',
    image: '/static/images/works/battery.jpg',
  },
  {
    title: 'エコキュート設置・交換工事',
    categoryLabel: '省エネ設備事業',
    categorySlugs: ['energy'],
    area: '対応エリア: 大阪府全域',
    content: '本体交換・配管工事',
    description: '省エネ給湯への切り替えで、光熱費を抑えながら快適な暮らしを実現します。',
    image: '/static/images/works/ecocute.jpg',
  },
  {
    title: 'セントラル浄水器設置工事',
    categoryLabel: 'リフォーム事業',
    categorySlugs: ['reform'],
    area: '対応エリア: 大阪府全域',
    content: 'セントラル浄水システム設置',
    description: '家中の蛇口をまるごと浄水。安全でおいしい水を暮らし全体でご利用いただけます。',
    image: '/static/images/works/purifier.jpg',
  },
  {
    title: '外壁塗装・屋根リフォーム工事',
    categoryLabel: 'リフォーム事業',
    categorySlugs: ['reform'],
    area: '対応エリア: 大阪府全域',
    content: '外壁塗装・屋根工事',
    description: '建物を守り、美観を保つ塗装工事。水回り・内装・外構工事にも幅広く対応します。',
    image: '/static/images/works/reform.jpg',
  },
  {
    title: '空き家管理・利活用サポート',
    categoryLabel: '空き家事業',
    categorySlugs: ['vacant'],
    area: '対応エリア: 大阪府全域',
    content: '定期点検・清掃・利活用提案',
    description: '空き家の劣化防止から賃貸・売却提案まで、資産価値を守る管理をサポートします。',
    image: '/static/images/works/vacant.jpg',
  },
]

// ================================================================
//  共通レイアウト
// ================================================================
function renderHead(title: string, description: string, path: string): string {
  const url = `${SITE_URL}${path}`
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="RYOSHIN,太陽光発電,蓄電池,エコキュート,セントラル浄水器,住宅リフォーム,外壁塗装,空き家対策,寝屋川市">
  <meta name="robots" content="index, follow">
  <meta name="author" content="株式会社RYOSHIN">

  <!-- ファビコン -->
  <link rel="icon" type="image/svg+xml" href="/static/images/favicon.svg">
  <link rel="apple-touch-icon" href="/static/images/favicon.svg">

  <!-- OGP（SNSシェア・検索結果プレビュー用） -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="株式会社RYOSHIN">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE_URL}/static/images/ogp-image.svg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="ja_JP">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${SITE_URL}/static/images/ogp-image.svg">

  <!-- 構造化データ（JSON-LD） -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "株式会社RYOSHIN",
    "description": "省エネ設備、住宅リフォーム、空き家対策をワンストップで提供する総合生活サポート企業。",
    "url": "${SITE_URL}",
    "logo": "${SITE_URL}/static/images/logo.png",
    "image": "${SITE_URL}/static/images/ogp-image.svg",
    "telephone": "0120-60-4337",
    "address": {
      "@type": "PostalAddress",
      "postalCode": "572-0022",
      "addressRegion": "大阪府",
      "addressLocality": "寝屋川市",
      "streetAddress": "緑町12番13号サンハイツ302",
      "addressCountry": "JP"
    },
    "serviceType": [
      "太陽光発電設置工事",
      "蓄電池設置工事",
      "エコキュート設置",
      "セントラル浄水器設置",
      "住宅リフォーム",
      "外壁塗装・屋根工事",
      "空き家管理・利活用サポート",
      "ガスの切り替え",
      "携帯電話プランの見直し",
      "ネット回線の見直し"
    ]
  }
  </script>

  <!-- Google tag (gtag.js) を設置する場合はここに追加してください -->

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500&family=Noto+Sans+JP:wght@200;300;400;500;600;700&family=Noto+Serif+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="/static/style.css" rel="stylesheet">`
}

// isHome: トップページかどうかで、アンカーリンク or ページ遷移リンクを切り替える
function renderHeader(isHome: boolean): string {
  const topHref     = isHome ? '#hero' : '/'
  const serviceHref = isHome ? '#service' : '/#service'
  const worksHref    = isHome ? '#works' : '/#works'
  const contactHref  = isHome ? '#contact' : '/#contact'

  return `
  <header id="header" class="header${isHome ? '' : ' visible'}">
    <div class="header-inner">
      <a href="/" class="header-logo">
        <img src="/static/images/logo.png" alt="RYOSHIN" class="header-logo-img">
        <span class="header-logo-text">株式会社 RYOSHIN</span>
      </a>
      <nav class="header-nav" id="headerNav">
        <a href="${topHref}" class="nav-link" data-label="TOP">TOP</a>
        <a href="/philosophy" class="nav-link" data-label="PHILOSOPHY">PHILOSOPHY</a>
        <a href="${serviceHref}" class="nav-link" data-label="SERVICE">SERVICE</a>
        <a href="${worksHref}" class="nav-link" data-label="WORKS">WORKS</a>
        <a href="${contactHref}" class="nav-link" data-label="CONTACT">CONTACT</a>
      </nav>
      <button class="hamburger" id="hamburger" aria-label="メニュー">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`
}

function renderFooter(): string {
  return `
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-logo">
        <span class="footer-company">株式会社 RYOSHIN</span>
      </div>
      <div class="footer-info">
        <p class="footer-address">
          〒572-0022<br>
          大阪府寝屋川市緑町12番13号サンハイツ302
        </p>
        <p class="footer-tel">TEL: 0120-60-4337</p>
      </div>
      <div class="footer-copy">
        <span>&copy; 2026 株式会社 RYOSHIN. All Rights Reserved.</span>
      </div>
    </div>
  </footer>`
}

// ================================================================
//  トップページ（SSR）
// ================================================================
app.get('/', (c) => {
  const worksJSON      = JSON.stringify(WORKS)
  const categoriesJSON = JSON.stringify(CATEGORIES)

  // ── カルーセルカードHTML ──
  function renderCards(works: typeof WORKS): string {
    if (works.length === 0) {
      return `<div class="works-empty"><p>施工事例を準備中です。</p></div>`
    }
    return works.map((item, i) => `
    <article class="work-card${i === 0 ? ' active-card' : ''}" data-index="${String(i + 1).padStart(2, '0')}">
      <div class="work-card-img-wrap">
        <img src="${item.image}" alt="${item.title}" class="work-card-img" loading="lazy">
        <div class="work-card-overlay">
          <span class="work-card-category">${item.categoryLabel}</span>
        </div>
      </div>
      <div class="work-card-body">
        <div class="work-card-meta">
          <span class="work-card-area"><i class="pin-icon"></i>${item.area}</span>
        </div>
        <h3 class="work-card-title">${item.title}</h3>
        <p class="work-card-desc">${item.description}</p>
        <div class="work-card-footer">
          <span class="work-card-duration">対応内容: ${item.content}</span>
        </div>
      </div>
    </article>`).join('')
  }

  function renderDots(count: number): string {
    return Array.from({ length: count }, (_, i) =>
      `<button class="works-dot${i === 0 ? ' active' : ''}" data-goto="${i}" aria-label="施工事例 ${i + 1}"></button>`
    ).join('')
  }

  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>${renderHead(
    '株式会社RYOSHIN',
    '株式会社RYOSHIN - 太陽光発電・蓄電池・エコキュートなどの省エネ設備から、外壁塗装・水回り・内装などの住宅リフォーム、空き家対策まで。大阪府寝屋川市を拠点に、暮らしをトータルサポートします。',
    '/'
  )}
</head>
<body>

  <!-- ====== SPLASH SCREEN ====== -->
  <div id="splash" class="splash">
    <div class="splash-inner">
      <div class="splash-logo-wrap">
        <img src="/static/images/logo.png" alt="RYOSHIN" class="splash-logo" id="splashLogo">
      </div>
    </div>
  </div>

  ${renderHeader(true)}

  <!-- ====== HERO / FV ====== -->
  <section id="hero" class="hero">
    <div class="hero-video-wrap">
      <video autoplay muted loop playsinline class="hero-video" id="heroVideo">
        <source src="/static/video/hero.mp4" type="video/mp4">
      </video>
      <div class="hero-overlay"></div>
    </div>
    <div class="hero-content">
      <div class="hero-grid-bg"></div>
      <div class="hero-text-wrap">
        <p class="hero-label"><span class="hero-label-line"></span>TOTAL LIFE SUPPORT</p>
        <h1 class="hero-title">
          <span class="hero-title-line" data-delay="0">暮らしを豊かに。</span>
        </h1>
        <p class="hero-sub">
          省エネ設備から住宅リフォーム、空き家対策まで。<br>
          暮らしにまつわるすべてを、ワンストップでトータルサポート。
        </p>
      </div>
      <div class="hero-scroll">
        <span class="hero-scroll-text">SCROLL</span>
        <div class="hero-scroll-line"></div>
      </div>
    </div>
  </section>

  <!-- ====== SERVICE ====== -->
  <section id="service" class="service">
    <div class="section-grid-bg"></div>
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-title-en">SERVICE</span>
          <span class="section-title-jp">事業内容</span>
        </h2>
        <p class="section-desc">省エネ設備・住宅リフォーム・空き家対策。3つの事業を軸に、<br>暮らしにまつわるお困りごとをワンストップでサポートします。</p>
      </div>

      <div class="service-grid">
        <div class="service-card" data-index="01">
          <div class="service-card-img-wrap">
            <img src="/static/images/works/solar.jpg" alt="太陽光発電" class="service-card-img" loading="lazy">
          </div>
          <div class="service-card-body" data-index="01">
            <div class="service-card-header">
              <span class="service-label-en">SOLAR POWER</span>
            </div>
            <h3 class="service-name">太陽光発電</h3>
            <p class="service-tagline">電気をつくり、暮らしの経済を変える。</p>
            <p class="service-text">太陽光発電システムの設置により、電気代の削減と余剰電力の売電を実現。環境にもお財布にもやさしい暮らしをサポートします。</p>
            <div class="service-card-line"></div>
          </div>
        </div>

        <div class="service-card" data-index="02">
          <div class="service-card-img-wrap">
            <img src="/static/images/works/battery.jpg" alt="蓄電池" class="service-card-img" loading="lazy">
          </div>
          <div class="service-card-body" data-index="02">
            <div class="service-card-header">
              <span class="service-label-en">BATTERY STORAGE</span>
            </div>
            <h3 class="service-name">蓄電池</h3>
            <p class="service-tagline">電気を蓄え、もしもの時も安心を。</p>
            <p class="service-text">太陽光でつくった電気を蓄えて有効活用。停電など緊急時にも電気を使い続けられる、災害に強い住まいを実現します。</p>
            <div class="service-card-line"></div>
          </div>
        </div>

        <div class="service-card" data-index="03">
          <div class="service-card-img-wrap">
            <img src="/static/images/works/ecocute.jpg" alt="エコキュート" class="service-card-img" loading="lazy">
          </div>
          <div class="service-card-body" data-index="03">
            <div class="service-card-header">
              <span class="service-label-en">ECO WATER HEATER</span>
            </div>
            <h3 class="service-name">エコキュート</h3>
            <p class="service-tagline">お湯を、賢く効率的に。</p>
            <p class="service-text">少ない電力でお湯を沸かす省エネ給湯システム。導入からアフターサポート、定期点検まで一貫して対応します。</p>
            <div class="service-card-line"></div>
          </div>
        </div>

        <div class="service-card" data-index="04">
          <div class="service-card-img-wrap">
            <img src="/static/images/works/purifier.jpg" alt="セントラル浄水器" class="service-card-img" loading="lazy">
          </div>
          <div class="service-card-body" data-index="04">
            <div class="service-card-header">
              <span class="service-label-en">WHOLE-HOUSE PURIFIER</span>
            </div>
            <h3 class="service-name">セントラル浄水器</h3>
            <p class="service-tagline">家中まるごと、いつでも安心なお水を。</p>
            <p class="service-text">1台で家中の蛇口をまるごと浄水するセントラル浄水システム。お子様やペットにも、家中どこでも安心してお水をご利用いただけます。</p>
            <div class="service-card-line"></div>
          </div>
        </div>

        <div class="service-card" data-index="05">
          <div class="service-card-img-wrap">
            <img src="/static/images/works/reform.jpg" alt="住宅リフォーム" class="service-card-img" loading="lazy">
          </div>
          <div class="service-card-body" data-index="05">
            <div class="service-card-header">
              <span class="service-label-en">HOME RENOVATION</span>
            </div>
            <h3 class="service-name">住宅リフォーム</h3>
            <p class="service-tagline">暮らしに合わせて、住まいを最適化。</p>
            <p class="service-text">外壁塗装・屋根工事、水回り工事、内装・外構工事まで幅広く対応。丁寧なヒアリングで、お客様一人ひとりに合ったプランをご提案します。</p>
            <div class="service-card-line"></div>
          </div>
        </div>

        <div class="service-card" data-index="06">
          <div class="service-card-img-wrap">
            <img src="/static/images/works/vacant.jpg" alt="空き家対策" class="service-card-img" loading="lazy">
          </div>
          <div class="service-card-body" data-index="06">
            <div class="service-card-header">
              <span class="service-label-en">VACANT HOME</span>
            </div>
            <h3 class="service-name">空き家対策</h3>
            <p class="service-tagline">眠る資産を、地域の価値へ。</p>
            <p class="service-text">空き家の定期点検・清掃・防犯対策から、賃貸活用やリフォーム後の売却まで。大切な資産を守り、有効活用するお手伝いをします。</p>
            <div class="service-card-line"></div>
          </div>
        </div>
      </div>

      <div class="service-extra">
        <span class="service-extra-label">その他、生活コストの見直しもサポート</span>
        <div class="service-extra-list">
          <span class="service-extra-item">ガスの切り替え</span>
          <span class="service-extra-item">携帯電話プランの見直し</span>
          <span class="service-extra-item">ネット回線の見直し</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ====== WORKS / 施工事例 ====== -->
  <section id="works" class="works">
    <div class="section-grid-bg"></div>
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-title-en">WORKS</span>
          <span class="section-title-jp">施工事例</span>
        </h2>
        <p class="section-desc">太陽光発電から住宅リフォームまで、対応可能な工事内容の一部をご紹介します。<br>
          <span class="works-note">※ 一部の写真は準備中のイメージです。実際の施工写真が届き次第、順次更新いたします。</span>
        </p>
      </div>

      <!-- ── カテゴリフィルタ ── -->
      <div class="works-filter" id="worksFilter">
        <button class="works-filter-btn active" data-category="all" data-slug="all">すべて</button>
        ${CATEGORIES.map(cat =>
          `<button class="works-filter-btn" data-category="${cat.id}" data-slug="${cat.slug}">${cat.name}</button>`
        ).join('')}
      </div>

      <!-- カルーセルラッパー -->
      <div class="works-carousel-wrap" id="worksCarouselWrap">
        <div class="works-carousel-viewport" id="worksViewport">
          <div class="works-carousel-track" id="worksTrack">
            ${renderCards(WORKS)}
          </div>
        </div>

        <!-- ナビゲーション -->
        <div class="works-carousel-nav" id="worksCarouselNav">
          <div class="works-carousel-dots" id="worksDots">
            ${renderDots(WORKS.length)}
          </div>
          <div style="display:flex;align-items:center;gap:20px;">
            <div class="works-carousel-counter">
              <span class="current" id="worksCurrentNum">${WORKS.length > 0 ? '01' : '--'}</span>
              <span>&nbsp;/&nbsp;<span id="worksTotalNum">${String(WORKS.length).padStart(2, '0')}</span></span>
            </div>
            <div class="works-carousel-btns">
              <button class="works-carousel-btn" id="worksPrev" aria-label="前へ" disabled>&#8592;</button>
              <button class="works-carousel-btn" id="worksNext" aria-label="次へ" ${WORKS.length <= 1 ? 'disabled' : ''}>&#8594;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ====== CONTACT ====== -->
  <section id="contact" class="contact">
    <div class="section-grid-bg"></div>
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-title-en">CONTACT</span>
          <span class="section-title-jp">お問い合わせ</span>
        </h2>
        <p class="section-desc">太陽光発電・蓄電池・リフォームなど、住まいに関するご相談・お見積もりは無料です。<br>お気軽にお電話ください。</p>
      </div>
      <div class="contact-content">
        <div class="contact-info">
          <div class="contact-info-item">
            <span class="contact-info-label">TEL</span>
            <a href="tel:0120604337" class="contact-info-value contact-tel">0120-60-4337</a>
            <span class="contact-info-note">通話無料</span>
          </div>
          <div class="contact-info-item">
            <span class="contact-info-label">ADDRESS</span>
            <span class="contact-info-value">〒572-0022 大阪府寝屋川市緑町12番13号サンハイツ302</span>
          </div>
        </div>
        <a href="tel:0120604337" class="contact-btn">
          <span class="contact-btn-text">電話で無料相談・お見積もり</span>
          <span class="contact-btn-arrow">&rarr;</span>
        </a>
      </div>
    </div>
  </section>

  ${renderFooter()}

  <script>
    // SSR済みデータをクライアントへ渡す
    window.__WORKS__      = ${worksJSON};
    window.__CATEGORIES__ = ${categoriesJSON};
  </script>
  <script src="/static/app.js"></script>
</body>
</html>`)
})

// ================================================================
//  会社理念ページ（SSR）
// ================================================================
app.get('/philosophy', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>${renderHead(
    '会社理念 | 株式会社RYOSHIN',
    '株式会社RYOSHINの会社理念「暮らしを豊かに、お住まいのトータルサポートを」。私たちが大切にしている5つの価値観をご紹介します。',
    '/philosophy'
  )}
</head>
<body>

  ${renderHeader(false)}

  <!-- ====== PAGE HEADER ====== -->
  <section class="page-header">
    <div class="section-grid-bg"></div>
    <div class="container">
      <p class="breadcrumb"><a href="/">TOP</a><span class="breadcrumb-sep">/</span>PHILOSOPHY</p>
      <h1 class="section-title">
        <span class="section-title-en">PHILOSOPHY</span>
        <span class="section-title-jp">会社理念</span>
      </h1>
    </div>
  </section>

  <!-- ====== PHILOSOPHY / 会社理念 ====== -->
  <section class="philosophy philosophy-page">
    <div class="section-grid-bg"></div>
    <div class="container">
      <p class="philosophy-quote">「暮らしを豊かに、お住まいのトータルサポートを」</p>
      <p class="philosophy-lead">
        私たちRYOSHINは、お客様一人ひとりの「暮らし」を大切にし、より良い住環境の提供を使命としています。<br>
        家はただの住まいではなく、生活の質を左右する大切な空間。私たちはその空間をより快適で、安全、そしてエコロジカルにするために、さまざまなサービスを提供しています。
      </p>

      <div class="philosophy-story">
        <div class="philosophy-row">
          <div class="philosophy-row-img">
            <img src="/static/images/philosophy/hearing.jpg" alt="お客様の声を大切に" loading="lazy">
          </div>
          <div class="philosophy-row-text">
            <span class="philosophy-row-index">01</span>
            <h3 class="philosophy-row-title">お客様の声を大切に</h3>
            <p class="philosophy-row-desc">私たちの仕事は、単なる工事やリフォームにとどまりません。お客様が抱えるお悩みや希望をしっかりとヒアリングし、それに基づいた最適な提案をすることが私たちのスタンスです。どんな小さなお悩みでも遠慮せずにお話しいただければ、私たちはその解決に向けて全力でサポートいたします。</p>
          </div>
        </div>
        <div class="philosophy-row">
          <div class="philosophy-row-img">
            <img src="/static/images/philosophy/energy.jpg" alt="省エネと環境への配慮" loading="lazy">
          </div>
          <div class="philosophy-row-text">
            <span class="philosophy-row-index">02</span>
            <h3 class="philosophy-row-title">省エネと環境への配慮</h3>
            <p class="philosophy-row-desc">太陽光発電、蓄電池、エコキュートなどの省エネ設備を取り入れることで、持続可能な社会への貢献と、光熱費削減を実現しています。地球にもお客様にもやさしい暮らしを提案します。</p>
          </div>
        </div>
        <div class="philosophy-row">
          <div class="philosophy-row-img">
            <img src="/static/images/philosophy/inspection.jpg" alt="安全・安心な住まいづくり" loading="lazy">
          </div>
          <div class="philosophy-row-text">
            <span class="philosophy-row-index">03</span>
            <h3 class="philosophy-row-title">安全・安心な住まいづくり</h3>
            <p class="philosophy-row-desc">住宅の状態をしっかりと把握し、劣化を防ぐための定期的な点検やメンテナンスを行い、お客様が安心して暮らせる環境を提供します。</p>
          </div>
        </div>
        <div class="philosophy-row">
          <div class="philosophy-row-img">
            <img src="/static/images/philosophy/vacant-house.jpg" alt="空き家活用で地域貢献" loading="lazy">
          </div>
          <div class="philosophy-row-text">
            <span class="philosophy-row-index">04</span>
            <h3 class="philosophy-row-title">空き家活用で地域貢献</h3>
            <p class="philosophy-row-desc">空き家をただ放置するのではなく、有効活用する方法をご提案し、地域の資源として生かせるようお手伝いしています。空き家対策を通じて、地域社会の活性化にも貢献します。</p>
          </div>
        </div>

        <div class="philosophy-row">
          <div class="philosophy-row-img">
            <img src="/static/images/philosophy/team.jpg" alt="トータルサポートで一貫したサービス" loading="lazy">
          </div>
          <div class="philosophy-row-text">
            <span class="philosophy-row-index">05</span>
            <h3 class="philosophy-row-title">トータルサポートで一貫したサービス</h3>
            <p class="philosophy-row-desc">住宅の新設からリフォーム、省エネ設備の導入、そして空き家管理まで、すべてのサービスが連携し、総合的にお客様の暮らしを豊かにすることを目指しています。私たちは、単なる建築会社ではなく、お客様のライフスタイルをサポートするパートナーであり続けることを約束します。</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${renderFooter()}

  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
