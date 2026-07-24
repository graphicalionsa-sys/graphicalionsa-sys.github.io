/* ============================================================
   CASE STUDY RENDERER — reads ?p=<slug>, builds the page from
   window.CASES following the case template structure.
   ============================================================ */
(function () {
  'use strict';

  var slug = new URLSearchParams(location.search).get('p') || 'istories';
  var data = window.CASES[slug] || window.CASES.istories;
  var order = window.CASE_ORDER;
  var idx = order.indexOf(slug);
  var nextSlug = order[(idx + 1) % order.length];
  var next = window.CASES[nextSlug];

  document.title = data.title + ' — Keabetsoe Tau';
  document.body.classList.toggle('case--nsp-editorial', data.layout === 'nsp-editorial');
  document.body.classList.toggle('case--wpo-editorial', data.layout === 'wpo-editorial');
  document.body.classList.toggle('case--mobsie-editorial', data.layout === 'mobsie-editorial');
  document.body.classList.toggle('case--istories-editorial', data.layout === 'istories-editorial');
  document.body.classList.toggle('case--liveeasy-editorial', data.layout === 'liveeasy-editorial');
  document.body.classList.toggle('case--shopx-editorial', data.layout === 'shopx-editorial');
  document.body.classList.toggle('case--glenlivet-editorial', data.layout === 'glenlivet-editorial');
  document.body.classList.toggle('case--studio-editorial', data.layout === 'studio-editorial');
  document.body.classList.toggle('case--ultramel-editorial', data.layout === 'ultramel-editorial');
  if ((data.layout === 'studio-editorial' || data.layout === 'ultramel-editorial') && data.editorial && data.editorial.light) {
    document.body.classList.add('case--light');
  }
  var description = document.querySelector('meta[name="description"]');
  if (description && data.metaDescription) description.setAttribute('content', data.metaDescription);

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function paras(items) {
    return items.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  }

  function nspFigure(path, alt, extraClass, caption) {
    return '<figure class="nsp-figure ' + (extraClass || '') + '" data-reveal>' +
      '<img src="assets/img/case/' + path + '" alt="' + esc(alt || '') + '" loading="lazy">' +
      (caption ? '<figcaption>' + esc(caption) + '</figcaption>' : '') +
      '</figure>';
  }

  function renderNSPEditorial(d) {
    var e = d.editorial;
    var apps = e.applications.images.map(function (im) {
      return nspFigure(im[0], im[1], 'nsp-app-card', '');
    }).join('');
    var principles = e.selected.principles.map(function (item) {
      return '<article class="nsp-principle" data-reveal>' +
        '<h3>' + esc(item[0]) + '</h3><p>' + esc(item[1]) + '</p></article>';
    }).join('');
    return '<article class="nsp-case">' +
      '<header class="nsp-hero" data-reveal>' +
        '<img src="' + d.heroImg + '" alt="National Strategic Plan campaign displayed across a public billboard." fetchpriority="high">' +
        '<span class="nsp-hero-shade" aria-hidden="true"></span>' +
        '<div class="nsp-hero-copy"><span class="nsp-kicker">SANAC · South Africa · 2023</span>' +
          '<h1 class="h-display">' + esc(d.title) + '</h1><p>' + esc(d.intro) + '</p></div>' +
      '</header>' +
      '<div class="nsp-meta" data-reveal>' +
        '<div><b>Client</b><span>' + esc(d.client) + '</span></div>' +
        '<div><b>Disciplines</b><span>Brand identity, logo design, art direction, visual system</span></div>' +
        '<div><b>Role</b><span>' + esc(d.role) + '</span></div>' +
        '<div><b>Year</b><span>' + esc(d.year) + '</span></div>' +
      '</div>' +
      '<section class="nsp-section nsp-introduction">' +
        '<div data-reveal><span class="nsp-eyebrow">' + esc(e.introduction.eyebrow) + '</span>' +
          '<h2 class="h-display">' + esc(e.introduction.h) + '</h2></div>' +
        '<div class="nsp-body" data-reveal>' + paras(e.introduction.body) + '</div>' +
      '</section>' +
      '<section class="nsp-section nsp-challenge">' +
        '<div class="nsp-copy" data-reveal><span class="nsp-eyebrow">' + esc(e.challenge.eyebrow) + '</span>' +
          '<h2 class="h-display">' + esc(e.challenge.h) + '</h2><div class="nsp-body">' + paras(e.challenge.body) + '</div></div>' +
        nspFigure(e.challenge.image, e.challenge.alt, 'nsp-challenge-image', '') +
        '<blockquote data-reveal>“' + esc(e.challenge.quote) + '”</blockquote>' +
      '</section>' +
      '<section class="nsp-section nsp-exploration">' +
        '<div class="nsp-section-lead" data-reveal><span class="nsp-eyebrow">' + esc(e.exploration.eyebrow) + '</span>' +
          '<h2 class="h-display">' + esc(e.exploration.h) + '</h2><div class="nsp-body">' + paras(e.exploration.body) + '</div></div>' +
        nspFigure(e.exploration.image, e.exploration.alt, 'nsp-logo-routes', e.exploration.caption) +
      '</section>' +
      '<section class="nsp-section nsp-selected">' +
        '<div class="nsp-selected-copy" data-reveal><span class="nsp-eyebrow">' + esc(e.selected.eyebrow) + '</span>' +
          '<h2 class="h-display">' + esc(e.selected.h) + '</h2><div class="nsp-body">' + paras(e.selected.body) + '</div></div>' +
        '<figure class="nsp-selected-mark" role="img" aria-label="Selected National Strategic Plan logo formed by people around a shared circular table" data-reveal>' +
          '<img src="assets/img/case/' + e.exploration.image + '" alt=""></figure>' +
        '<div class="nsp-principles">' + principles + '</div>' +
      '</section>' +
      '<section class="nsp-section nsp-platform">' +
        '<div class="nsp-section-lead" data-reveal><span class="nsp-eyebrow">' + esc(e.platform.eyebrow) + '</span>' +
          '<h2 class="h-display">' + esc(e.platform.h) + '</h2><div class="nsp-body">' + paras(e.platform.body) + '</div></div>' +
        nspFigure(e.platform.image, e.platform.alt, 'nsp-platform-image', e.platform.caption) +
      '</section>' +
      '<section class="nsp-section nsp-applications">' +
        '<div class="nsp-section-lead" data-reveal><span class="nsp-eyebrow">' + esc(e.applications.eyebrow) + '</span>' +
          '<h2 class="h-display">' + esc(e.applications.h) + '</h2><div class="nsp-body">' + paras(e.applications.body) + '</div></div>' +
        '<div class="nsp-app-grid">' + apps + '</div>' +
      '</section>' +
      '<section class="nsp-section nsp-outcome">' +
        '<div class="nsp-outcome-copy" data-reveal><div><span class="nsp-eyebrow">' + esc(e.outcome.eyebrow) + '</span>' +
          '<h2 class="h-display">' + esc(e.outcome.h) + '</h2></div><div class="nsp-body">' + paras(e.outcome.body) + '</div></div>' +
        nspFigure(e.outcome.image, e.outcome.alt, 'nsp-outcome-image', e.outcome.caption) +
      '</section>' +
      '<section class="nsp-role"><div data-reveal><span class="nsp-eyebrow">Contribution</span>' +
        '<h2 class="h-display">My Role</h2></div><div data-reveal><p>' + esc(d.roleCopy) + '</p>' +
        '<ul>' + d.roleTags.map(function (tag) { return '<li>' + esc(tag) + '</li>'; }).join('') + '</ul></div></section>' +
    '</article>';
  }

  function wpoFigure(path, alt, extraClass) {
    return '<figure class="wpo-figure ' + (extraClass || '') + '" data-reveal>' +
      '<img src="assets/img/case/' + path + '" alt="' + esc(alt || '') + '" loading="lazy">' +
      '<span class="wpo-image-wash" aria-hidden="true"></span></figure>';
  }

  function wpoHeading(section, extraClass) {
    return '<div class="wpo-heading ' + (extraClass || '') + '" data-reveal>' +
      (section.number ? '<span class="wpo-number">' + esc(section.number) + '</span>' : '') +
      '<div><span class="wpo-eyebrow">' + esc(section.eyebrow) + '</span>' +
      '<h2>' + esc(section.h) + '</h2></div></div>';
  }

  function renderWPOEditorial(d) {
    var e = d.editorial;
    var principles = e.approach.principles.map(function (item, i) {
      return '<article class="wpo-principle wpo-principle--' + (i + 1) + '" data-reveal>' +
        wpoFigure(item[2], item[0], '') +
        '<div><span>0' + (i + 1) + '</span><h3>' + esc(item[0]) + '</h3><p>' + esc(item[1]) + '</p></div></article>';
    }).join('');
    var culture = e.culture.images.map(function (path, i) {
      return wpoFigure(path, 'WPO cultural storytelling campaign artwork.', 'wpo-culture-tile wpo-culture-tile--' + (i + 1));
    }).join('');
    var outcome = e.outcome.images.map(function (path, i) {
      return wpoFigure(path, 'Women Presidents Organization digital campaign application.', 'wpo-outcome-tile wpo-outcome-tile--' + (i + 1));
    }).join('');
    var roleItems = e.role.responsibilities.map(function (item) {
      return '<li>' + esc(item) + '</li>';
    }).join('');

    return '<article class="wpo-case">' +
      '<header class="wpo-hero">' +
        '<div class="wpo-hero-brand" data-reveal><span class="wpo-monogram">WPO</span><span>Women Presidents<br>Organization</span></div>' +
        '<div class="wpo-hero-grid">' +
          '<div class="wpo-hero-copy" data-reveal><span class="wpo-eyebrow">Portfolio Case Study · 2023–2024</span>' +
            '<h1><span>Designing for</span><span class="serif">Women Who Lead</span></h1>' +
            '<p>' + esc(d.tags) + '</p></div>' +
          '<figure class="wpo-hero-art" data-reveal><img src="' + d.heroImg + '" alt="WPO Reaching Farther. Together campaign featuring women leaders." fetchpriority="high"><span aria-hidden="true"></span></figure>' +
        '</div>' +
        '<div class="wpo-hero-foot" data-reveal><span>Keabetsoe Tau</span><span>Senior Multimedia Designer</span><span>Scroll to explore ↓</span></div>' +
      '</header>' +
      '<div class="wpo-meta" data-reveal>' +
        '<div><b>Client</b><span>' + esc(d.client) + '</span></div>' +
        '<div><b>Scope</b><span>Social design, animation, event invitations and digital communications</span></div>' +
        '<div><b>Role</b><span>' + esc(d.role) + '</span></div>' +
        '<div><b>Year</b><span>' + esc(d.year) + '</span></div>' +
      '</div>' +
      '<section class="wpo-section wpo-overview">' +
        wpoHeading(e.overview, '') +
        '<div class="wpo-copy" data-reveal>' + paras(e.overview.body) + '</div>' +
        '<div class="wpo-overview-grid">' +
          wpoFigure('wpo-editorial/phone-content-system.webp', 'WPO member communications presented on mobile devices.', 'wpo-overview-phone') +
          wpoFigure('wpo-editorial/black-history-month.webp', 'WPO Black History Month portrait campaign.', 'wpo-overview-black-history') +
          wpoFigure('wpo-editorial/member-chapter-news.webp', 'WPO member and chapter news campaign banner.', 'wpo-overview-member') +
        '</div>' +
      '</section>' +
      '<section class="wpo-role">' +
        '<div data-reveal><span class="wpo-eyebrow">' + esc(e.role.eyebrow) + '</span><h2>' + esc(e.role.h) + '</h2></div>' +
        '<div data-reveal><p>' + esc(e.role.body) + '</p><ul>' + roleItems + '</ul></div>' +
      '</section>' +
      '<section class="wpo-section wpo-challenge">' +
        wpoHeading(e.challenge, '') +
        '<div class="wpo-challenge-layout"><div class="wpo-copy" data-reveal>' + paras(e.challenge.body) + '</div>' +
          wpoFigure(e.challenge.image, 'A mobile mockup showing varied WPO content within one coherent visual system.', 'wpo-challenge-image') + '</div>' +
      '</section>' +
      '<section class="wpo-manifesto" data-reveal><span aria-hidden="true">WPO</span><blockquote>Consistency<br><em>without</em> repetition.</blockquote><i aria-hidden="true"></i></section>' +
      '<section class="wpo-section wpo-approach">' +
        wpoHeading(e.approach, '') +
        '<p class="wpo-approach-intro" data-reveal>' + esc(e.approach.body) + '</p>' +
        '<div class="wpo-principles">' + principles + '</div>' +
      '</section>' +
      '<section class="wpo-section wpo-culture">' +
        wpoHeading(e.culture, '') +
        '<p class="wpo-culture-copy" data-reveal>' + esc(e.culture.body) + '</p>' +
        wpoFigure(e.culture.hero, 'WPO Women’s History Month illustration grid.', 'wpo-culture-hero') +
        '<div class="wpo-culture-grid">' + culture + '</div>' +
      '</section>' +
      '<section class="wpo-communications">' +
        '<div class="wpo-communications-copy" data-reveal><span class="wpo-eyebrow">' + esc(e.communications.eyebrow) + '</span><h2>' + esc(e.communications.h) + '</h2><p>' + esc(e.communications.body) + '</p></div>' +
        '<div class="wpo-communications-grid">' +
          wpoFigure(e.communications.images[0], 'WPO member and chapter communication.', 'wpo-comms-member') +
          wpoFigure(e.communications.images[1], 'WPO Reaching Farther. Together event banner.', 'wpo-comms-event') +
        '</div>' +
      '</section>' +
      '<section class="wpo-motion">' +
        '<div class="wpo-motion-copy" data-reveal><span class="wpo-eyebrow">' + esc(e.motion.eyebrow) + '</span><h2>' + esc(e.motion.h) + '</h2><p>' + esc(e.motion.body) + '</p></div>' +
        '<div class="wpo-video-shell" data-reveal><video src="' + e.motion.video + '" poster="' + e.motion.poster + '" muted loop playsinline preload="metadata" controls data-case-video></video><span class="wpo-video-label">Motion study · Play</span></div>' +
      '</section>' +
      '<section class="wpo-section wpo-outcome">' +
        wpoHeading(e.outcome, '') +
        '<div class="wpo-outcome-copy"><p data-reveal>' + esc(e.outcome.body) + '</p><blockquote data-reveal>“' + esc(e.outcome.quote) + '”</blockquote></div>' +
        '<div class="wpo-outcome-grid">' + outcome + '</div>' +
      '</section>' +
    '</article>';
  }

  function mobsieFigure(path, alt, extraClass) {
    return '<figure class="mobsie-figure ' + (extraClass || '') + '" data-reveal>' +
      '<img src="assets/img/case/mobsie-editorial/' + path + '" alt="' + esc(alt || '') + '" loading="lazy">' +
      '<span class="mobsie-reveal" aria-hidden="true"></span></figure>';
  }

  function mobsieHeading(section) {
    return '<div class="mobsie-heading" data-reveal>' +
      (section.number ? '<span class="mobsie-number">' + esc(section.number) + '</span>' : '') +
      '<div><span class="mobsie-eyebrow">' + esc(section.eyebrow) + '</span><h2>' + esc(section.h) + '</h2></div></div>';
  }

  function mobsieList(items, extraClass) {
    return '<ul class="' + (extraClass || '') + '">' + items.map(function (item) {
      return '<li>' + esc(item) + '</li>';
    }).join('') + '</ul>';
  }

  function renderMobsieEditorial(d) {
    var e = d.editorial;
    var socials = [
      ['social-smart-connect.webp', 'Mobsie Connect launch social post showing a child and parent updates.'],
      ['instagram-introducing.webp', 'Introducing Mobsie Connect social media artwork.'],
      ['instagram-coming-soon.webp', 'Mobsie Connect coming soon social media artwork.'],
      ['social-growth.webp', 'Mobsie Connect child growth and progress campaign post.'],
      ['social-moment.webp', 'Mobsie Connect parent and child connection campaign post.'],
      ['social-informed.webp', 'Mobsie Connect school updates campaign post.'],
      ['social-little-win.webp', 'Mobsie Connect child achievement campaign post.']
    ].map(function (item, i) {
      return mobsieFigure(item[0], item[1], 'mobsie-social mobsie-social--' + (i + 1));
    }).join('');
    var appImages = [
      ['app-design-core.webp', 'Core Mobsie Connect app screens including payments, calendar, learning and services.'],
      ['app-design-extended.webp', 'Extended Mobsie Connect app screens including enrolment, profiles and navigation.'],
      ['app-experience-enrolment.webp', 'Mobsie Connect mobile enrolment journey.'],
      ['app-experience-commerce.webp', 'Mobsie Connect notifications, shop, checkout and newsletter screens.'],
      ['app-experience-progress.webp', 'Mobsie Connect feedback, schedule, forms and student report screens.']
    ].map(function (item, i) {
      return mobsieFigure(item[0], item[1], 'mobsie-app-row mobsie-app-row--' + (i + 1));
    }).join('');
    var rollout = [
      ['stationery-corporate.webp', 'Mobsie Connect corporate stationery applications.'],
      ['stationery-school.webp', 'Mobsie Connect school stationery and classroom supplies.'],
      ['school-kit.webp', 'Mobsie Connect backpack, bottle, pencil case and lunch bag.'],
      ['shirt.webp', 'Mobsie Connect branded shirt.'],
      ['cap.webp', 'Mobsie Connect branded cap.'],
      ['car-branding.webp', 'Mobsie Connect vehicle branding.']
    ].map(function (item, i) {
      return mobsieFigure(item[0], item[1], 'mobsie-rollout-item mobsie-rollout-item--' + (i + 1));
    }).join('');

    return '<article class="mobsie-case">' +
      '<header class="mobsie-hero">' +
        '<span class="mobsie-orbit mobsie-orbit--one" aria-hidden="true"></span><span class="mobsie-orbit mobsie-orbit--two" aria-hidden="true"></span>' +
        '<div class="mobsie-hero-copy" data-reveal><span class="mobsie-project">Identity + Digital Experience · 2026</span>' +
          '<div class="mobsie-brand-mark"><i></i><i></i><i></i><b>✦</b></div>' +
          '<h1>Mobsie <span>Connect</span></h1><p class="mobsie-tagline">A Gateway to the Future</p>' +
          '<p class="mobsie-hero-intro">' + esc(d.intro) + '</p>' +
          '<div class="mobsie-hero-tags"><span>Creative Direction</span><span>Brand Identity</span><span>Digital Experience</span></div></div>' +
        '<div class="mobsie-hero-media">' + mobsieFigure('key-visual-princess.webp', 'Mobsie Connect campaign visual featuring a child learning with app notifications.', '') + '</div>' +
      '</header>' +
      '<div class="mobsie-meta" data-reveal>' +
        '<div><b>Project</b><span>' + esc(d.client) + '</span></div><div><b>Role</b><span>' + esc(d.role) + '</span></div>' +
        '<div><b>Contribution</b><span>Logo design, colour palette, typography, visual language and rollout direction</span></div>' +
        '<div><b>Creative Platform</b><span>A Gateway to the Future</span></div></div>' +
      '<section class="mobsie-section mobsie-overview">' +
        mobsieHeading(e.overview) + '<div class="mobsie-copy" data-reveal>' + paras(e.overview.body) + '</div>' +
        '<div class="mobsie-overview-grid">' + mobsieFigure('key-visual-launch.webp', 'Mobsie Connect launch key visual with children and the app.', 'mobsie-overview-kv') +
          mobsieFigure('app-home.webp', 'Mobsie Connect app home screen.', 'mobsie-overview-phone') + '</div>' +
      '</section>' +
      '<section class="mobsie-section mobsie-challenge">' + mobsieHeading(e.challenge) +
        '<div class="mobsie-challenge-copy"><div class="mobsie-copy" data-reveal>' + paras(e.challenge.body) + '</div>' +
          '<div data-reveal><span class="mobsie-mini-label">The Creative Brief</span>' + mobsieList(e.challenge.brief, 'mobsie-checklist') + '</div></div>' +
        '<div class="mobsie-challenge-art">' + mobsieFigure('whatsapp-teaser.webp', 'Mobsie Connect WhatsApp launch communication.', 'mobsie-whatsapp') +
          mobsieFigure('social-informed.webp', 'Mobsie Connect school information campaign post.', 'mobsie-challenge-social') + '</div>' +
        '<blockquote data-reveal>“' + esc(e.challenge.tension) + '”</blockquote>' +
      '</section>' +
      '<section class="mobsie-gateway">' +
        '<div data-reveal><span class="mobsie-number">' + esc(e.idea.number) + '</span><span class="mobsie-eyebrow">' + esc(e.idea.eyebrow) + '</span>' +
          '<h2>A Gateway<br><em>to the Future.</em></h2><div class="mobsie-copy">' + paras(e.idea.body) + '</div></div>' +
        '<div>' + mobsieFigure('key-visual-confidence.webp', 'Mobsie Connect campaign visual about confidence and progress.', '') +
          '<blockquote data-reveal>' + esc(e.idea.quote) + '</blockquote></div>' +
      '</section>' +
      '<section class="mobsie-section mobsie-logo-story">' + mobsieHeading(e.logo) +
        '<div class="mobsie-logo-copy"><div class="mobsie-copy" data-reveal>' + paras(e.logo.body) + '</div>' +
          '<div data-reveal><span class="mobsie-mini-label">Why it works</span>' + mobsieList(e.logo.reasons, 'mobsie-reasons') + '</div></div>' +
        mobsieFigure('logo-breakdown.webp', 'Mobsie Connect logo construction showing people, connection and a central star.', 'mobsie-logo-breakdown') +
        mobsieFigure('logo-variations.webp', 'Mobsie Connect logo lockups and colour variations.', 'mobsie-logo-variations') +
      '</section>' +
      '<section class="mobsie-section mobsie-identity">' + mobsieHeading(e.identity) +
        '<div class="mobsie-copy mobsie-identity-copy" data-reveal>' + paras(e.identity.body) + '</div>' +
        mobsieFigure('colour-palette.webp', 'Mobsie Connect colour palette.', 'mobsie-palette') +
        '<div class="mobsie-font-grid">' + mobsieFigure('font-satoshi.webp', 'Satoshi font family specimen.', 'mobsie-font') +
          mobsieFigure('font-nunito.webp', 'Nunito Bold font specimen.', 'mobsie-font') + mobsieFigure('font-cattalague.webp', 'Cattalague handwritten font specimen.', 'mobsie-font') + '</div>' +
        '<p class="mobsie-system-logic" data-reveal>' + esc(e.identity.logic) + '</p>' +
      '</section>' +
      '<section class="mobsie-visual-world">' +
        '<div class="mobsie-visual-head">' + mobsieHeading(e.visual) + '<div><p data-reveal>' + esc(e.visual.body) + '</p>' +
          mobsieList(e.visual.principles, 'mobsie-visual-principles') + '</div></div>' +
        '<div class="mobsie-kv-grid">' + mobsieFigure('key-visual-launch.webp', 'Mobsie Connect launch key visual.', '') +
          mobsieFigure('key-visual-princess.webp', 'Mobsie Connect brighter future campaign key visual.', '') + mobsieFigure('key-visual-confidence.webp', 'Mobsie Connect confidence campaign key visual.', '') + '</div>' +
        '<div class="mobsie-social-grid">' + socials + '</div>' +
        mobsieFigure('carousel-story.webp', 'Five-panel Mobsie Connect social carousel.', 'mobsie-carousel') +
        '<div class="mobsie-crm-grid">' + mobsieFigure('whatsapp-teaser.webp', 'Mobsie Connect WhatsApp paid media template.', 'mobsie-crm-whatsapp') +
          mobsieFigure('emailer.webp', 'Mobsie Connect launch email communication.', 'mobsie-crm-email') + '</div>' +
      '</section>' +
      '<section class="mobsie-experience">' + mobsieHeading(e.experience) +
        '<div class="mobsie-copy mobsie-experience-copy" data-reveal>' + paras(e.experience.body) + '</div>' +
        '<div class="mobsie-app-stack">' + appImages + '</div>' +
      '</section>' +
      '<section class="mobsie-section mobsie-rollout">' +
        '<div class="mobsie-rollout-head" data-reveal><span class="mobsie-eyebrow">Brand Rollout</span><h2>One identity.<br>Everyday touchpoints.</h2><p>The system travels from screen to school—from stationery and apparel to practical products and vehicle branding.</p></div>' +
        '<div class="mobsie-rollout-grid">' + rollout + '</div>' +
      '</section>' +
      '<section class="mobsie-outcome">' +
        '<div data-reveal><span class="mobsie-eyebrow">' + esc(e.outcome.eyebrow) + '</span><h2>' + esc(e.outcome.h) + '</h2><div class="mobsie-copy">' + paras(e.outcome.body) + '</div></div>' +
        '<div>' + mobsieFigure('school-kit.webp', 'Complete Mobsie Connect school product range.', 'mobsie-outcome-kit') +
          '<blockquote data-reveal>' + esc(e.outcome.takeaway) + '</blockquote></div>' +
      '</section>' +
    '</article>';
  }

  function isFig(path, alt, extraClass, caption) {
    return '<figure class="is-figure ' + (extraClass || '') + '" data-reveal>' +
      '<img src="assets/img/case/istories-editorial/' + path + '" alt="' + esc(alt || '') + '" loading="lazy">' +
      '<span class="is-reveal" aria-hidden="true"></span>' +
      (caption ? '<figcaption>' + esc(caption) + '</figcaption>' : '') + '</figure>';
  }
  function isVid(file, poster, extraClass, caption) {
    return '<figure class="is-figure is-video ' + (extraClass || '') + '" data-reveal>' +
      '<video src="assets/video/istories/' + file + '" poster="assets/video/istories/' + poster + '" ' +
      'controls playsinline preload="none"></video>' +
      '<span class="is-reveal" aria-hidden="true"></span>' +
      (caption ? '<figcaption>' + esc(caption) + '</figcaption>' : '') + '</figure>';
  }
  function isHeading(section) {
    return '<div class="is-heading" data-reveal>' +
      (section.number ? '<span class="is-number">' + esc(section.number) + '</span>' : '') +
      '<div><span class="is-eyebrow">' + esc(section.eyebrow) + '</span><h2>' + esc(section.h) + '</h2></div></div>';
  }
  function isList(items, extraClass) {
    return '<ul class="' + (extraClass || '') + '">' + items.map(function (item) {
      return '<li>' + esc(item) + '</li>';
    }).join('') + '</ul>';
  }

  function renderIStoriesEditorial(d) {
    var e = d.editorial;
    var grow = e.concept.grow.map(function (g) {
      return '<article class="is-grow-card" data-reveal>' +
        '<span class="is-grow-letter">' + esc(g[0]) + '</span>' +
        '<h3>' + esc(g[1]) + '</h3><p>' + esc(g[2]) + '</p></article>';
    }).join('');
    var formats = e.rollout.formats.map(function (f) {
      return '<li data-reveal><span>' + esc(f) + '</span></li>';
    }).join('');
    var awards = e.results.awardsImg
      ? isFig(e.results.awardsImg, 'iStories campaign awards and recognition.', 'is-awards')
      : '';

    return '<article class="is-case">' +
      '<header class="is-hero">' +
        '<div class="is-hero-stage">' +
          '<video class="is-hero-video" src="assets/video/istories/vid-reggie-hero.mp4" poster="assets/video/istories/vid-reggie-hero-poster.webp" autoplay muted loop playsinline preload="metadata" data-case-video></video>' +
          '<span class="is-hero-veil" aria-hidden="true"></span>' +
          '<img class="is-hero-arches" src="assets/img/case/istories-editorial/mcd-arches-white.webp" alt="" aria-hidden="true">' +
          '<div class="is-hero-inner" data-reveal>' +
            '<span class="is-kicker">Brand Impact · McDonald’s South Africa · 2025</span>' +
            '<h1>iStories</h1><p class="is-hero-sub">Franchisee <em>&amp;</em> Staff</p>' +
            '<p class="is-hero-intro">' + esc(d.intro) + '</p>' +
          '</div>' +
          '<div class="is-hero-band">' +
            '<img class="is-band-lockup-img" src="assets/img/case/istories-editorial/growth-lockup.webp" alt="Together Mzansi presents GROWth Stories">' +
            '<span class="is-band-tag">30 Years of Impact</span>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="is-meta" data-reveal>' +
        '<div><b>Client</b><span>' + esc(d.client) + '</span></div>' +
        '<div><b>Role</b><span>' + esc(d.role) + '</span></div>' +
        '<div><b>Platform</b><span>GROWth Stories · Together Mzansi</span></div>' +
        '<div><b>Year</b><span>' + esc(d.year) + '</span></div>' +
      '</div>' +
      '<section class="is-section is-overview">' + isHeading(e.overview) +
        '<div class="is-copy" data-reveal>' + paras(e.overview.body) + '</div>' +
        isFig('carousel-franchisee.webp', 'iStories franchisee carousel for Peter Moyanga showing the 30 holding device and a pull quote.', 'is-overview-wide', 'The franchisee carousel: the 3 and 0 open into archival footage, with the story told across three panels.') +
      '</section>' +
      '<section class="is-section is-challenge">' + isHeading(e.challenge) +
        '<div class="is-challenge-grid">' +
          '<div class="is-copy" data-reveal>' + paras(e.challenge.body) + '</div>' +
          '<div data-reveal><span class="is-mini-label">The Brief</span>' + isList(e.challenge.brief, 'is-checklist') + '</div>' +
        '</div>' +
        '<blockquote class="is-quote" data-reveal>“' + esc(e.challenge.tension) + '”</blockquote>' +
      '</section>' +
      '<section class="is-section is-concept">' + isHeading(e.concept) +
        '<div class="is-concept-grid">' +
          '<div class="is-copy" data-reveal>' + paras(e.concept.body) +
            '<blockquote class="is-pull" data-reveal>' + esc(e.concept.quote) + '</blockquote></div>' +
          '<div class="is-grow" data-reveal>' + grow + '</div>' +
        '</div>' +
      '</section>' +
      '<section class="is-section is-system is-franchisee">' + isHeading(e.franchisee) +
        '<div class="is-system-grid">' +
          '<div class="is-copy" data-reveal>' + paras(e.franchisee.body) + '</div>' +
          '<div data-reveal><span class="is-mini-label">Why it works</span>' + isList(e.franchisee.reasons, 'is-reasons') + '</div>' +
        '</div>' +
        isFig('banner-victoria.webp', 'iStories franchisee web banner for Victoria Moya, the 30 revealing her younger self.', 'is-banner-wide', 'Web banner · Victoria Moya. The 30 holds the past; the present-day portrait leads.') +
        '<div class="is-media-duo">' +
          isVid('vid-peter.mp4', 'vid-peter-poster.webp', 'is-vid-tall', 'The story in motion · Peter Moyanga, 30-second cutdown.') +
          isFig('still-reggie.webp', 'Editorial portrait of franchisee Reggie Skhosana in front of the Golden Arches.', 'is-still-tall', 'Reggie Skhosana, the first McDonald’s franchisee in South Africa.') +
        '</div>' +
      '</section>' +
      '<section class="is-section is-system is-staff">' + isHeading(e.staff) +
        '<div class="is-copy is-staff-copy" data-reveal>' + paras(e.staff.body) + '</div>' +
        '<div class="is-banner-stack">' +
          isFig('banner-pettula.webp', 'iStories staff web banner for Pettula Pienaar, the arch framing her past.', 'is-banner-wide', 'Web banner · Pettula Pienaar. The arch becomes the threshold between past and present.') +
          isFig('banner-sibongile.webp', 'iStories staff web banner for Sibongile Tyiwa, the arch framing her past.', 'is-banner-wide', 'Web banner · Sibongile Tyiwa.') +
        '</div>' +
        '<div class="is-story-grid">' +
          isFig('story-pettula.webp', 'iStories 9:16 story for Pettula Pienaar.', 'is-story', 'Story · 9:16') +
          isVid('vid-sibongile.mp4', 'vid-sibongile-poster.webp', 'is-story', 'Story film · Sibongile Tyiwa') +
          isFig('story-sibongile.webp', 'iStories 9:16 story for Sibongile Tyiwa.', 'is-story', 'Story · 9:16') +
        '</div>' +
        isVid('vid-colin.mp4', 'vid-colin-poster.webp', 'is-vid-wide', 'iStory film · Colin Williams, from cashier to operations manager.') +
      '</section>' +
      '<section class="is-section is-craft">' + isHeading(e.craft) +
        '<div class="is-copy is-craft-copy" data-reveal>' + paras(e.craft.body) + '</div>' +
        '<div class="is-craft-grid">' +
          isFig('still-colin.webp', 'Editorial portrait of staff member Colin Williams.', 'is-still') +
          isFig('still-blessings.webp', 'Editorial portrait of staff member Blessings.', 'is-still') +
          isFig('still-reggie.webp', 'Editorial portrait of franchisee Reggie Skhosana.', 'is-still') +
        '</div>' +
      '</section>' +
      '<section class="is-section is-rollout">' + isHeading(e.rollout) +
        '<div class="is-copy is-rollout-copy" data-reveal><p>' + esc(e.rollout.body) + '</p></div>' +
        '<ul class="is-formats">' + formats + '</ul>' +
      '</section>' +
      '<section class="is-results">' +
        '<div class="is-results-copy" data-reveal><span class="is-eyebrow">' + esc(e.results.eyebrow) + '</span>' +
          '<h2>' + esc(e.results.h) + '</h2><div class="is-copy">' + paras(e.results.body) + '</div></div>' +
        awards +
        '<blockquote class="is-takeaway" data-reveal>' + esc(e.results.takeaway) + '</blockquote>' +
      '</section>' +
      '<section class="is-role">' +
        '<div data-reveal><span class="is-eyebrow">Contribution</span><h2>My Role</h2></div>' +
        '<div data-reveal><p>' + esc(d.roleCopy) + '</p><ul>' +
          d.roleTags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '</section>' +
    '</article>';
  }

  function leFig(path, alt, extraClass, caption) {
    return '<figure class="le-figure ' + (extraClass || '') + '" data-reveal>' +
      '<img src="assets/img/case/liveeasy-editorial/' + path + '" alt="' + esc(alt || '') + '" loading="lazy">' +
      '<span class="le-reveal" aria-hidden="true"></span>' +
      (caption ? '<figcaption>' + esc(caption) + '</figcaption>' : '') + '</figure>';
  }
  function leHeading(section) {
    return '<div class="le-heading" data-reveal>' +
      (section.number ? '<span class="le-number">' + esc(section.number) + '</span>' : '') +
      '<div><span class="le-eyebrow">' + esc(section.eyebrow) + '</span><h2>' + esc(section.h) + '</h2></div></div>';
  }

  function renderLiveEasyEditorial(d) {
    var e = d.editorial;
    var personas = e.audience.personas.map(function (p) {
      return '<article class="le-persona" data-reveal><h3>' + esc(p[0]) + '</h3><p>' + esc(p[1]) + '</p></article>';
    }).join('');
    var pillars = e.shift.pillars.map(function (p) {
      return '<article class="le-pillar" data-reveal>' +
        leFig(p[2], p[3], 'le-pillar-fig', '') +
        '<div class="le-pillar-copy"><h3>' + esc(p[0]) + '</h3><p>' + esc(p[1]) + '</p></div></article>';
    }).join('');
    var verses = e.idea.verses.map(function (v) {
      return leFig(v[0], v[2], 'le-verse', v[1]);
    }).join('');
    var phases = e.rollout.phases.map(function (p) {
      return '<li data-reveal><b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span></li>';
    }).join('');
    var social = e.rollout.social.map(function (s, i) {
      return leFig(s[0], s[1], 'le-social le-social--' + (i + 1), '');
    }).join('');

    return '<article class="le-case">' +
      '<header class="le-hero">' +
        '<div class="le-hero-stage">' +
          '<img class="le-hero-img" src="' + d.heroImg + '" alt="Live Easy Live Your Next outdoor billboard campaign." fetchpriority="high">' +
          '<span class="le-hero-veil" aria-hidden="true"></span>' +
          '<div class="le-hero-inner">' +
            '<span class="le-kicker"><b>LIVE</b> / EASY · Campaign Pitch · 2026</span>' +
            '<h1>Live Easy</h1>' +
            '<p class="le-hero-intro">' + esc(d.intro) + '</p>' +
          '</div>' +
          '<div class="le-hero-band"><span>Move In.</span><span>Move Up.</span><span class="le-band-accent">Live Your Next.</span></div>' +
        '</div>' +
      '</header>' +
      '<div class="le-meta" data-reveal>' +
        '<div><b>Client</b><span>' + esc(d.client) + '</span></div>' +
        '<div><b>Agency</b><span>' + esc(d.agency) + '</span></div>' +
        '<div><b>Role</b><span>' + esc(d.role) + '</span></div>' +
        '<div><b>Year</b><span>' + esc(d.year) + '</span></div>' +
      '</div>' +
      '<section class="le-section le-overview">' + leHeading(e.overview) +
        '<div class="le-copy" data-reveal>' + paras(e.overview.body) + '</div>' +
        leFig('billboard-street.webp', 'Live Easy “Live Your Next” billboard in a Johannesburg street context.', 'le-wide', 'The campaign world positioned home as a launchpad for progress · AI-assisted visualisation.') +
      '</section>' +
      '<section class="le-section le-challenge">' + leHeading(e.challenge) +
        '<div class="le-challenge-grid">' +
          '<div class="le-copy" data-reveal>' + paras(e.challenge.body) + '</div>' +
          leFig('sm-why.webp', 'Live Easy “Why are people moving into Live Easy?” social execution.', 'le-challenge-fig', '') +
        '</div>' +
        '<blockquote class="le-quote" data-reveal>“' + esc(e.challenge.tension) + '”</blockquote>' +
      '</section>' +
      '<section class="le-section le-audience">' + leHeading(e.audience) +
        '<div class="le-copy le-audience-copy" data-reveal>' + paras(e.audience.body) + '</div>' +
        '<div class="le-personas">' + personas + '</div>' +
      '</section>' +
      '<section class="le-section le-shift">' + leHeading(e.shift) +
        '<div class="le-copy le-shift-copy" data-reveal>' + paras(e.shift.body) + '</div>' +
        '<div class="le-pillars">' + pillars + '</div>' +
        '<blockquote class="le-principle" data-reveal>' + esc(e.shift.principle) + '</blockquote>' +
      '</section>' +
      '<section class="le-section le-idea">' + leHeading(e.idea) +
        '<div class="le-copy le-idea-copy" data-reveal>' + paras(e.idea.body) + '</div>' +
        '<div class="le-verse-grid">' + verses + '</div>' +
        '<blockquote class="le-quote le-thought" data-reveal>“' + esc(e.idea.thought) + '”</blockquote>' +
      '</section>' +
      '<section class="le-section le-process">' + leHeading(e.process) +
        '<div class="le-process-grid">' +
          '<div class="le-copy" data-reveal>' + paras(e.process.body) + '</div>' +
          leFig('kv-next.webp', 'Live Easy “Live Your Next” hero key visual.', 'le-process-fig', '') +
        '</div>' +
        '<blockquote class="le-principle" data-reveal>' + esc(e.process.principle) + '</blockquote>' +
      '</section>' +
      '<section class="le-section le-visual">' + leHeading(e.visual) +
        '<div class="le-copy le-visual-copy" data-reveal>' + paras(e.visual.body) + '</div>' +
        '<div class="le-visual-duo">' +
          leFig('kv-hustle.webp', 'Live Easy “Live Your Hustle” key visual with split-screen device.', '', '') +
          leFig('kv-truth.webp', 'Live Easy “Live Your Truth” key visual with split-screen device.', '', '') +
        '</div>' +
        '<blockquote class="le-logic" data-reveal>' + esc(e.visual.logic) + '</blockquote>' +
      '</section>' +
      '<section class="le-section le-rollout">' + leHeading(e.rollout) +
        '<div class="le-copy le-rollout-copy" data-reveal><p>' + esc(e.rollout.body) + '</p></div>' +
        '<ul class="le-phases">' + phases + '</ul>' +
        '<figure class="le-figure le-video le-wide" data-reveal>' +
          '<video src="assets/video/liveeasy/website-revamp.mp4" poster="assets/video/liveeasy/website-revamp-poster.webp" controls playsinline preload="none" data-case-video></video>' +
          '<span class="le-reveal" aria-hidden="true"></span>' +
          '<figcaption>Conversion-focused landing page and application experience.</figcaption></figure>' +
        '<div class="le-social-grid">' + social + '</div>' +
      '</section>' +
      '<section class="le-outcome">' +
        '<div class="le-outcome-copy" data-reveal><span class="le-eyebrow">' + esc(e.outcome.eyebrow) + '</span>' +
          '<h2>' + esc(e.outcome.h) + '</h2><div class="le-copy">' + paras(e.outcome.body) + '</div></div>' +
        '<blockquote class="le-takeaway" data-reveal>' + esc(e.outcome.takeaway) + '</blockquote>' +
      '</section>' +
      '<section class="le-role">' +
        '<div data-reveal><span class="le-eyebrow">Contribution</span><h2>My Role</h2></div>' +
        '<div data-reveal><p>' + esc(d.roleCopy) + '</p><ul>' +
          d.roleTags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '</section>' +
    '</article>';
  }

  /* ============================================================
     SHOPX — bespoke editorial treatment
     ============================================================ */
  var SX_GHOST = '<svg class="sx-ghost" viewBox="0 0 100 100" aria-hidden="true">' +
    '<g fill="none" stroke="currentColor" stroke-width="1.3">' +
    '<polygon points="30,5 55,30 30,55 5,30"/><polygon points="70,5 95,30 70,55 45,30"/>' +
    '<polygon points="30,45 55,70 30,95 5,70"/><polygon points="70,45 95,70 70,95 45,70"/></g></svg>';

  function sxFig(file, alt, cls) {
    return '<figure class="sx-figure ' + (cls || '') + '" data-reveal>' +
      '<img src="assets/img/case/shopx/' + file + '" alt="' + esc(alt || '') + '" loading="lazy">' +
      '<span class="sx-reveal" aria-hidden="true"></span></figure>';
  }
  function sxVid(file, poster, cls) {
    return '<figure class="sx-figure sx-video ' + (cls || '') + '" data-reveal>' +
      '<video src="assets/video/shopx/' + file + '" poster="assets/img/case/shopx/' + poster + '" ' +
      'muted loop playsinline preload="none" data-sx-video></video>' +
      '<span class="sx-reveal" aria-hidden="true"></span></figure>';
  }
  function sxHead(s) {
    return '<div class="sx-heading" data-reveal>' +
      (s.number ? '<span class="sx-number">' + esc(s.number) + '</span>' : '') +
      '<div><span class="sx-eyebrow">' + esc(s.eyebrow) + '</span><h2>' + esc(s.h) + '</h2></div></div>';
  }
  function sxList(items) {
    return '<ul class="sx-reasons">' + items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>';
  }

  function renderShopxEditorial(d) {
    var e = d.editorial;
    var kvs = ['kv-life1.webp', 'kv-life2.webp', 'kv-life3.webp', 'kv-prod-light.webp', 'kv-prod-dark.webp', 'kv-b2b.webp']
      .map(function (f) { return sxFig(f, 'ShopX key visual', ''); }).join('');
    var socials = ['soc-teaser.webp', 'soc-1.webp', 'soc-2.webp', 'soc-3.webp', 'soc-4.webp', 'soc-5.webp', 'soc-6.webp', 'soc-7.webp', 'soc-8.webp']
      .map(function (f) { return sxFig(f, 'ShopX social post directed and produced with AI', ''); }).join('');
    var swatches = e.system.colours.map(function (c) {
      return '<div class="sx-swatch" data-reveal><span style="background:' + c[0] + '"></span><b>' + esc(c[1]) + '</b><i>' + esc(c[0]) + '</i></div>';
    }).join('');

    return '<article class="sx-case">' +
      '<header class="sx-hero">' +
        '<div class="sx-hero-bg">' +
          '<img class="sx-hero-img" src="assets/img/case/shopx/hero-banner.webp" alt="ShopX Find Your Xperience hero key visual" fetchpriority="high">' +
          '<span class="sx-hero-veil" aria-hidden="true"></span>' +
        '</div>' +
        SX_GHOST.replace('sx-ghost', 'sx-ghost sx-ghost--hero') +
        '<div class="sx-hero-copy">' +
          '<span class="sx-kicker">Brand Identity · ShopX · 2026</span>' +
          '<h1 class="sx-title h-display"><span data-word-wrap>Shop</span><b data-word-wrap>X</b></h1>' +
          '<p class="sx-hero-sub">Find Your <span class="serif">X</span></p>' +
          '<p class="sx-hero-intro">' + esc(d.intro) + '</p>' +
        '</div>' +
        '<div class="sx-hero-scroll" aria-hidden="true"><span>Online Shopping Xperienced</span></div>' +
      '</header>' +

      '<div class="sx-meta" data-reveal>' +
        '<div><b>Client</b><span>' + esc(d.client) + '</span></div>' +
        '<div><b>Role</b><span>' + esc(d.role) + '</span></div>' +
        '<div><b>Discipline</b><span>Logo, identity system, key visuals, AI content and web</span></div>' +
        '<div><b>Year</b><span>' + esc(d.year) + '</span></div>' +
      '</div>' +

      '<section class="sx-section sx-overview">' + sxHead(e.overview) +
        '<div class="sx-copy" data-reveal>' + paras(e.overview.body) + '</div>' +
        sxFig('brand-app.webp', 'ShopX app on a phone home screen', 'sx-card sx-wide') +
        '<blockquote class="sx-pull sx-pull--big" data-reveal>' + esc(e.overview.quote) + '</blockquote>' +
      '</section>' +

      '<section class="sx-section sx-logo">' + SX_GHOST.replace('sx-ghost', 'sx-ghost sx-ghost--mid') + sxHead(e.logo) +
        '<div class="sx-copy" data-reveal>' + paras(e.logo.body) + '</div>' +
        sxFig('logo-build.webp', 'Open box plus X shape equals the ShopX logo icon', 'sx-card sx-wide sx-logo-build') +
        '<div class="sx-logo-duo">' +
          sxFig('logo-variations.webp', 'ShopX master logo and colour variations', 'sx-card') +
          '<div class="sx-panel" data-reveal><span class="sx-mini">Why it works</span>' + sxList(e.logo.reasons) + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="sx-section sx-system">' + sxHead(e.system) +
        '<div class="sx-copy" data-reveal>' + paras(e.system.body) + '</div>' +
        '<div class="sx-swatches">' + swatches + '</div>' +
        sxFig('type.webp', 'ShopX typography, Clash Grotesk', 'sx-card sx-wide') +
      '</section>' +

      '<section class="sx-expression">' +
        '<div class="sx-expression-inner">' + sxHead(e.expression) +
          '<div class="sx-copy" data-reveal>' + paras(e.expression.body) + '</div>' +
          '<blockquote class="sx-pull sx-pull--hero" data-reveal>' + esc(e.expression.quote) + '</blockquote>' +
        '</div>' +
        sxFig('creative.webp', 'ShopX creative expression, people looking into an open box', 'sx-full') +
      '</section>' +

      '<section class="sx-section sx-kv">' + sxHead(e.kv) +
        '<div class="sx-copy" data-reveal>' + paras(e.kv.body) + '</div>' +
        '<div class="sx-kv-grid">' + kvs + '</div>' +
      '</section>' +

      '<section class="sx-section sx-social">' + SX_GHOST.replace('sx-ghost', 'sx-ghost sx-ghost--mid sx-ghost--right') + sxHead(e.social) +
        '<div class="sx-copy" data-reveal>' + paras(e.social.body) + '</div>' +
        '<blockquote class="sx-pull sx-pull--big" data-reveal>' + esc(e.social.quote) + '</blockquote>' +
        '<div class="sx-social-grid">' + socials + '</div>' +
      '</section>' +

      '<section class="sx-section sx-rollout">' + sxHead(e.rollout) +
        '<div class="sx-copy" data-reveal>' + paras(e.rollout.body) + '</div>' +
        '<div class="sx-roll-two">' + sxFig('roll-stationery1.webp', 'ShopX stationery set', 'sx-card') + sxFig('roll-stationery2.webp', 'ShopX stationery detail', 'sx-card') + '</div>' +
        '<div class="sx-roll-three">' + sxFig('roll-lanyard.webp', 'ShopX branded lanyard', 'sx-card') + sxFig('roll-airtag.webp', 'ShopX air tag key rings', 'sx-card') + sxFig('roll-shelves.webp', 'ShopX in store display units', 'sx-card') + '</div>' +
        '<div class="sx-roll-two">' + sxFig('roll-wobblers.webp', 'ShopX accredited partner wobblers', 'sx-card') + sxFig('roll-webassets.webp', 'ShopX web and social assets', 'sx-card') + '</div>' +
      '</section>' +

      '<section class="sx-section sx-digital">' + sxHead(e.digital) +
        '<div class="sx-copy" data-reveal>' + paras(e.digital.body) + '</div>' +
        '<div class="sx-video-duo">' + sxVid('corporate.mp4', 'web-corporate.webp', '') + sxVid('store.mp4', 'web-store.webp', '') + '</div>' +
        '<div class="sx-digital-duo">' + sxFig('web-paid.webp', 'ShopX store web mockup', 'sx-card') + sxFig('web-whatsapp.webp', 'ShopX conversational commerce template', 'sx-card') + '</div>' +
      '</section>' +

      '<section class="sx-outcome">' +
        '<div data-reveal><span class="sx-eyebrow">' + esc(e.outcome.eyebrow) + '</span><h2>' + esc(e.outcome.h) + '</h2>' +
          '<div class="sx-copy">' + paras(e.outcome.body) + '</div></div>' +
        '<blockquote class="sx-takeaway" data-reveal>' + esc(e.outcome.takeaway) + '</blockquote>' +
      '</section>' +

      '<section class="sx-role">' +
        '<div data-reveal><span class="sx-eyebrow">Contribution</span><h2>My Role</h2></div>' +
        '<div data-reveal><p>' + esc(d.roleCopy) + '</p><ul class="sx-tags">' +
          d.roleTags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '</section>' +
    '</article>';
  }

  /* ============================================================
     THE GLENLIVET — Live Original editorial treatment
     Deep teal world · golden ring · gl- prefix
     ============================================================ */
  function glFig(file, alt, cls) {
    return '<figure class="gl-figure ' + (cls || '') + '" data-reveal>' +
      '<img src="assets/img/case/glenlivet-live/' + file + '" alt="' + esc(alt || '') + '" loading="lazy">' +
      '<span class="gl-reveal" aria-hidden="true"></span></figure>';
  }
  function glVid(file, cls, label) {
    return '<figure class="gl-figure gl-vid ' + (cls || '') + '" data-reveal>' +
      '<video src="assets/video/glenlivet-live/' + file + '.mp4" poster="assets/video/glenlivet-live/' + file + '-poster.webp" ' +
      'playsinline preload="none" data-gl-video></video>' +
      '<img class="gl-poster" src="assets/video/glenlivet-live/' + file + '-poster.webp" alt="" loading="lazy" aria-hidden="true">' +
      '<button class="gl-play" type="button" aria-label="Play video"><i></i></button>' +
      '<span class="gl-reveal" aria-hidden="true"></span>' +
      (label ? '<figcaption>' + esc(label) + '</figcaption>' : '') + '</figure>';
  }
  function glHead(s) {
    return '<div class="gl-heading" data-reveal>' +
      (s.number ? '<span class="gl-number">' + esc(s.number) + '</span>' : '') +
      '<div><span class="gl-eyebrow">' + esc(s.eyebrow) + '</span><h2>' + esc(s.h) + '</h2></div></div>';
  }

  function renderGlenlivetEditorial(d) {
    var e = d.editorial;

    var treatmentImgs = [
      ['kv-updated-a.webp', 'kv-updated-b.webp'],
      ['kv-option1-a.webp', 'kv-option1-b.webp'],
      ['kv-option2-a.webp', 'kv-option2-b.webp']
    ];
    var treatments = e.mercedes.treatments.map(function (t, i) {
      return '<div class="gl-treatment">' +
        '<div class="gl-treatment-head" data-reveal><span>0' + (i + 1) + '</span><div><h3>' + esc(t[0]) + '</h3><p>' + esc(t[1]) + '</p></div></div>' +
        '<div class="gl-duo">' +
          glFig(treatmentImgs[i][0], t[0] + ' Glenlivet Mercedes Benz key visual.', '') +
          glFig(treatmentImgs[i][1], t[0] + ' Glenlivet Mercedes Benz key visual, second variant.', '') +
        '</div></div>';
    }).join('');

    var originals = e.originals.people.map(function (p, i) {
      return '<article class="gl-original" data-reveal data-gl-original="' + p[0] + '" data-name="' + esc(p[1]) + '" data-count="' + p[4] + '" style="--rd:' + (i * 0.08).toFixed(2) + 's">' +
        '<figure><img src="assets/img/case/glenlivet-live/influencer-' + p[0] + '.webp" alt="Portrait of ' + esc(p[1]) + ' for The Glenlivet Live Original campaign." loading="lazy"></figure>' +
        '<div class="gl-original-meta"><b>' + esc(p[1]) + '</b><i>' + esc(p[2]) + '</i><p>' + esc(p[3]) + '</p>' +
        '<span class="gl-original-cta">Click to see their work <em>→</em></span></div></article>';
    }).join('');

    var journey = e.brandlove.journey.map(function (j, i) {
      return '<li data-reveal style="--rd:' + (i * 0.06).toFixed(2) + 's"><span>0' + (i + 1) + '</span><div><b>' + esc(j[0]) + '</b><p>' + esc(j[1]) + '</p></div></li>';
    }).join('');

    var countdown = [6, 5, 4, 3, 2, 1].map(function (n) {
      return glFig('countdown-' + n + '.webp', n + ' days to go countdown poster for the Driven by Originality launch.', 'gl-count');
    }).join('');

    var frames = [1, 2, 3, 4, 5, 6, 7].map(function (n) {
      return glFig('frame-' + n + '.webp', 'The Glenlivet Original Collection carousel, frame ' + n + '.', 'gl-frame');
    }).join('');

    var stats = e.impact.stats.map(function (s, i) {
      return '<div class="gl-stat" data-reveal style="--rd:' + (i * 0.06).toFixed(2) + 's"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>';
    }).join('');

    var exportsList = ['export-founders', 'export-12', 'export-15', 'export-18', 'export-21', 'export-25'];
    var marquee = exportsList.map(function (f) {
      return '<img src="assets/img/case/glenlivet-live/' + f + '.webp" alt="The Glenlivet Live Original product key visual." loading="lazy">';
    }).join('');

    return '<article class="gl-case">' +

      '<header class="gl-hero">' +
        '<span class="gl-hero-waves" aria-hidden="true"></span>' +
        '<div class="gl-hero-grid">' +
          '<div class="gl-hero-copy" data-reveal>' +
            '<span class="gl-kicker">The Glenlivet · Pernod Ricard · 2025–2026</span>' +
            '<h1 class="gl-title">Live<br><em>Original</em></h1>' +
            '<p class="gl-hero-intro">' + esc(d.intro) + '</p>' +
            '<div class="gl-hero-tags"><span>Brand Platform</span><span>Integrated Campaign</span><span>Influencer Marketing</span></div>' +
          '</div>' +
          '<figure class="gl-hero-kv" data-reveal><span class="gl-ring" aria-hidden="true"></span>' +
            '<img src="assets/img/case/glenlivet-live/kv-updated-a.webp" alt="The Glenlivet Win a Mercedes Benz key visual." fetchpriority="high"></figure>' +
        '</div>' +
        '<div class="gl-hero-band" aria-hidden="true"><div class="gl-band-track">' +
          '<span>Choose authentic · Choose distinct · Choose The Glenlivet · </span><span>Choose authentic · Choose distinct · Choose The Glenlivet · </span>' +
        '</div></div>' +
      '</header>' +

      '<div class="gl-meta" data-reveal>' +
        '<div><b>Client</b><span>' + esc(d.client) + '</span></div>' +
        '<div><b>Agency</b><span>' + esc(d.agency) + '</span></div>' +
        '<div><b>Role</b><span>' + esc(d.role) + '</span></div>' +
        '<div><b>Year</b><span>' + esc(d.year) + '</span></div>' +
      '</div>' +

      '<section class="gl-section gl-overview">' + glHead(e.overview) +
        '<div class="gl-copy" data-reveal>' + paras(e.overview.body) + '</div>' +
      '</section>' +

      '<section class="gl-section gl-challenge">' + glHead(e.challenge) +
        '<div class="gl-challenge-grid">' +
          '<div class="gl-copy" data-reveal>' + paras(e.challenge.body) + '</div>' +
          '<div class="gl-copy gl-insight" data-reveal><span class="gl-mini">The Insight</span>' + paras(e.challenge.insight) + '</div>' +
        '</div>' +
        '<blockquote class="gl-pull" data-reveal>' + esc(e.challenge.tension) + '</blockquote>' +
      '</section>' +

      '<section class="gl-section gl-mercedes">' + glHead(e.mercedes) +
        '<div class="gl-copy" data-reveal>' + paras(e.mercedes.body) + '</div>' +

        '<div class="gl-subhead" data-reveal><h3>' + esc(e.mercedes.crackingH) + '</h3></div>' +
        '<div class="gl-copy" data-reveal>' + paras(e.mercedes.cracking) + '</div>' +
        '<div class="gl-first-strip">' +
          glFig('kv-first-a.webp', 'First Glenlivet Mercedes Benz key visual exploration with copper WIN headline.', 'gl-first') +
          glFig('kv-first-b.webp', 'First treatment key visual with the golden ring and gold WIN.', 'gl-first') +
          glFig('kv-first-c.webp', 'First treatment key visual with the golden ring and white WIN.', 'gl-first') +
        '</div>' +
        '<p class="gl-caption" data-reveal>The first creative treatment. The ring, the podium and the range are already here, still finding their light.</p>' +

        '<div class="gl-treatments">' + treatments + '</div>' +

        '<div class="gl-subhead" data-reveal><h3>' + esc(e.mercedes.rolloutH) + '</h3></div>' +
        '<div class="gl-copy" data-reveal>' + paras(e.mercedes.rollout) + '</div>' +
        '<div class="gl-trio">' +
          glVid('merc-film-a', '', 'Campaign film · The partnership') +
          glVid('merc-arrival', '', 'Campaign film · The arrival') +
          glVid('merc-film-b', '', 'Campaign film · The reveal') +
        '</div>' +
        '<div class="gl-trio">' +
          glVid('merc-12yo', '', 'Variant spotlight · 12 Year Old') +
          glVid('merc-15yo', '', 'Variant spotlight · 15 Year Old') +
          glVid('merc-18yo', '', 'Variant spotlight · 18 Year Old') +
        '</div>' +
        '<div class="gl-trio">' +
          glVid('merc-square-12yo', 'gl-sq', 'Square cut · 12 Year Old') +
          glVid('merc-square-15yo', 'gl-sq', 'Square cut · 15 Year Old') +
          glVid('merc-square', 'gl-sq', 'Square cut · The mechanic') +
        '</div>' +
        '<div class="gl-feed-row">' +
          glVid('merc-stories', 'gl-tall', 'Stories cut · 9:16') +
          glVid('merc-reveal', '', 'Feed film · The prize') +
          glVid('merc-insta', '', 'Feed film · The raceway') +
        '</div>' +
        '<div class="gl-duo gl-still-duo">' +
          glVid('merc-teaser', '', 'Feed teaser · The countdown') +
          glFig('post-collection.webp', 'The Glenlivet Original Collection square post.', 'gl-collection') +
        '</div>' +
        '<div class="gl-frames-head" data-reveal><span class="gl-mini">The collection carousel</span><p>Seven frames, one swipe through the range. Drag to explore.</p></div>' +
        '<div class="gl-frames">' + frames + '</div>' +
      '</section>' +

      '<section class="gl-section gl-originals-sec">' + glHead(e.originals) +
        '<div class="gl-copy" data-reveal>' + paras(e.originals.body) + '</div>' +
        '<div class="gl-originals">' + originals + '</div>' +
        '<p class="gl-caption gl-hint" data-reveal>' + esc(e.originals.interactionHint) + '</p>' +
        '<div class="gl-subhead" data-reveal><h3>' + esc(e.originals.socialH) + '</h3></div>' +
        '<div class="gl-copy" data-reveal>' + paras(e.originals.social) + '</div>' +
        '<div class="gl-duo gl-social-duo">' +
          glVid('influencer-recap', '', 'The Originals · programme recap') +
          glVid('sinn', '', 'Social edit · the campaign sound') +
        '</div>' +
      '</section>' +

      '<section class="gl-section gl-brandlove">' + glHead(e.brandlove) +
        '<div class="gl-copy" data-reveal>' + paras(e.brandlove.body) + '</div>' +
        '<ul class="gl-journey">' + journey + '</ul>' +
        '<div class="gl-frames-head" data-reveal><span class="gl-mini">The countdown</span><p>Six posters, one a day, no print. The office watched the arrival get closer.</p></div>' +
        '<div class="gl-countdown">' + countdown + '</div>' +
        '<div class="gl-invite-grid">' +
          glFig('invite.webp', 'Driven by Originality digital invitation for the Glenlivet Mercedes Benz internal launch.', 'gl-invite') +
          '<div class="gl-launch-col">' +
            glVid('launch-film', 'gl-launch', 'The launch film · Driven by Originality') +
            '<blockquote class="gl-arrive" data-reveal>' + esc(e.brandlove.quote) + '</blockquote>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="gl-section gl-impact">' +
        '<div class="gl-impact-head" data-reveal><span class="gl-eyebrow">' + esc(e.impact.eyebrow) + '</span><h2>' + esc(e.impact.h) + '</h2></div>' +
        '<div class="gl-copy" data-reveal>' + paras(e.impact.body) + '</div>' +
        '<div class="gl-stats">' + stats + '</div>' +
        '<p class="gl-caption" data-reveal>' + esc(e.impact.statsNote) + '</p>' +
        glFig('impact-board.webp', 'The Glenlivet Live Original results board with organic campaign figures.', 'gl-board') +
        '<blockquote class="gl-takeaway" data-reveal>' + esc(e.impact.takeaway) + '</blockquote>' +
      '</section>' +

      '<section class="gl-exports" aria-label="The Glenlivet product range key visuals">' +
        '<div class="gl-exports-track">' + marquee + marquee + '</div>' +
      '</section>' +

      '<section class="gl-section gl-role">' +
        '<div data-reveal><span class="gl-eyebrow">Contribution</span><h2>My Role</h2></div>' +
        '<div data-reveal><p>' + esc(d.roleCopy) + '</p><ul class="gl-tags">' +
          d.roleTags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '</section>' +
    '</article>';
  }

  /* ============================================================
     STUDIO EDITORIAL — shared themed treatment for studio-era work
     (SANBI, PnP School Club, IFAS, Sci-Bono, GWF) · st- prefix
     ============================================================ */
  function stFig(file, alt, cls) {
    return '<figure class="st-figure ' + (cls || '') + '" data-reveal>' +
      '<img src="assets/img/case/' + file + '" alt="' + esc(alt || '') + '" loading="lazy">' +
      '<span class="st-reveal" aria-hidden="true"></span></figure>';
  }
  function stVid(file, cls, label) {
    return '<figure class="st-figure st-vid ' + (cls || '') + '" data-reveal>' +
      '<video src="assets/video/studio/' + file + '.mp4" poster="assets/video/studio/' + file + '-poster.webp" ' +
      'playsinline preload="none"></video>' +
      '<img class="st-poster" src="assets/video/studio/' + file + '-poster.webp" alt="" loading="lazy" aria-hidden="true">' +
      '<button class="st-play" type="button" aria-label="Play video"><i></i></button>' +
      '<span class="st-reveal" aria-hidden="true"></span>' +
      (label ? '<figcaption>' + esc(label) + '</figcaption>' : '') + '</figure>';
  }
  function stHead(s) {
    return '<div class="st-heading" data-reveal>' +
      (s.number ? '<span class="st-number">' + esc(s.number) + '</span>' : '') +
      '<div><span class="st-eyebrow">' + esc(s.eyebrow) + '</span><h2>' + esc(s.h) + '</h2></div></div>';
  }

  function renderStudioEditorial(d) {
    var e = d.editorial;
    var t = e.theme;
    var themeVars = '--st-bg:' + t.bg + ';--st-bg2:' + t.bg2 + ';--st-panel:' + t.panel +
      ';--st-ink:' + t.ink + ';--st-mist:' + t.mist + ';--st-accent:' + t.accent +
      ';--st-accent2:' + t.accent2 + ';--st-line:' + t.line;

    var galleries = e.galleries.map(function (g) {
      return '<section class="st-section st-gallery-sec">' +
        stHead(g) +
        (g.body ? '<div class="st-copy" data-reveal><p>' + esc(g.body) + '</p></div>' : '') +
        '<div class="st-grid">' + g.grid.map(function (im) {
          return stFig(im[0], d.title + ' campaign artwork.', im[1]);
        }).join('') + '</div>' +
      '</section>';
    }).join('');

    var motion = '';
    if (e.motion) {
      motion = '<section class="st-section st-motion">' + stHead(e.motion) +
        '<div class="st-copy" data-reveal><p>' + esc(e.motion.body) + '</p></div>' +
        '<div class="st-grid">' + e.motion.videos.map(function (v) {
          return stVid(v[0], v[1], v[2]);
        }).join('') + '</div>' +
      '</section>';
    }

    return '<article class="st-case" style="' + themeVars + '">' +
      '<header class="st-hero">' +
        '<span class="st-hero-wash" aria-hidden="true"></span>' +
        '<div class="st-hero-inner">' +
          '<span class="st-kicker" data-reveal>' + esc(e.hero.kicker) + '</span>' +
          '<h1 class="st-title" data-reveal><span>' + esc(e.hero.titleA) + '</span> <em>' + esc(e.hero.titleB) + '</em></h1>' +
          '<p class="st-tagline" data-reveal>' + esc(e.hero.tagline) + '</p>' +
          '<p class="st-hero-intro" data-reveal>' + esc(d.intro) + '</p>' +
        '</div>' +
        '<figure class="st-hero-art" data-reveal><img src="' + d.heroImg + '" alt="' + esc(d.title) + ' hero artwork." fetchpriority="high"></figure>' +
        '<div class="st-band" aria-hidden="true"><div class="st-band-track"><span>' + esc(e.hero.band) + ' </span><span>' + esc(e.hero.band) + ' </span></div></div>' +
      '</header>' +
      '<div class="st-meta" data-reveal>' +
        '<div><b>Client</b><span>' + esc(d.client) + '</span></div>' +
        '<div><b>Agency</b><span>' + esc(d.agency) + '</span></div>' +
        '<div><b>Role</b><span>' + esc(d.role) + '</span></div>' +
        '<div><b>Year</b><span>' + esc(d.year) + '</span></div>' +
      '</div>' +
      '<section class="st-section st-client">' + stHead(e.client) +
        '<div class="st-copy" data-reveal>' + paras(e.client.body) + '</div>' +
      '</section>' +
      '<section class="st-section st-approach">' + stHead(e.approach) +
        '<div class="st-copy" data-reveal>' + paras(e.approach.body) + '</div>' +
        '<blockquote class="st-pull" data-reveal>' + esc(e.approach.quote) + '</blockquote>' +
      '</section>' +
      galleries +
      motion +
      '<section class="st-section st-outcome">' +
        '<div data-reveal><span class="st-eyebrow">' + esc(e.outcome.eyebrow) + '</span><h2>' + esc(e.outcome.h) + '</h2></div>' +
        '<div class="st-copy" data-reveal>' + paras(e.outcome.body) + '</div>' +
        '<blockquote class="st-takeaway" data-reveal>' + esc(e.outcome.takeaway) + '</blockquote>' +
      '</section>' +
      '<section class="st-section st-role">' +
        '<div data-reveal><span class="st-eyebrow">Contribution</span><h2>My Role</h2></div>' +
        '<div data-reveal><p>' + esc(d.roleCopy) + '</p><ul class="st-tags">' +
          d.roleTags.map(function (tag) { return '<li>' + esc(tag) + '</li>'; }).join('') + '</ul></div>' +
      '</section>' +
    '</article>';
  }

  /* ============================================================
     ULTRA MEL — pitch editorial · custard and chocolate · um- prefix
     ============================================================ */
  function umFig(file, alt, cls) {
    return '<figure class="um-figure ' + (cls || '') + '" data-reveal>' +
      '<img src="assets/img/case/' + file + '" alt="' + esc(alt || '') + '" loading="lazy">' +
      '<span class="um-reveal" aria-hidden="true"></span></figure>';
  }
  function umHead(s) {
    return '<div class="um-heading" data-reveal>' +
      (s.number ? '<span class="um-number">' + esc(s.number) + '</span>' : '') +
      '<div><span class="um-eyebrow">' + esc(s.eyebrow) + '</span><h2>' + esc(s.h) + '</h2></div></div>';
  }

  function renderUltramelEditorial(d) {
    var e = d.editorial;
    var masterclass = e.route1.masterclass.map(function (m, i) {
      return '<li data-reveal style="--rd:' + (i * 0.05).toFixed(2) + 's"><span>Ep.0' + (i + 1) + '</span>' + esc(m) + '</li>';
    }).join('');
    var stats = e.amplify.stats.map(function (s, i) {
      return '<div class="um-stat" data-reveal style="--rd:' + (i * 0.06).toFixed(2) + 's"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>';
    }).join('');

    return '<article class="um-case">' +
      '<header class="um-hero">' +
        '<span class="um-drip" aria-hidden="true"></span>' +
        '<div class="um-hero-inner">' +
          '<span class="um-kicker" data-reveal>Danone · Ultra Mel Delight · Pitch · 2025</span>' +
          '<h1 class="um-title" data-reveal>More <em>Joy</em></h1>' +
          '<p class="um-tagline" data-reveal>Peel. Spoon. Enjoy.</p>' +
          '<p class="um-hero-intro" data-reveal>' + esc(d.intro) + '</p>' +
        '</div>' +
        '<figure class="um-hero-kv" data-reveal><img src="assets/img/case/ultramel-pitch/treatment-r1-b.webp" alt="The Art of Indulgence key visual for Ultra Mel Delight." fetchpriority="high"></figure>' +
        '<div class="um-band" aria-hidden="true"><div class="um-band-track"><span>Vanilla · Caramel · Chocolate · A little pause, more joy · </span><span>Vanilla · Caramel · Chocolate · A little pause, more joy · </span></div></div>' +
      '</header>' +
      '<div class="um-meta" data-reveal>' +
        '<div><b>Client</b><span>' + esc(d.client) + '</span></div>' +
        '<div><b>Agency</b><span>' + esc(d.agency) + '</span></div>' +
        '<div><b>Role</b><span>' + esc(d.role) + '</span></div>' +
        '<div><b>Year</b><span>' + esc(d.year) + '</span></div>' +
      '</div>' +

      '<section class="um-section">' + umHead(e.brief) +
        '<div class="um-copy" data-reveal>' + paras(e.brief.body) + '</div>' +
      '</section>' +

      '<section class="um-section">' + umHead(e.insight) +
        '<div class="um-copy" data-reveal>' + paras(e.insight.body) + '</div>' +
        '<blockquote class="um-pull" data-reveal>' + esc(e.insight.tension) + '</blockquote>' +
      '</section>' +

      '<section class="um-section um-platform">' + umHead(e.platform) +
        '<div class="um-copy" data-reveal>' + paras(e.platform.body) + '</div>' +
        '<div class="um-pillars" data-reveal><span>Spoon, peel, enjoy</span><span>Moment of pause</span><span>Joy through comfort</span></div>' +
      '</section>' +

      '<section class="um-route um-route--choc">' +
        '<div class="um-route-inner">' + umHead(e.route1) +
          '<div class="um-copy" data-reveal>' + paras(e.route1.body) + '</div>' +
          umFig('ultramel-pitch/kv-r1.webp', 'The Art of Indulgence campaign key visual.', 'um-wide') +
          '<div class="um-mood-grid">' +
            umFig('ultramel-pitch/mood-r1-b.webp', 'Route one moodboard texture.', '') +
            umFig('ultramel-pitch/mood-r1-c.webp', 'Route one moodboard scene.', '') +
            umFig('ultramel-pitch/mood-r1-d.webp', 'Route one moodboard detail.', '') +
            umFig('ultramel-pitch/mood-r1-e.webp', 'Route one moodboard portrait.', '') +
          '</div>' +
          '<div class="um-artist">' +
            umFig('ultramel-pitch/obakeng-c.webp', 'Obakeng Kgwedi, the artist of indulgence.', 'um-artist-img') +
            '<div class="um-artist-copy" data-reveal><span class="um-mini">' + esc(e.route1.artistRole) + '</span>' +
              '<h3>' + esc(e.route1.artistName) + '</h3><p>' + esc(e.route1.artistBio) + '</p>' +
              '<span class="um-mini um-mini--gap">The Masterclass</span>' +
              '<ul class="um-masterclass">' + masterclass + '</ul>' +
              '<p class="um-masterclass-note">' + esc(e.route1.masterclassNote) + '</p></div>' +
          '</div>' +
          '<div class="um-grid">' +
            umFig('ultramel/05.webp', 'The Art of Indulgence social post, hands passing dessert cups.', 'um-w4 um-sq') +
            umFig('ultramel/06.webp', 'Pure cocoa, pure luxury social post.', 'um-w4 um-sq') +
            umFig('ultramel/07.webp', 'Take a pause that drips with gold social post.', 'um-w4 um-sq') +
            umFig('ultramel-pitch/sm-1.webp', 'Route one social media post.', 'um-w3 um-tall') +
            umFig('ultramel-pitch/sm-2.webp', 'Route one social media post.', 'um-w3 um-tall') +
            umFig('ultramel-pitch/sm-3.webp', 'Route one social media post.', 'um-w3 um-tall') +
            umFig('ultramel-pitch/sm-4.webp', 'Route one social media post.', 'um-w3 um-tall') +
          '</div>' +
          '<figure class="um-figure um-vid um-wide" data-reveal>' +
            '<video src="assets/video/studio/ultramel-kv.mp4" poster="assets/video/studio/ultramel-kv-poster.webp" playsinline preload="none"></video>' +
            '<img class="st-poster" src="assets/video/studio/ultramel-kv-poster.webp" alt="" loading="lazy" aria-hidden="true">' +
            '<button class="st-play" type="button" aria-label="Play video"><i></i></button>' +
            '<span class="um-reveal" aria-hidden="true"></span>' +
            '<figcaption>Key visual in motion · Route One</figcaption></figure>' +
        '</div>' +
      '</section>' +

      '<section class="um-route um-route--cream">' +
        '<div class="um-route-inner">' + umHead(e.route2) +
          '<div class="um-copy" data-reveal>' + paras(e.route2.body) + '</div>' +
          '<div class="um-duo">' +
            umFig('ultramel-pitch/kv-r2-b.webp', 'A Little Pause More Joy key visual with the pause frame.', '') +
            umFig('ultramel-pitch/kv-r2-c.webp', 'A Little Pause More Joy key visual, clean variant.', '') +
          '</div>' +
          '<div class="um-mood-grid">' +
            umFig('ultramel-pitch/mood-r2-b.webp', 'Route two moodboard scene.', '') +
            umFig('ultramel-pitch/mood-r2-c.webp', 'Route two moodboard scene.', '') +
            umFig('ultramel-pitch/mood-r2-d.webp', 'Route two moodboard scene.', '') +
          '</div>' +
          '<div class="um-grid">' +
            umFig('ultramel/01.webp', 'Three flavours, endless moments of delight beach post.', 'um-w6 um-sq') +
            umFig('ultramel/04.webp', 'Extraordinary joy couch post with the pause frame.', 'um-w6 um-sq') +
            umFig('ultramel/02.webp', 'Ordinary pauses social post.', 'um-w6 um-sq') +
            umFig('ultramel/03.webp', 'Turn ordinary pauses into extraordinary joy post.', 'um-w6 um-sq') +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="um-section">' + umHead(e.amplify) +
        '<div class="um-copy" data-reveal>' + paras(e.amplify.body) + '</div>' +
        '<div class="um-stats">' + stats + '</div>' +
      '</section>' +

      '<section class="um-section um-outcome">' +
        '<div data-reveal><span class="um-eyebrow">' + esc(e.outcome.eyebrow) + '</span><h2>' + esc(e.outcome.h) + '</h2></div>' +
        '<div class="um-copy" data-reveal>' + paras(e.outcome.body) + '</div>' +
        umFig('ultramel/08.webp', 'Ultra Mel Delight caramel four pack.', 'um-product') +
        '<blockquote class="um-takeaway" data-reveal>' + esc(e.outcome.takeaway) + '</blockquote>' +
      '</section>' +

      '<section class="um-section um-role">' +
        '<div data-reveal><span class="um-eyebrow">Contribution</span><h2>My Role</h2></div>' +
        '<div data-reveal><p>' + esc(d.roleCopy) + '</p><ul class="um-tags">' +
          d.roleTags.map(function (tag) { return '<li>' + esc(tag) + '</li>'; }).join('') + '</ul></div>' +
      '</section>' +
    '</article>';
  }

  var root = document.getElementById('case-root');
  var html = '';

  if (data.layout === 'nsp-editorial') {
    html = renderNSPEditorial(data);
  } else if (data.layout === 'wpo-editorial') {
    html = renderWPOEditorial(data);
  } else if (data.layout === 'mobsie-editorial') {
    html = renderMobsieEditorial(data);
  } else if (data.layout === 'istories-editorial') {
    html = renderIStoriesEditorial(data);
  } else if (data.layout === 'liveeasy-editorial') {
    html = renderLiveEasyEditorial(data);
  } else if (data.layout === 'shopx-editorial') {
    html = renderShopxEditorial(data);
  } else if (data.layout === 'glenlivet-editorial') {
    html = renderGlenlivetEditorial(data);
  } else if (data.layout === 'studio-editorial') {
    html = renderStudioEditorial(data);
  } else if (data.layout === 'ultramel-editorial') {
    html = renderUltramelEditorial(data);
  } else {

  /* head */
  html += '<header class="case-head">' +
    '<h1 class="case-title h-display" data-reveal>' + esc(data.title) + '</h1>' +
    '<p class="case-intro" data-reveal style="--rd:.08s">' + esc(data.intro) + '</p>' +
    '<div class="case-meta" data-reveal style="--rd:.16s">' +
    '<div><b>Client</b><span>' + esc(data.client) + '</span></div>' +
    '<div><b>Role</b><span>' + esc(data.role) + '</span></div>' +
    '<div><b>Agency</b><span>' + esc(data.agency) + '</span></div>' +
    '<div><b>Year</b><span>' + esc(data.year) + '</span></div>' +
    '</div></header>';

  /* hero media */
  if (data.video) {
    html += '<div class="case-hero-media" data-reveal><div class="frame">' +
      '<video src="' + data.video + '" poster="' + (data.heroImg || '') + '" muted loop playsinline preload="metadata" data-case-video></video>' +
      '</div></div>';
  } else if (data.heroImg) {
    html += '<div class="case-hero-media" data-reveal><div class="frame">' +
      '<img src="' + data.heroImg + '" alt="' + esc(data.title) + '">' +
      '</div></div>';
  }

  /* sections */
  data.sections.forEach(function (s, i) {
    html += '<section class="case-section">' +
      '<div class="case-section-head" data-reveal>' +
      '<h2 class="h-display">' + esc(s.h) + '</h2></div>' +
      '<p data-reveal style="--rd:.08s">' + esc(s.p) + '</p>';
    if (s.imgs && s.imgs.length) {
      html += '<div class="case-gallery">';
      s.imgs.forEach(function (im, k) {
        html += '<figure class="' + im[1] + '" data-reveal style="--rd:' + (Math.min(9, k + 1) * 0.05).toFixed(2) + 's">' +
          '<img src="assets/img/case/' + im[0] + '" alt="" loading="lazy"></figure>';
      });
      html += '</div>';
    }
    html += '</section>';
  });

  /* role */
  html += '<section class="case-role"><div class="case-role-inner">' +
    '<h2 class="h-display" data-reveal>My <span class="serif accent">Role</span></h2>' +
    '<div data-reveal style="--rd:.1s"><p>' + esc(data.roleCopy) + '</p>' +
    '<ul>' + data.roleTags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
    '</div></div></section>';

  /* next project */
  html += '<a class="case-next" href="case.html?p=' + nextSlug + '" data-page-link>' +
    '<span class="case-next-label">Next Project</span>' +
    '<span class="case-next-title h-display" style="display:block">' + esc(next.title) + '</span>' +
    '</a>';

  }

  if (data.layout === 'nsp-editorial' || data.layout === 'wpo-editorial' || data.layout === 'mobsie-editorial' || data.layout === 'istories-editorial' || data.layout === 'liveeasy-editorial' || data.layout === 'shopx-editorial' || data.layout === 'glenlivet-editorial' || data.layout === 'studio-editorial' || data.layout === 'ultramel-editorial') {
    html += '<a class="case-next nsp-next" href="case.html?p=' + nextSlug + '" data-page-link>' +
      '<span class="case-next-label">Next Project</span>' +
      '<span class="case-next-title h-display" style="display:block">' + esc(next.title) + '</span></a>';
  }

  root.appendChild(el(html));

  /* case video: play when visible */
  var v = root.querySelector('[data-case-video]');
  if (v && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    }, { threshold: 0.25 }).observe(v);
  }

  /* ShopX editorial: play walkthrough videos when visible + scroll parallax */
  if (data.layout === 'shopx-editorial') {
    var sxVids = root.querySelectorAll('[data-sx-video]');
    if (sxVids.length && 'IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (ens) {
        ens.forEach(function (en) {
          if (en.isIntersecting) { var pl = en.target.play(); if (pl && pl.catch) pl.catch(function () {}); }
          else en.target.pause();
        });
      }, { threshold: 0.35 });
      sxVids.forEach(function (v) { vio.observe(v); });
    }
    var reduce = window.KT && window.KT.reduceMotion;
    if (!reduce && window.matchMedia('(pointer: fine)').matches) {
      var heroImg = root.querySelector('.sx-hero-img');
      var ghosts = [].slice.call(root.querySelectorAll('.sx-ghost'));
      var sxTick = false;
      function sxUpdate() {
        sxTick = false;
        var sy = window.scrollY || window.pageYOffset;
        if (heroImg) heroImg.style.transform = 'translate3d(0,' + (sy * 0.18).toFixed(1) + 'px,0) scale(1.08)';
        var vh = window.innerHeight;
        ghosts.forEach(function (g, i) {
          var r = g.getBoundingClientRect();
          if (r.bottom < -400 || r.top > vh + 400) return;
          var c = r.top + r.height * 0.5 - vh * 0.5;
          g.style.transform = 'translate3d(0,' + (c * -0.08 * (i % 2 ? 1.6 : 1)).toFixed(1) + 'px,0) rotate(' + (c * 0.004).toFixed(2) + 'deg)';
        });
      }
      window.addEventListener('scroll', function () { if (!sxTick) { sxTick = true; requestAnimationFrame(sxUpdate); } }, { passive: true });
      window.addEventListener('resize', function () { if (!sxTick) { sxTick = true; requestAnimationFrame(sxUpdate); } }, { passive: true });
      sxUpdate();
    }
  }

  /* Glenlivet editorial: grid video playback, the Originals constellation and fullscreen viewer */
  if (data.layout === 'glenlivet-editorial') {
    var GL_VIDEOS = {
      jay: ['jay-1', 'jay-2', 'jay-3', 'jay-4', 'jay-5'],
      dineo: ['dineo-1', 'dineo-2', 'dineo-3', 'dineo-4'],
      thembi: ['thembi-1', 'thembi-2', 'thembi-3', 'thembi-4', 'thembi-5']
    };

    /* click to play grid videos; only one plays at a time */
    var glPlaying = null;
    root.querySelectorAll('.gl-vid').forEach(function (fig) {
      var vid = fig.querySelector('video');
      fig.addEventListener('click', function () {
        if (fig.classList.contains('is-playing')) {
          vid.pause();
          fig.classList.remove('is-playing');
          glPlaying = null;
          return;
        }
        if (glPlaying && glPlaying !== fig) {
          var pv = glPlaying.querySelector('video');
          pv.pause();
          glPlaying.classList.remove('is-playing');
        }
        vid.controls = true;
        fig.classList.add('is-playing');
        glPlaying = fig;
        var p = vid.play();
        if (p && p.catch) p.catch(function () {});
      });
      vid.addEventListener('ended', function () {
        fig.classList.remove('is-playing');
        vid.controls = false;
        if (glPlaying === fig) glPlaying = null;
      });
    });

    /* ---- constellation overlay ---- */
    var glOverlay = null;
    var glViewer = null;
    var glList = [];
    var glIndex = 0;
    var glName = '';

    function glCloseViewer() {
      if (!glViewer) return;
      var v = glViewer.querySelector('video');
      if (v) v.pause();
      glViewer.remove();
      glViewer = null;
      if (glOverlay) glOverlay.classList.remove('is-viewing');
    }
    function glCloseOverlay() {
      glCloseViewer();
      if (!glOverlay) return;
      glOverlay.classList.remove('is-open');
      var node = glOverlay;
      setTimeout(function () { node.remove(); }, 420);
      glOverlay = null;
      document.documentElement.style.overflow = '';
    }
    function glOpenViewer(i) {
      glIndex = (i + glList.length) % glList.length;
      if (!glViewer) {
        glViewer = document.createElement('div');
        glViewer.className = 'gl-viewer';
        glViewer.innerHTML =
          '<button class="gl-viewer-close" type="button" aria-label="Close video">✕</button>' +
          '<button class="gl-viewer-nav gl-viewer-prev" type="button" aria-label="Previous video">←</button>' +
          '<div class="gl-viewer-stage"></div>' +
          '<button class="gl-viewer-nav gl-viewer-next" type="button" aria-label="Next video">→</button>' +
          '<span class="gl-viewer-count"></span>';
        glOverlay.appendChild(glViewer);
        glViewer.querySelector('.gl-viewer-close').addEventListener('click', glCloseViewer);
        glViewer.querySelector('.gl-viewer-prev').addEventListener('click', function () { glOpenViewer(glIndex - 1); });
        glViewer.querySelector('.gl-viewer-next').addEventListener('click', function () { glOpenViewer(glIndex + 1); });
      }
      glOverlay.classList.add('is-viewing');
      var stage = glViewer.querySelector('.gl-viewer-stage');
      stage.innerHTML = '<video src="assets/video/glenlivet-live/' + glList[glIndex] + '.mp4" ' +
        'poster="assets/video/glenlivet-live/' + glList[glIndex] + '-poster.webp" controls autoplay playsinline></video>';
      glViewer.querySelector('.gl-viewer-count').textContent = glName + ' · ' + (glIndex + 1) + ' / ' + glList.length;
      var vv = stage.querySelector('video');
      var p = vv.play();
      if (p && p.catch) p.catch(function () {});
    }
    function glOpenOverlay(slug, name) {
      glList = GL_VIDEOS[slug] || [];
      glName = name;
      if (!glList.length) return;
      glOverlay = document.createElement('div');
      glOverlay.className = 'gl-constellation';
      var orbit = glList.map(function (f, i) {
        return '<button class="gl-sat gl-sat--' + (i + 1) + '" type="button" data-i="' + i + '" aria-label="Play ' + esc(name) + ' video ' + (i + 1) + '" style="--sd:' + (0.12 + i * 0.07).toFixed(2) + 's">' +
          '<img src="assets/video/glenlivet-live/' + f + '-poster.webp" alt="">' +
          '<span><i></i></span></button>';
      }).join('');
      glOverlay.innerHTML =
        '<button class="gl-const-close" type="button" aria-label="Close">✕</button>' +
        '<div class="gl-const-inner">' +
          '<figure class="gl-const-portrait"><img src="assets/img/case/glenlivet-live/influencer-' + slug + '.webp" alt=""></figure>' +
          '<div class="gl-const-name"><b>' + esc(name) + '</b><span>' + glList.length + ' posts · click any video</span></div>' +
          orbit +
        '</div>';
      document.body.appendChild(glOverlay);
      document.documentElement.style.overflow = 'hidden';
      glOverlay.addEventListener('click', function (ev) {
        if (ev.target === glOverlay) glCloseOverlay();
      });
      glOverlay.querySelector('.gl-const-close').addEventListener('click', glCloseOverlay);
      glOverlay.querySelectorAll('.gl-sat').forEach(function (b) {
        b.addEventListener('click', function () { glOpenViewer(parseInt(b.dataset.i, 10)); });
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { glOverlay.classList.add('is-open'); });
      });
    }
    document.addEventListener('keydown', function (ev) {
      if (!glOverlay) return;
      if (ev.key === 'Escape') { glViewer ? glCloseViewer() : glCloseOverlay(); }
      if (glViewer && ev.key === 'ArrowRight') glOpenViewer(glIndex + 1);
      if (glViewer && ev.key === 'ArrowLeft') glOpenViewer(glIndex - 1);
    });
    root.querySelectorAll('[data-gl-original]').forEach(function (card) {
      card.addEventListener('click', function () {
        glOpenOverlay(card.dataset.glOriginal, card.dataset.name);
      });
    });
  }

  /* Studio + Ultra Mel editorials: click to play grid videos, one at a time */
  if (data.layout === 'studio-editorial' || data.layout === 'ultramel-editorial') {
    var stPlaying = null;
    root.querySelectorAll('.st-vid, .um-vid').forEach(function (fig) {
      var vid = fig.querySelector('video');
      if (!vid) return;
      fig.addEventListener('click', function () {
        if (fig.classList.contains('is-playing')) {
          vid.pause();
          fig.classList.remove('is-playing');
          stPlaying = null;
          return;
        }
        if (stPlaying && stPlaying !== fig) {
          var pv = stPlaying.querySelector('video');
          pv.pause();
          stPlaying.classList.remove('is-playing');
        }
        vid.controls = true;
        fig.classList.add('is-playing');
        stPlaying = fig;
        var p = vid.play();
        if (p && p.catch) p.catch(function () {});
      });
      vid.addEventListener('ended', function () {
        fig.classList.remove('is-playing');
        vid.controls = false;
        if (stPlaying === fig) stPlaying = null;
      });
    });
  }

  /* re-run reveal wiring for injected content */
  if (window.KT && window.KT.splitWords) window.KT.splitWords();
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in-view');
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 }) : null;
  root.querySelectorAll('[data-reveal]').forEach(function (n) {
    if (io) io.observe(n); else n.classList.add('in-view');
  });
})();
