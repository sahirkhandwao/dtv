import { loadScript, loadCSS, decorateIcons } from '../../scripts/aem.js';
import { fetchProductsData } from '../../scripts/scripts.js';

const SWIPER_VERSION = '11.1.1';

async function loadSwiper() {
  const assets = [
    loadCSS(`https://cdn.jsdelivr.net/npm/swiper@${SWIPER_VERSION}/swiper-bundle.min.css`),
    loadScript(`https://cdn.jsdelivr.net/npm/swiper@${SWIPER_VERSION}/swiper-bundle.min.js`)
  ];
  await Promise.all(assets);
}

function createCard(product) {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide plan-card-slide';

  const card = document.createElement('div');
  card.className = 'plan-card';

  // Badge (Mapping logic might need adjustment based on API response)
  const badgeDiv = document.createElement('div');
  badgeDiv.className = 'plan-card-badge';
  badgeDiv.textContent = 'Limited Period Offer'; // Default or from API if available
  card.append(badgeDiv);

  // Header (Price + Image)
  const cardHeader = document.createElement('div');
  cardHeader.className = 'plan-card-header';
  
  const headerLeft = document.createElement('div');
  headerLeft.className = 'plan-card-price-area';
  headerLeft.innerHTML = `
    <div class="card-plan-name">${product.product_name}</div>
    <div class="card-price">₹${product.price}</div>
    <div class="card-sub-price">With Antenna ₹${product.price_with_odu}</div>
  `;

  const headerRight = document.createElement('div');
  headerRight.className = 'plan-card-visual-area';
  if (product.image_path) {
     const img = document.createElement('img');
     img.src = product.image_path;
     img.alt = product.product_name;
     headerRight.append(img);
  }

  cardHeader.append(headerLeft, headerRight);
  card.append(cardHeader);

  // Key Features
  const featuresDiv = document.createElement('div');
  featuresDiv.className = 'plan-card-features';
  featuresDiv.innerHTML = `<h3>KEY FEATURES</h3>`;
  const featureList = document.createElement('ul');
  featureList.classList.add('features-list');
  if (product.lstProductsKeyFeatures) {
    product.lstProductsKeyFeatures.forEach((feat) => {
      const li = document.createElement('li');
      li.textContent = feat.feature_name || feat; // Handling both object and string
      featureList.append(li);
    });
  }
  featuresDiv.append(featureList);
  card.append(featuresDiv);

  // Value Adds (Using installation plans as value adds)
  const valueDiv = document.createElement('div');
  valueDiv.className = 'plan-card-value-adds';
  const valueGrid = document.createElement('ul');
  valueGrid.className = 'value-grid';
  
  if (product.lstInstallationPlans) {
    product.lstInstallationPlans.slice(0, 4).forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="value-icon"></div>
        <div class="value-text">${item.installation_name || item}</div>
      `;
      valueGrid.append(li);
    });
  }
  valueDiv.append(valueGrid);
  card.append(valueDiv);

  // Footer Toggle + Action
  const cardFooter = document.createElement('div');
  cardFooter.className = 'plan-card-footer';
  
  const radioName = `antenna-${product.product_name.replace(/\s+/g, '-').toLowerCase()}`;
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
  const btn = document.createElement('a');
  btn.href = '#'; // Default or from API if available
  btn.className = 'button primary select-button';
  btn.textContent = 'SELECT';
  actionDiv.append(btn);
  
  const infoIcon = document.createElement('span');
  infoIcon.className = 'icon-info-circle';
  actionDiv.append(infoIcon);

  cardFooter.append(antennaToggle, actionDiv);
  card.append(cardFooter);

  slide.append(card);
  return slide;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const mainHeadingRow = rows[0];
  const subHeadingRow = rows[1];
  const footerDisclaimerRow = rows[rows.length - 2];
  const footerCtaRow = rows[rows.length - 1];

  block.textContent = '';

  // 1. Heading section
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

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'plan-selection-cards swiper';
  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';
  cardsContainer.append(swiperWrapper);

  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';
  cardsContainer.append(pagination);
  block.append(cardsContainer);

  // 2. Fetch and render dynamic content
  const data = await fetchProductsData();
  if (data && data.productsData) {
    data.productsData.forEach((product) => {
      swiperWrapper.append(createCard(product));
    });
  }

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
