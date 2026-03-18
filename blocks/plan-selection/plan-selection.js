import { loadScript, loadCSS, decorateIcons } from '../../scripts/aem.js';

const SWIPER_VERSION = '11.1.1';

async function loadSwiper() {
  const assets = [
    loadCSS(`https://cdn.jsdelivr.net/npm/swiper@${SWIPER_VERSION}/swiper-bundle.min.css`),
    loadScript(`https://cdn.jsdelivr.net/npm/swiper@${SWIPER_VERSION}/swiper-bundle.min.js`)
  ];
  await Promise.all(assets);
}

export default async function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  // 1. Heading section (First two rows)
  const mainHeadingRow = rows[0];
  const subHeadingRow = rows[1];
  
  const headerContainer = document.createElement('div');
  headerContainer.className = 'plan-selection-header';
  if (mainHeadingRow) {
    const h2 = document.createElement('h2');
    h2.innerHTML = mainHeadingRow.querySelector('div').innerHTML;
    headerContainer.append(h2);
  }
  if (subHeadingRow) {
    const p = document.createElement('p');
    p.innerHTML = subHeadingRow.querySelector('div').innerHTML;
    headerContainer.append(p);
  }
  block.append(headerContainer);

  // 2. Cards Data (Next rows until footer)
  // Footer starts when cols < 3 or similar pattern
  const cardRows = rows.slice(2, -2);
  const footerDisclaimerRow = rows[rows.length - 2];
  const footerCtaRow = rows[rows.length - 1];

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'plan-selection-cards swiper';
  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';

  cardRows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 8) return;

    const [badge, planName, price, subPrice, prodImg, features, valueAdds, btnLink] = cols;

    const slide = document.createElement('div');
    slide.className = 'swiper-slide plan-card-slide';

    const card = document.createElement('div');
    card.className = 'plan-card';

    // Badge
    const badgeDiv = document.createElement('div');
    badgeDiv.className = 'plan-card-badge';
    badgeDiv.textContent = badge.textContent.trim();
    card.append(badgeDiv);

    // Header (Price + Image)
    const cardHeader = document.createElement('div');
    cardHeader.className = 'plan-card-header';
    
    const headerLeft = document.createElement('div');
    headerLeft.className = 'plan-card-price-area';
    headerLeft.innerHTML = `
      <div class="card-plan-name">${planName.textContent.trim()}</div>
      <div class="card-price">${price.textContent.trim()}</div>
      <div class="card-sub-price">${subPrice.textContent.trim()}</div>
    `;

    const headerRight = document.createElement('div');
    headerRight.className = 'plan-card-visual-area';
    if (prodImg.querySelector('img')) {
       headerRight.append(prodImg.querySelector('img').cloneNode(true));
    }

    cardHeader.append(headerLeft, headerRight);
    card.append(cardHeader);

    // Key Features
    const featuresDiv = document.createElement('div');
    featuresDiv.className = 'plan-card-features';
    featuresDiv.innerHTML = `<h3>KEY FEATURES</h3>`;
    const featureList = features.querySelector('ul') || document.createElement('ul');
    featureList.classList.add('features-list');
    featuresDiv.append(featureList);
    card.append(featuresDiv);

    // Value Adds
    const valueDiv = document.createElement('div');
    valueDiv.className = 'plan-card-value-adds';
    const valueGrid = document.createElement('ul');
    valueGrid.className = 'value-grid';
    
    const valueItems = valueAdds.querySelector('ul') ? [...valueAdds.querySelectorAll('li')] : [...valueAdds.children];
    valueItems.forEach((item) => {
      const img = item.querySelector('img');
      const text = item.textContent.trim();
      if (img || text) {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="value-icon">${img ? img.outerHTML : ''}</div>
          <div class="value-text">${text}</div>
        `;
        valueGrid.append(li);
      }
    });
    valueDiv.append(valueGrid);
    card.append(valueDiv);

    // Footer Toggle + Action
    const cardFooter = document.createElement('div');
    cardFooter.className = 'plan-card-footer';
    
    const radioName = `antenna-${badge.textContent.trim().replace(/\s+/g, '-').toLowerCase()}`;
    const antennaToggle = document.createElement('div');
    antennaToggle.className = 'antenna-toggle';
    antennaToggle.innerHTML = `
      <label>Antenna</label>
      <div class="toggle-options">
         <label class="toggle-opt"><input type="radio" name="${radioName}" value="yes"> <span>Yes</span></label>
         <label class="toggle-opt"><input type="radio" name="${radioName}" value="no" checked> <span>No</span></label>
      </div>
    `;

    const actionDiv = document.createElement('div');
    actionDiv.className = 'plan-card-action';
    const btn = btnLink.querySelector('a');
    if (btn) {
      btn.className = 'button primary select-button';
      btn.textContent = 'SELECT';
      actionDiv.append(btn);
    }
    
    const infoIcon = document.createElement('span');
    infoIcon.className = 'icon-info-circle';
    actionDiv.append(infoIcon);

    cardFooter.append(antennaToggle, actionDiv);
    card.append(cardFooter);

    slide.append(card);
    swiperWrapper.append(slide);
  });

  cardsContainer.append(swiperWrapper);
  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';
  cardsContainer.append(pagination);
  block.append(cardsContainer);

  // 3. Bottom Footer rows
  if (footerDisclaimerRow) {
    const disclaimer = document.createElement('div');
    disclaimer.className = 'plan-selection-disclaimer';
    disclaimer.innerHTML = footerDisclaimerRow.innerHTML;
    block.append(disclaimer);
  }

  if (footerCtaRow) {
    const bottomCta = document.createElement('div');
    bottomCta.className = 'plan-selection-bottom-cta';
    bottomCta.innerHTML = footerCtaRow.innerHTML;
    block.append(bottomCta);
  }

  decorateIcons(block);

  // Swiper Mobile Only or Grid Desktop
  const initBlock = async () => {
    await loadSwiper();
    /* global Swiper */
    new Swiper(cardsContainer, {
      slidesPerView: 1.1,
      spaceBetween: 20,
      centeredSlides: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        649: {
          slidesPerView: 3,
          spaceBetween: 30,
          centeredSlides: false,
          enabled: false, // Disable carousel on desktop grid
        }
      }
    });
  };

  initBlock();
}
