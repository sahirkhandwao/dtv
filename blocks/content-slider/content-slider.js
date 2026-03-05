import { loadCSS, loadScript } from '../../scripts/aem.js';

const SWIPER_VERSION = '11.1.1';

async function loadSwiper() {
  const assets = [
    loadCSS(`https://cdn.jsdelivr.net/npm/swiper@${SWIPER_VERSION}/swiper-bundle.min.css`),
    loadScript(`https://cdn.jsdelivr.net/npm/swiper@${SWIPER_VERSION}/swiper-bundle.min.js`)
  ];
  await Promise.all(assets);
}

function createTabNav(tabs, activeTab, onTabChange) {
  const nav = document.createElement('div');
  nav.className = 'content-slider-tab-nav';
  const ul = document.createElement('ul');
  
  tabs.forEach((tab) => {
    const li = document.createElement('li');
    li.textContent = tab;
    if (tab === activeTab) li.classList.add('active');
    li.addEventListener('click', () => {
      ul.querySelectorAll('li').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      onTabChange(tab);
    });
    ul.append(li);
  });

  nav.append(ul);

  const channelGuide = document.createElement('div');
  channelGuide.className = 'content-slider-channel-guide';
  channelGuide.innerHTML = `<span class="icon icon-tv-orange"></span> CHANNEL GUIDE`;
  nav.append(channelGuide);

  return nav;
}

export default async function decorate(block) {
  const isDesktop = window.innerWidth > 648;
  const rows = [...block.children];
  block.textContent = '';

  // Extract Heading if present (first row might be special if it doesn't have 8 cols)
  let sectionHeading = null;
  let dataRows = rows;
  if (rows[0] && rows[0].children.length < 5) {
    sectionHeading = rows[0].innerHTML;
    dataRows = rows.slice(1);
  }

  const data = {};
  dataRows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 8) return;
    const [tabName, title, meta, previewImg, cardImg, logoImg, previewLink, addLink] = cols;
    const tabStr = tabName.textContent.trim();
    if (!data[tabStr]) data[tabStr] = [];
    
    data[tabStr].push({
      title: title.textContent.trim(),
      meta: meta.textContent.trim(),
      preview: previewImg.querySelector('picture, img'),
      card: cardImg.querySelector('picture, img'),
      logo: logoImg.querySelector('picture, img'),
      previewUrl: previewLink.querySelector('a')?.href || '#',
      addUrl: addLink.querySelector('a')?.href || '#'
    });
  });

  const tabNames = Object.keys(data);
  if (tabNames.length === 0) return;

  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'content-slider-wrapper';

  if (sectionHeading) {
    const headingDiv = document.createElement('div');
    headingDiv.className = 'content-slider-heading';
    headingDiv.innerHTML = sectionHeading;
    mainWrapper.append(headingDiv);
  }

  const tabContainer = document.createElement('div');
  tabContainer.className = 'content-slider-tabs';
  
  const nav = createTabNav(tabNames, tabNames[0], (targetTab) => {
    mainWrapper.querySelectorAll('.content-slider-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.tab === targetTab);
    });
  });
  mainWrapper.append(nav);

  tabNames.forEach((name, i) => {
    const panel = document.createElement('div');
    panel.className = 'content-slider-panel';
    panel.dataset.tab = name;
    if (i === 0) panel.classList.add('active');

    const syncedContainer = document.createElement('div');
    syncedContainer.className = 'content-slider-synced-container';

    // Left Slider (Preview)
    const leftSwiper = document.createElement('div');
    leftSwiper.className = 'swiper content-slider-left initializeGridLeft';
    const leftWrapper = document.createElement('div');
    leftWrapper.className = 'swiper-wrapper';

    // Right Slider (Grid)
    const rightSwiper = document.createElement('div');
    rightSwiper.className = 'swiper content-slider-right initializeGridRight';
    const rightWrapper = document.createElement('div');
    rightWrapper.className = 'swiper-wrapper';

    data[name].forEach((item) => {
      // Left Slide Info
      const lSlide = document.createElement('div');
      lSlide.className = 'swiper-slide';
      lSlide.innerHTML = `
        <div class="preview-visual"></div>
        <div class="preview-info">
           <div class="channel-logo"></div>
           <div class="info-text">
             <div class="title">${item.title}</div>
             <div class="meta">${item.meta}</div>
           </div>
        </div>
      `;
      if (item.preview) lSlide.querySelector('.preview-visual').append(item.preview.cloneNode(true));
      if (item.logo) lSlide.querySelector('.channel-logo').append(item.logo.cloneNode(true));
      leftWrapper.append(lSlide);

      // Right Slide (Card)
      const rSlide = document.createElement('div');
      rSlide.className = 'swiper-slide';
      rSlide.innerHTML = `
        <div class="card-visual"></div>
        <div class="card-info">
           <div class="channel-logo-small"></div>
           <div class="info-text-small">
             <div class="title">${item.title}</div>
             <div class="meta">${item.meta}</div>
           </div>
        </div>
        <div class="card-overlay">
           <a href="${item.previewUrl}" class="overlay-btn preview-btn">
             <span class="icon-play"></span>
             <span>WATCH PREVIEW</span>
           </a>
           <a href="${item.addUrl}" class="overlay-btn add-btn">
             <span class="icon-plus"></span>
             <span>ADD CHANNEL</span>
           </a>
        </div>
      `;
      if (item.card) rSlide.querySelector('.card-visual').append(item.card.cloneNode(true));
      if (item.logo) rSlide.querySelector('.channel-logo-small').append(item.logo.cloneNode(true));
      rightWrapper.append(rSlide);
    });

    leftSwiper.append(leftWrapper);
    rightSwiper.append(rightWrapper);

    const scrollbar = document.createElement('div');
    scrollbar.className = 'grid-carousel-scrollbar';
    rightSwiper.append(scrollbar);

    syncedContainer.append(leftSwiper);
    syncedContainer.append(rightSwiper);
    panel.append(syncedContainer);
    tabContainer.append(panel);
  });

  mainWrapper.append(tabContainer);
  block.append(mainWrapper);

  await loadSwiper();

  /* global Swiper */
  tabNames.forEach((name) => {
    const panel = mainWrapper.querySelector(`.content-slider-panel[data-tab="${name}"]`);
    const rightEl = panel.querySelector('.initializeGridRight');
    const leftEl = panel.querySelector('.initializeGridLeft');

    const rightSwiper = new Swiper(rightEl, {
      spaceBetween: 20,
      slidesPerView: 1.2,
      watchSlidesProgress: true,
      initialSlide: 0,
      observer: true,
      observeParents: true,
      grid: {
        rows: 1,
        fill: 'row'
      },
      breakpoints: {
        649: {
          slidesPerView: 2,
          spaceBetween: 14,
          grid: {
            rows: 2,
            fill: 'row'
          }
        }
      },
      scrollbar: {
        el: panel.querySelector('.grid-carousel-scrollbar'),
        draggable: true,
        snapOnRelease: true
      }
    });

    const leftSwiper = new Swiper(leftEl, {
      spaceBetween: 10,
      initialSlide: 0,
      observer: true,
      observeParents: true,
      allowTouchMove: false
    });

    if (window.innerWidth > 649) {
      rightSwiper.controller.control = leftSwiper;
      leftSwiper.controller.control = rightSwiper;
    }
  });
}
