import { loadScript, loadCSS } from '../../scripts/aem.js';

export default async function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const data = {};
  rows.forEach((row) => {
    const [outerTabCol, innerTabCol, descCol, visualCol, linkCol] = [...row.children];
    const outerTab = outerTabCol.textContent.trim();
    if (!data[outerTab]) data[outerTab] = [];
    
    data[outerTab].push({
      title: innerTabCol.textContent.trim(),
      description: descCol.innerHTML,
      visual: visualCol.querySelector('picture, img'),
      link: linkCol.querySelector('a')?.href || '#'
    });
  });

  const outerTabNames = Object.keys(data);
  if (outerTabNames.length === 0) return;

  // Header Title (assumed to be before the block or handled via authoring)
  // We'll create the structure
  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'manage-account-wrapper manage-account-inner-wrapper';

  const heading = document.createElement("h3");
  heading.className = "manage-account-heading";
  heading.innerHTML = `Manage Your Account <br> <span class="manage-account-heading-orange">with ease</span>`;
  mainWrapper.append(heading);

  // 1. Outer Tabs Nav
  const outerNav = document.createElement('div');
  outerNav.className = 'manage-account-outer-nav';
  const outNavContainer = document.createElement('div');
  outNavContainer.className = "manage-account-outer-nav-container";
  const outerNavList = document.createElement('ul');
  
  outerTabNames.forEach((name, i) => {
    const li = document.createElement('li');
    li.textContent = name;
    if (i === 0) li.classList.add('active');
    li.addEventListener('click', () => {
      mainWrapper.querySelectorAll('.manage-account-outer-nav li').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      mainWrapper.querySelectorAll('.manage-account-outer-panel').forEach(panel => panel.classList.remove('active'));
      mainWrapper.querySelector(`.manage-account-outer-panel[data-tab="${name}"]`).classList.add('active');
    });
    outerNavList.append(li);
  });
  const emptyDiv = document.createElement("div");
  emptyDiv.className = "manage-account-empty-div";
  outNavContainer.append(outerNavList);
  outerNav.append(emptyDiv);
  outerNav.append(outNavContainer);
  mainWrapper.append(outerNav);

  // 2. Panels
  outerTabNames.forEach((name, i) => {
    const panel = document.createElement('div');
    panel.className = 'manage-account-outer-panel';
    panel.dataset.tab = name;
    if (i === 0) panel.classList.add('active');

    const innerContent = document.createElement('div');
    innerContent.className = 'manage-account-inner-content';

    const visualSide = document.createElement('div');
    visualSide.className = 'manage-account-visual-side';

    const listSide = document.createElement('div');
    listSide.className = 'manage-account-list-side';
    const innerList = document.createElement('ul');

    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';

    data[name].forEach((item, j) => {
      // Desktop vertical tabs
      const li = document.createElement('li');
      li.className = 'manage-account-inner-item';
      li.innerHTML = `<span class="indicator"></span><span class="text">${item.title}</span>`;
      if (j === 0) li.classList.add('active');
      
      const visualItem = document.createElement('div');
      visualItem.className = `manage-account-visual-item item-${j}`;
      if (j === 0) visualItem.classList.add('active');
      if (item.visual) visualItem.append(item.visual.cloneNode(true));
      visualSide.append(visualItem);

      li.addEventListener('click', () => {
        listSide.querySelectorAll('.manage-account-inner-item').forEach(el => el.classList.remove('active'));
        li.classList.add('active');
        visualSide.querySelectorAll('.manage-account-visual-item').forEach(el => el.classList.remove('active'));
        visualItem.classList.add('active');
      });
      innerList.append(li);

      // Mobile Carousel Slide
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="mobile-slide-visual"></div>
        <div class="mobile-slide-content">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      `;
      if (item.visual) slide.querySelector('.mobile-slide-visual').append(item.visual.cloneNode(true));
      swiperWrapper.append(slide);
    });

    listSide.append(innerList);

    // Desktop Layout
    const desktopView = document.createElement('div');
    desktopView.className = 'manage-account-desktop-view';
    desktopView.append(visualSide);
    desktopView.append(listSide);

    // Mobile Carousel Layout
    const mobileView = document.createElement('div');
    mobileView.className = 'manage-account-mobile-view swiper';
    mobileView.append(swiperWrapper);
    const pagination = document.createElement('div');
    pagination.className = 'swiper-pagination';
    mobileView.append(pagination);

    innerContent.append(desktopView);
    innerContent.append(mobileView);
    panel.append(innerContent);
    mainWrapper.append(panel);
  });

  block.append(mainWrapper);

  // Initialize Swiper for mobile
  if (window.innerWidth < 900) {
    const SWIPER_VERSION = '11.1.1';
    const loadAssets = [
      loadCSS(`https://cdn.jsdelivr.net/npm/swiper@${SWIPER_VERSION}/swiper-bundle.min.css`),
      loadScript(`https://cdn.jsdelivr.net/npm/swiper@${SWIPER_VERSION}/swiper-bundle.min.js`)
    ];

    await Promise.all(loadAssets);

    /* global Swiper */
    mainWrapper.querySelectorAll('.manage-account-mobile-view').forEach((el) => {
      new Swiper(el, {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: el.querySelector('.swiper-pagination'),
          clickable: true,
        },
        observer: true,
        observeParents: true,
      });
    });
  }
}
