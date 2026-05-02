<?php
/**
 * LinkOne — Front page template.
 *
 * This file renders the entire single-page LP. WordPress wp_head() and
 * wp_footer() inject required meta / asset tags. Most static asset URLs are
 * managed in functions.php via wp_enqueue_style / wp_enqueue_script.
 *
 * @package LinkOne
 */

if (!defined('ABSPATH')) { exit; }
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="LinkOne(リンクワン)は、特定の国・地域の生豆を専門に扱う輸入商社のアライアンスです。各社が現地で築いた直接取引のルートと専門知識を横につなぎ、自家焙煎事業者の皆さまにトレーサビリティとオリジナリティの確かなロットをお届けします。" />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <?php wp_head(); ?>
</head>
<body <?php body_class('linkone-lp'); ?> data-lang="jp">

  <!-- ===== Header ===== -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="#hero" class="brand">
        <span class="brand-dot brand-dot--red"></span>
        <span class="brand-dot brand-dot--yellow"></span>
        <span class="brand-dot brand-dot--teal"></span>
        <span class="brand-dot brand-dot--green"></span>
        <span class="brand-name">LinkOne</span>
      </a>
      <nav class="site-nav">
        <a href="#concept"><span data-jp>コンセプト</span><span data-en>Concept</span></a>
        <a href="#mvv"><span data-jp>ミッション</span><span data-en>Mission</span></a>
        <a href="#origins"><span data-jp>5つの産地</span><span data-en>Origins</span></a>
        <a href="#activities"><span data-jp>活動</span><span data-en>Activities</span></a>
        <a href="#events"><span data-jp>イベント</span><span data-en>Event</span></a>
        <a href="#sample" class="nav-cta"><span data-jp>サンプル依頼</span><span data-en>Samples</span></a>
      </nav>
      <div class="lang-switch" role="tablist" aria-label="Language">
        <button type="button" class="lang-btn is-active" data-lang-set="jp" aria-pressed="true">JP</button>
        <button type="button" class="lang-btn" data-lang-set="en" aria-pressed="false">EN</button>
      </div>
      <button class="nav-toggle" aria-label="メニュー" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <!-- ===== Hero ===== -->
  <section id="hero" class="hero">
    <div class="hero-bg">
      <div class="hero-blob hero-blob--1"></div>
      <div class="hero-blob hero-blob--2"></div>
      <div class="hero-blob hero-blob--3"></div>
      <div class="hero-blob hero-blob--4"></div>
    </div>
    <div class="container hero-inner">
      <p class="hero-chip"><span class="hero-chip-dot"></span>Specialty Coffee Importers Alliance · Est. 2025</p>
      <h1 class="hero-title">
        <span class="grad grad--red">Link</span><span class="grad grad--yellow">O</span><span class="grad grad--teal">n</span><span class="grad grad--green">e</span>
      </h1>
      <p class="hero-sub" data-jp>つながりで届ける</p>
      <p class="hero-sub" data-en>Linking specialty origins, directly.</p>
      <p class="hero-lead" data-jp>LinkOne は、特定の国・地域の生豆を専門に扱う輸入商社のアライアンスです。<br>各社が現地で築いた直接取引のルートと専門知識を横につなぎ、<br>自家焙煎事業者の皆さまに、トレーサビリティとオリジナリティの確かなロットをお届けします。</p>
      <p class="hero-lead" data-en>LinkOne is an alliance of specialty green coffee importers, each devoted to a single origin country or region. We connect their direct-trade routes and field expertise — delivering traceable, original lots to roasters worldwide.</p>
      <div class="hero-ctas">
        <a href="#sample" class="btn btn--primary"><span data-jp>サンプル依頼</span><span data-en>Request Samples</span></a>
        <a href="#origins" class="btn btn--ghost"><span data-jp>5つの産地を見る</span><span data-en>Explore Origins</span></a>
      </div>
    </div>
  </section>

  <!-- ===== Members Strip ===== -->
  <section class="members-strip">
    <div class="container">
      <p class="members-strip-lab"><span data-jp>参加インポーター</span><span data-en>Member Importers</span> · 5 / Growing Globally</p>
      <div class="members-strip-row">
        <a class="ms-cell" href="#origins" aria-label="Mirai Seeds — Brazil">
          <div class="ms-flag" aria-hidden="true">
            <svg viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="42" fill="#009C3B"/><polygon points="30,5 55,21 30,37 5,21" fill="#FFDF00"/><circle cx="30" cy="21" r="9" fill="#002776"/><path d="M22,22 Q30,17 38,22" stroke="#fff" stroke-width="1" fill="none"/></svg>
          </div>
          <div class="ms-name">Mirai Seeds</div>
          <div class="ms-country"><strong data-jp>ブラジル</strong><strong data-en>Brazil</strong><span>BR · BRAZIL</span></div>
        </a>
        <a class="ms-cell" href="#origins" aria-label="Brisa and Tierra — Panama">
          <div class="ms-flag" aria-hidden="true">
            <svg viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg"><rect width="30" height="21" fill="#fff"/><rect x="30" width="30" height="21" fill="#D21034"/><rect y="21" width="30" height="21" fill="#005AA7"/><rect x="30" y="21" width="30" height="21" fill="#fff"/><polygon points="15,8 17,13 22,13 18,16 19,21 15,18 11,21 12,16 8,13 13,13" fill="#005AA7"/><polygon points="45,29 47,34 52,34 48,37 49,42 45,39 41,42 42,37 38,34 43,34" fill="#D21034"/></svg>
          </div>
          <div class="ms-name">Brisa and Tierra</div>
          <div class="ms-country"><strong data-jp>パナマ</strong><strong data-en>Panama</strong><span>PA · PANAMA</span></div>
        </a>
        <a class="ms-cell" href="#origins" aria-label="ORIOWL — Taiwan">
          <div class="ms-flag" aria-hidden="true">
            <svg viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="42" fill="#FE0000"/><rect width="36" height="25" fill="#000095"/><circle cx="18" cy="12.5" r="8" fill="#fff"/></svg>
          </div>
          <div class="ms-name">ORIOWL</div>
          <div class="ms-country"><strong data-jp>台湾</strong><strong data-en>Taiwan</strong><span>TW · TAIWAN</span></div>
        </a>
        <a class="ms-cell" href="#origins" aria-label="PuraVida — Costa Rica">
          <div class="ms-flag" aria-hidden="true">
            <svg viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="42" fill="#fff"/><rect width="60" height="8" fill="#002868"/><rect y="34" width="60" height="8" fill="#002868"/><rect y="14" width="60" height="14" fill="#CE1126"/></svg>
          </div>
          <div class="ms-name">PuraVida</div>
          <div class="ms-country"><strong data-jp>コスタリカ</strong><strong data-en>Costa Rica</strong><span>CR · COSTA RICA</span></div>
        </a>
        <a class="ms-cell" href="#origins" aria-label="Rational Idea — Indonesia">
          <div class="ms-flag" aria-hidden="true">
            <svg viewBox="0 0 60 42" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="21" fill="#FF0000"/><rect y="21" width="60" height="21" fill="#fff"/></svg>
          </div>
          <div class="ms-name">Rational Idea</div>
          <div class="ms-country"><strong data-jp>インドネシア</strong><strong data-en>Indonesia</strong><span>ID · INDONESIA</span></div>
        </a>
      </div>
    </div>
  </section>

  <!-- ===== Concept ===== -->
  <section id="concept" class="section section--light">
    <div class="container">
      <p class="section-eyebrow"><span data-jp>LinkOne とは</span><span data-en>About LinkOne</span></p>
      <h2 class="section-title" data-jp>特定産地の専門商社が、<br>横でつながる。</h2>
      <h2 class="section-title" data-en>Origin specialists,<br>linked as one.</h2>
      <p class="lead" data-jp>LinkOne は、特定の国・地域の生豆を専門的に扱う輸入商社が集まったアライアンスです。各社が現地で築いた直接取引のルートを横につなぎ、自家焙煎事業者の皆さまに広い選択肢と高い透明性を提供します。</p>
      <p class="lead" data-en>LinkOne brings together specialty green coffee importers, each focused on a single country or region. By linking their direct-trade routes, we offer roasters a wider selection and unmatched transparency.</p>
      <p class="lead" data-jp>現在は5社で構成し、ブラジル・パナマ・台湾・コスタリカ・インドネシアを擁します。今後、世界各国の専門商社の参加を予定しており、グローバルなネットワークへと拡大していきます。</p>
      <p class="lead" data-en>Today, five member companies cover Brazil, Panama, Taiwan, Costa Rica, and Indonesia. Specialists from additional origins will join as the network grows globally.</p>

      <dl class="concept-pills">
        <div class="concept-pill"><dt data-jp>直接取引</dt><dt data-en>Direct Trade</dt><dd data-jp>すべて加盟各社が現地と直接取引するロットのみ。</dd><dd data-en>All lots are sourced through each member's direct relationships.</dd></div>
        <div class="concept-pill"><dt data-jp>専門性と希少性</dt><dt data-en>Specialty &amp; Scarcity</dt><dd data-jp>特定産地に特化した専門性と、限定ロットの希少性。</dd><dd data-en>Origin-focused expertise and access to limited, scarce lots.</dd></div>
        <div class="concept-pill"><dt data-jp>完全なトレーサビリティ</dt><dt data-en>Full Traceability</dt><dd data-jp>農園から焙煎所まで一気通貫で見える流通。</dd><dd data-en>Transparent supply from farm to roastery.</dd></div>
        <div class="concept-pill"><dt data-jp>豊富なバリエーション</dt><dt data-en>Wide Variety</dt><dd data-jp>5産地 × 多品種・多精製の幅広いラインナップ。</dd><dd data-en>5 origins × diverse cultivars and processes.</dd></div>
      </dl>
    </div>
  </section>

  <!-- ===== MVV ===== -->
  <section id="mvv" class="section">
    <div class="container">
      <p class="section-eyebrow">MISSION · VISION · VALUES</p>
      <h2 class="section-title" data-jp>使命、目指す姿、<br>そして価値観。</h2>
      <h2 class="section-title" data-en>Mission, vision,<br>and values.</h2>
      <p class="lead" data-jp>「競争から共創へ。」LinkOne の活動は、加盟各社が共有する思想の上に成り立っています。産地から焙煎所までの流通を、誠実に、持続可能に。</p>
      <p class="lead" data-en>"From competition, to co-creation." LinkOne is built on a shared philosophy among its members — an honest, sustainable supply chain from origin to roastery.</p>

      <div class="mvv-3col">
        <article class="mvv-cell">
          <span class="mvv-num">i.</span>
          <span class="mvv-label">Mission</span>
          <h3 data-jp>つながりで、世界の<br>ユニークな産地を届ける。</h3>
          <h3 data-en>Connected origins,<br>delivered uniquely.</h3>
          <p data-jp>世界各国の優れたインポーターが連携することで、持続可能で利益ある輸入活動を実現し、自家焙煎事業者の利便性を高め、高品質でユニークなコーヒーを届けます。</p>
          <p data-en>By connecting top importers from around the world, we sustain profitable trade, simplify sourcing for roasters, and deliver original specialty coffee.</p>
        </article>
        <article class="mvv-cell">
          <span class="mvv-num">ii.</span>
          <span class="mvv-label">Vision</span>
          <h3 data-jp>競争から共創へ、<br>コーヒーの未来を共に。</h3>
          <h3 data-en>From competition,<br>to co-creation.</h3>
          <p data-jp>世界のスペシャルティコーヒーを結ぶ"ひとつのネットワーク"として、産地・輸入者・ロースター・消費者すべてに価値をもたらす持続可能な流通モデルとなります。</p>
          <p data-en>As "one network" linking specialty coffee globally, we aim to be a sustainable distribution model that serves origins, importers, roasters, and end-users alike.</p>
        </article>
        <article class="mvv-cell">
          <span class="mvv-num">iii.</span>
          <span class="mvv-label">Values</span>
          <h3 data-jp>5つの価値観を、<br>共に守る。</h3>
          <h3 data-en>Five shared<br>values.</h3>
          <p data-jp>Link(つながり)、Integrity(誠実さ)、Sustainability(持続可能性)、Uniqueness(個性)、Customer-Centric(顧客志向)。これらが LinkOne の活動の土台です。</p>
          <p data-en>Link, Integrity, Sustainability, Uniqueness, and Customer-Centric — the foundation of every LinkOne activity.</p>
        </article>
      </div>

      <div class="values-grid values-grid--num">
        <div class="value-card value-card--red">
          <span class="value-num">01</span>
          <h4>Link <small data-jp>つながり</small><small data-en>Connection</small></h4>
          <p data-jp>協力関係を大切にし、知識・情報・利益を共有します。</p>
          <p data-en>We value collaboration — sharing knowledge, information, and benefits.</p>
        </div>
        <div class="value-card value-card--yellow">
          <span class="value-num">02</span>
          <h4>Integrity <small data-jp>誠実さ</small><small data-en>Integrity</small></h4>
          <p data-jp>誠実で透明な取引を通じて、信頼される存在であり続けます。</p>
          <p data-en>We earn trust through honest, transparent business practices.</p>
        </div>
        <div class="value-card value-card--green">
          <span class="value-num">03</span>
          <h4>Sustainability <small data-jp>持続可能性</small><small data-en>Sustainability</small></h4>
          <p data-jp>環境・人・文化を尊重し、持続可能なコーヒー産業を支えます。</p>
          <p data-en>We respect the environment, people, and culture — supporting a sustainable coffee industry.</p>
        </div>
        <div class="value-card value-card--teal">
          <span class="value-num">04</span>
          <h4>Uniqueness <small data-jp>個性</small><small data-en>Uniqueness</small></h4>
          <p data-jp>各社の専門性と、産地の個性を活かしたユニークな価値をお届けします。</p>
          <p data-en>Each member's expertise and each origin's character — delivered as unique value.</p>
        </div>
        <div class="value-card value-card--red">
          <span class="value-num">05</span>
          <h4>Customer-Centric <small data-jp>顧客志向</small><small data-en>Customer-Centric</small></h4>
          <p data-jp>自家焙煎事業者の選択肢を広げ、体験の向上を追求します。</p>
          <p data-en>We expand options and pursue better experiences for roasters.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== Origins (World Map) ===== -->
  <section id="origins" class="section section--map">
    <div class="container">
      <p class="section-eyebrow">ORIGINS</p>
      <h2 class="section-title" data-jp>5つの産地、ひとつのネットワーク。</h2>
      <h2 class="section-title" data-en>Five origins, one network.</h2>
      <p class="lead" data-jp>地図上のピンをクリックして、各産地の専門商社・取扱品種・主要プロセスをご覧ください。今後、参加インポーターの増加に伴い、産地は世界各国に拡大していきます。</p>
      <p class="lead" data-en>Click any pin to see the importer, varieties, and processes for each origin. As more partners join, our network will continue to expand globally.</p>

      <div class="world-map" data-world-map>
        <svg class="world-map-svg" viewBox="0 0 1000 500" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <g class="continents">
            <path d="M50,80 C35,120 35,180 70,215 C115,245 185,255 250,250 C310,242 355,215 350,160 C335,115 285,85 220,75 C155,68 90,72 50,80 Z"/>
            <path d="M240,225 L255,235 L265,250 L260,260 L245,255 L235,240 Z"/>
            <path d="M315,35 C300,55 305,85 335,90 C360,80 365,55 350,35 Z"/>
            <path d="M280,255 C265,295 270,345 295,395 C320,425 360,425 385,395 C400,355 400,300 380,260 C355,240 315,240 280,255 Z"/>
            <path d="M462,95 C458,108 470,118 480,108 C480,95 470,90 462,95 Z"/>
            <path d="M475,80 C460,110 470,140 500,150 C535,150 570,135 565,105 C555,80 510,68 475,80 Z"/>
            <path d="M480,165 C460,210 470,275 500,335 C535,360 580,355 605,310 C615,255 605,200 575,170 C540,150 500,150 480,165 Z"/>
            <path d="M580,180 C575,200 590,220 610,215 C625,200 620,180 600,170 C588,170 580,175 580,180 Z"/>
            <path d="M600,80 C580,115 600,160 645,170 C715,170 785,150 840,130 C885,115 895,150 875,200 C840,235 770,250 700,240 C640,225 605,195 595,150 Z"/>
            <path d="M700,180 C695,210 710,235 730,235 C745,225 745,200 735,180 C720,175 705,177 700,180 Z"/>
            <path d="M860,135 C855,155 870,170 882,158 C883,140 872,128 860,135 Z"/>
            <path d="M755,260 C740,275 760,295 800,295 C850,290 880,275 855,260 C815,250 770,255 755,260 Z"/>
            <path d="M820,235 C815,250 828,260 838,250 C840,238 832,230 820,235 Z"/>
            <path d="M820,310 C795,330 800,365 850,375 C895,370 920,345 910,310 C880,295 840,300 820,310 Z"/>
            <path d="M925,365 C922,378 935,385 940,375 C940,365 932,360 925,365 Z"/>
          </g>
        </svg>

        <ul class="origin-dots" data-origin-dots aria-label="コーヒー産地マップ"></ul>

        <div class="map-edit-toolbar" data-edit-toolbar hidden>
          <span class="map-edit-mode">EDIT MODE</span>
          <button type="button" class="map-edit-btn" data-add>＋ ドット追加</button>
          <button type="button" class="map-edit-btn" data-export>JSONエクスポート</button>
          <button type="button" class="map-edit-btn" data-import>JSONインポート</button>
          <button type="button" class="map-edit-btn map-edit-btn--danger" data-reset>初期化</button>
          <a class="map-edit-btn map-edit-btn--exit" href="?">編集終了</a>
        </div>

        <p class="world-map-note" data-map-note><span data-jp>点滅ドットをクリックすると詳細が表示されます。</span><span data-en>Click any pulsing pin to see origin details.</span></p>
      </div>
    </div>

    <aside class="map-edit-form" data-edit-form hidden aria-label="ドット編集">
      <header class="map-edit-form__head">
        <h4>ドットを編集</h4>
        <button type="button" class="map-edit-form__close" data-close aria-label="閉じる">×</button>
      </header>
      <div class="map-edit-form__body">
        <label>ラベル<input name="label" type="text" /></label>
        <label>タイトル<input name="title" type="text" /></label>
        <label>説明<textarea name="description" rows="4"></textarea></label>
        <label>リンクURL<input name="linkUrl" type="text" placeholder="https://… または #origins" /></label>
        <label>画像URL<input name="imageUrl" type="url" placeholder="https://…" /></label>
        <div class="map-edit-form__grid">
          <label>色<input name="color" type="color" /></label>
          <label>X (%)<input name="x" type="number" min="0" max="100" step="0.1" /></label>
          <label>Y (%)<input name="y" type="number" min="0" max="100" step="0.1" /></label>
        </div>
        <label class="map-edit-form__check">
          <input name="bottomLayer" type="checkbox" />
          <span>最背面レイヤー(クリック透過)</span>
        </label>
        <button type="button" class="map-edit-form__delete" data-delete>このドットを削除</button>
      </div>
    </aside>
  </section>

  <div class="origin-modal" data-origin-modal hidden role="dialog" aria-modal="true" aria-labelledby="originModalTitle">
    <div class="origin-modal__backdrop" data-modal-close></div>
    <div class="origin-modal__content">
      <button type="button" class="origin-modal__close" data-modal-close aria-label="閉じる">×</button>
      <img class="origin-modal__image" data-modal-image alt="" hidden />
      <h3 id="originModalTitle" class="origin-modal__title" data-modal-title></h3>
      <p class="origin-modal__desc" data-modal-desc></p>
      <a class="btn btn--primary origin-modal__link" data-modal-link href="#" hidden>詳細を見る</a>
    </div>
  </div>

  <!-- ===== Activities ===== -->
  <section id="activities" class="section section--light">
    <div class="container">
      <p class="section-eyebrow">ACTIVITIES</p>
      <h2 class="section-title" data-jp>活動内容。</h2>
      <h2 class="section-title" data-en>Activities.</h2>
      <p class="lead" data-jp>合同カッピング、合同展示会出展、ノウハウ共有、共通発信。加盟各社が連携することで、自家焙煎事業者にとって「探しやすく、選びやすい」環境をつくります。</p>
      <p class="lead" data-en>Joint cuppings, shared trade-show booths, knowledge sharing, and unified communications. Together we make sourcing easier for roasters.</p>

      <div class="activity-grid">
        <article class="activity-card">
          <div class="activity-num">01 / Activity</div>
          <h3 data-jp>合同カッピング</h3>
          <h3 data-en>Joint Cupping</h3>
          <p data-jp>複数のインポーターが一堂に会する合同カッピングを定期開催。多彩な産地のロットを横断的に比較できます。</p>
          <p data-en>Regularly hosted cupping sessions where multiple importers gather. Roasters can compare lots across origins in one place.</p>
          <ul>
            <li data-jp>多彩な産地のロットを一度に比較</li>
            <li data-en>Compare lots across origins at once</li>
            <li data-jp>各社の出展負担をシェアし、参加コストを抑制</li>
            <li data-en>Shared logistics, lower per-event cost</li>
            <li data-jp>新規焙煎所との接点を共同創出</li>
            <li data-en>Joint outreach to new roasteries</li>
          </ul>
        </article>
        <article class="activity-card">
          <div class="activity-num">02 / Activity</div>
          <h3 data-jp>合同展示会出展</h3>
          <h3 data-en>Trade Shows</h3>
          <p data-jp>SCAJ をはじめ、各地のコーヒー・食品系展示会に LinkOne として共同出展します。</p>
          <p data-en>We exhibit jointly at SCAJ and other coffee &amp; food trade shows under the LinkOne banner.</p>
          <ul>
            <li data-jp>ブースの視認性・印象強化</li>
            <li data-en>Stronger booth presence and brand recall</li>
            <li data-jp>出展費用・人的負担をシェア</li>
            <li data-en>Costs and staffing shared across members</li>
            <li data-jp>展示とカッピングの連動体験</li>
            <li data-en>Connected exhibition + cupping experience</li>
          </ul>
        </article>
        <article class="activity-card">
          <div class="activity-num">03 / Activity</div>
          <h3 data-jp>ノウハウ共有</h3>
          <h3 data-en>Knowledge Sharing</h3>
          <p data-jp>マーケット動向、物流、品質管理など、日々の知見を持ち寄る勉強会を開催します。</p>
          <p data-en>Internal study sessions where members share market, logistics, and quality-control insights.</p>
          <ul>
            <li data-jp>各社の強みを活かした情報交換</li>
            <li data-en>Cross-pollinating each member's strengths</li>
            <li data-jp>輸入実務・品質・マーケのベストプラクティス</li>
            <li data-en>Best practices: trade ops, QC, marketing</li>
            <li data-jp>新規国・生産者との共同リサーチ</li>
            <li data-en>Joint research on new origins and producers</li>
          </ul>
        </article>
        <article class="activity-card">
          <div class="activity-num">04 / Activity</div>
          <h3 data-jp>共通SNS・WEB発信</h3>
          <h3 data-en>Communications</h3>
          <p data-jp>LinkOne ブランドとして、Instagram・Web を通じた認知形成と発信を行います。</p>
          <p data-en>We build awareness as the LinkOne brand via Instagram and our website.</p>
          <ul>
            <li data-jp>Instagram・Web での統合的な認知形成</li>
            <li data-en>Integrated brand presence on Instagram &amp; web</li>
            <li data-jp>各社の商品・活動のクロス紹介</li>
            <li data-en>Cross-promotion of member offerings</li>
            <li data-jp>イベント情報・産地紹介の発信</li>
            <li data-en>Event news and origin storytelling</li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <!-- ===== Event ===== -->
  <section id="events" class="section">
    <div class="container">
      <p class="section-eyebrow">EVENT</p>
      <h2 class="section-title" data-jp>次回イベント · SCAJ2026 共同出展。</h2>
      <h2 class="section-title" data-en>Next event · SCAJ 2026 joint booth.</h2>
      <p class="lead" data-jp>2026年10月、LinkOne として SCAJ2026 に共同出展いたします。加盟各社のシグネチャーロットを一つのブースで。詳細は順次公開予定です。</p>
      <p class="lead" data-en>In October 2026, LinkOne will exhibit jointly at SCAJ 2026. Member signature lots gathered at one booth. Details coming soon.</p>

      <div class="event-grid">
        <article class="event-poster">
          <div class="event-poster__top">
            <span>LinkOne · SCAJ 2026</span>
            <span>Coming Soon</span>
          </div>
          <div class="event-poster__date">
            <div class="event-poster__day">14<em>–17</em></div>
            <div class="event-poster__ymd">OCT · 2026</div>
          </div>
          <div class="event-poster__bot">
            <strong>SCAJ 2026 (Tokyo)</strong>
            <span data-jp>LinkOne 共同ブース · 詳細は順次公開</span>
            <span data-en>LinkOne joint booth · details coming soon</span>
          </div>
        </article>
        <div class="event-detail">
          <h3 data-jp>共同出展について</h3>
          <h3 data-en>About the joint booth</h3>
          <p data-jp>加盟各社の代表ロットを一つのブースに集約。カッピングを併設し、ロースター様のご来場をお待ちしております。出展ロットの詳細・カッピング予約は決定次第、本ページとSNSで告知します。</p>
          <p data-en>Member signature lots all in one booth, with on-site cupping. Roasters are warmly invited. Lot details and cupping reservations will be announced here and on SNS.</p>
          <a class="btn btn--ghost" href="#sample"><span data-jp>サンプル依頼で先行入手</span><span data-en>Request samples in advance</span></a>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== Sample Request ===== -->
  <section id="sample" class="section section--cta">
    <div class="container">
      <p class="section-eyebrow">SAMPLE REQUEST</p>
      <h2 class="section-title" data-jp>サンプル依頼。</h2>
      <h2 class="section-title" data-en>Request samples.</h2>
      <p class="lead" data-jp>LinkOne 加盟各社のサンプル豆を、自家焙煎事業者の皆さまへお送りします。<br>初めての方はユーザー登録、登録済みの方はログインの上、サンプルをご依頼ください。</p>
      <p class="lead" data-en>We send sample lots from LinkOne members to qualified roasters. Register or log in to submit your request.</p>

      <div class="auth-tabs" role="tablist">
        <button class="auth-tab is-active" data-tab="login" role="tab"><span data-jp>ログイン</span><span data-en>Log in</span></button>
        <button class="auth-tab" data-tab="register" role="tab"><span data-jp>新規ユーザー登録</span><span data-en>Register</span></button>
      </div>

      <form class="auth-form is-active" data-form="login" autocomplete="on">
        <div class="form-row">
          <label><span data-jp>メールアドレス</span><span data-en>Email</span>
            <input type="email" name="email" required autocomplete="email" />
          </label>
        </div>
        <div class="form-row">
          <label><span data-jp>パスワード</span><span data-en>Password</span>
            <input type="password" name="password" required autocomplete="current-password" />
          </label>
        </div>
        <button type="submit" class="btn btn--primary btn--block"><span data-jp>ログイン</span><span data-en>Log in</span></button>
      </form>

      <form class="auth-form" data-form="register" autocomplete="on">
        <div class="form-grid">
          <label><span data-jp>氏名</span><span data-en>Name</span> <span class="req">*</span>
            <input type="text" name="name" required autocomplete="name" placeholder="例) 山田 太郎" />
          </label>
          <label><span data-jp>会社名 / 店舗名 / 屋号</span><span data-en>Company / Roastery</span> <span class="req">*</span>
            <input type="text" name="company" required autocomplete="organization" placeholder="例) Mirai Coffee Roasters" />
          </label>
          <label class="form-row--full"><span data-jp>住所</span><span data-en>Address</span> <span class="req">*</span>
            <input type="text" name="address" required autocomplete="street-address" placeholder="例) 東京都千代田区丸の内1-1-1" />
          </label>
          <label><span data-jp>電話番号</span><span data-en>Phone</span> <span class="req">*</span>
            <input type="tel" name="phone" required autocomplete="tel" placeholder="例) 03-1234-5678" />
          </label>
          <label><span data-jp>メールアドレス</span><span data-en>Email</span> <span class="req">*</span>
            <input type="email" name="email" required autocomplete="email" />
          </label>
          <label><span data-jp>パスワード</span><span data-en>Password</span> <span class="req">*</span>
            <input type="password" name="password" required minlength="6" autocomplete="new-password" />
          </label>
          <label><span data-jp>パスワード(確認)</span><span data-en>Password (confirm)</span> <span class="req">*</span>
            <input type="password" name="passwordConfirm" required minlength="6" autocomplete="new-password" />
          </label>
        </div>
        <label class="check">
          <input type="checkbox" name="agree" required />
          <span data-jp>個人情報の取扱いに同意します</span><span data-en>I agree to the privacy policy</span>
        </label>
        <button type="submit" class="btn btn--primary btn--block"><span data-jp>登録してサンプル依頼へ進む</span><span data-en>Register and continue</span></button>
      </form>

      <div class="sample-panel" data-sample-panel hidden>
        <div class="logged-in-bar">
          <span><span data-jp>ログイン中:</span><span data-en>Logged in as:</span> <strong data-user-name></strong> / <span data-user-company></span></span>
          <button type="button" class="link-btn" data-logout><span data-jp>ログアウト</span><span data-en>Log out</span></button>
        </div>
        <h3 class="sub-title" data-jp>サンプル豆を選択</h3>
        <h3 class="sub-title" data-en>Select sample origins</h3>
        <form class="sample-form" data-form="sample">
          <div class="sample-grid">
            <label class="sample-pick"><input type="checkbox" name="origins" value="ブラジル / Mirai Seeds" /><span>🇧🇷 ブラジル — Mirai Seeds</span></label>
            <label class="sample-pick"><input type="checkbox" name="origins" value="パナマ / Brisa and Tierra" /><span>🇵🇦 パナマ — Brisa and Tierra</span></label>
            <label class="sample-pick"><input type="checkbox" name="origins" value="台湾 / ORIOWL" /><span>🇹🇼 台湾 — ORIOWL</span></label>
            <label class="sample-pick"><input type="checkbox" name="origins" value="コスタリカ / PuraVida" /><span>🇨🇷 コスタリカ — PuraVida</span></label>
            <label class="sample-pick"><input type="checkbox" name="origins" value="インドネシア / Rational Idea" /><span>🇮🇩 インドネシア — Rational Idea</span></label>
          </div>
          <label class="form-row--full"><span data-jp>ご要望・備考</span><span data-en>Notes</span>
            <textarea name="note" rows="4" placeholder="ご希望のロット、用途、納期など"></textarea>
          </label>
          <button type="submit" class="btn btn--primary btn--block"><span data-jp>サンプルを依頼する</span><span data-en>Submit request</span></button>
        </form>
      </div>

      <div class="form-msg" data-msg role="status" aria-live="polite"></div>
    </div>
  </section>

  <!-- ===== Footer ===== -->
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="brand-name">LinkOne</span>
        <p data-jp>"競争から、共創へ。"</p>
        <p data-en>"From competition,<br>to co-creation."</p>
      </div>
      <div class="footer-links">
        <h4>Navigate</h4>
        <a href="#concept"><span data-jp>コンセプト</span><span data-en>Concept</span></a>
        <a href="#mvv"><span data-jp>ミッション</span><span data-en>Mission</span></a>
        <a href="#origins"><span data-jp>5つの産地</span><span data-en>Origins</span></a>
        <a href="#activities"><span data-jp>活動</span><span data-en>Activities</span></a>
        <a href="#events"><span data-jp>イベント</span><span data-en>Event</span></a>
      </div>
      <div class="footer-links">
        <h4>Origins</h4>
        <a href="#origins">Brazil — Mirai Seeds</a>
        <a href="#origins">Panama — Brisa and Tierra</a>
        <a href="#origins">Taiwan — ORIOWL</a>
        <a href="#origins">Costa Rica — PuraVida</a>
        <a href="#origins">Indonesia — Rational Idea</a>
      </div>
      <div class="footer-links">
        <h4>Contact</h4>
        <a href="#sample"><span data-jp>サンプル依頼</span><span data-en>Sample Request</span></a>
        <a href="#events"><span data-jp>イベント参加</span><span data-en>Event RSVP</span></a>
        <a href="#" data-edit-url><span data-jp>パートナーシップ</span><span data-en>Partnership</span></a>
        <a href="#" data-edit-url><span data-jp>プレス</span><span data-en>Press</span></a>
        <a href="#" data-edit-url>Instagram</a>
      </div>
    </div>
    <div class="footer-bottom container">
      <small>© 2026 LinkOne. All rights reserved.</small>
      <small data-jp>Tokyo · 世界へ拡大中 — Specialty Coffee Importers Alliance</small>
      <small data-en>Tokyo · Growing globally — Specialty Coffee Importers Alliance</small>
    </div>
  </footer>

  <?php wp_footer(); ?>
</body>
</html>
