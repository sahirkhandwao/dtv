import { loadCSS, loadScript, createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Generic banner block that uses Swiper JS.
 * @param {Element} block The banner block element
 */
export default async function decorate(block) {
  const slides = [...block.children];

  block.textContent = '';

  const swiperMain = document.createElement('div');
  swiperMain.className = 'swiper';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';

  slides.forEach((slideRow) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';

    const cols = [...slideRow.children];

    const desktopImg = cols[0]?.querySelector('img');
    const mobileImg = cols[1]?.querySelector('img');
    const link = cols[2]?.querySelector('a');

    if (desktopImg) {
      const alt = desktopImg.alt || 'DishTV Slide';
      const isEager = !slideRow.previousElementSibling;
      let picture;

      if (mobileImg && mobileImg.src !== desktopImg.src) {
        picture = document.createElement('picture');
        picture.className = 'slide-background';
        
        const desktopPic = createOptimizedPicture(desktopImg.src, alt, isEager, [{ media: '(min-width: 600px)', width: '2000' }]);
        const mobilePic = createOptimizedPicture(mobileImg.src, alt, isEager, [{ width: '750' }]);

        mobilePic.querySelectorAll('source').forEach((s) => {
          s.setAttribute('media', '(max-width: 600px)');
          picture.append(s);
        });
        desktopPic.querySelectorAll('source').forEach((s) => {
          picture.append(s);
        });
        picture.append(desktopPic.querySelector('img'));
      } else {
        picture = createOptimizedPicture(desktopImg.src, alt, isEager, [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]);
        picture.className = 'slide-background';
      }

      slide.append(picture);

      const overlayContent = cols.slice(2).find(col => col.textContent.trim() !== '');
      if (overlayContent) {
        const overlay = document.createElement('div');
        overlay.className = 'slide-overlay';
        overlay.append(...overlayContent.childNodes);
        slide.append(overlay);
      }
    } else {
      slide.append(...slideRow.childNodes);
    }

    swiperWrapper.append(slide);
  });

  swiperMain.append(swiperWrapper);

  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';
  swiperMain.append(pagination);


  block.append(swiperMain);

  const SWIPER_VERSION = '11.1.1';
  const loadAssets = [
    loadCSS(`https://cdn.jsdelivr.net/npm/swiper@${SWIPER_VERSION}/swiper-bundle.min.css`),
    loadScript(`https://cdn.jsdelivr.net/npm/swiper@${SWIPER_VERSION}/swiper-bundle.min.js`)
  ];

  await Promise.all(loadAssets);

  /* global Swiper */
  const swiper = new Swiper(swiperMain, {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}
