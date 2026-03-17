import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

// Initialize DishTV global object and synchronization promise
window.dishTv = window.dishTv || {};
let resolveToken;
window.dishTvTokenPromise = new Promise((resolve) => {
  resolveToken = resolve;
});

/**
 * Sets a cookie.
 * @param {string} name Cookie name
 * @param {string} value Cookie value
 * @param {number} days Days to expire
 */
function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Lax`;
}

/**
 * Gets a cookie.
 * @param {string} name Cookie name
 * @returns {string|null} Cookie value or null
 */
function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Fetches the user's IP address from the DishTV service.
 * @returns {Promise<string|null>} The first IP address in the list or null.
 */
async function fetchIpAddress() {
  try {
    const response = await fetch('https://stage-aem.dishtv.in/services/dishtv/ipAddress');
    if (response.ok) {
      const data = await response.text();
      // The service returns a string like "IP1, IP2, ..." or "IP1"
      const cleanedData = data.replace(/"/g, '');
      const ips = cleanedData.split(',');
      return ips[0].trim();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch IP address', e);
  }
  return null;
}

/**
 * Fetches the anonymous token from DishTV services.
 * @param {string} ip The IP address to use for the token request.
 */
async function fetchAnonymousToken(ip) {
  if (!ip) return;
  try {
    const response = await fetch(`https://stage-aem.dishtv.in/services/anonymousToken?ipAddress=${ip}&forDishTv=true`, {
      method: 'POST',
      "body": null,
      "mode": "cors",
      "credentials": "include",
      headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6",
        "cache-control": "no-cache",
        "csrf-token": "undefined",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "x-requested-with": "XMLHttpRequest"
      }
    });
    if (response.ok) {
      const json = await response.json();
      if (json && json.data && json.data.token) {
        const { token } = json.data;
        window.dishTv = window.dishTv || {};
        window.dishTv.token = token;
        setCookie('RequestAnonymousToken', token, 1);
        setCookie('token', token, 1);
        // eslint-disable-next-line no-console
        console.log('DishTV Anonymous Token fetched and stored.');

        // Resolve the global promise if it hasn't been resolved yet
        if (resolveToken) {
          resolveToken(token);
          resolveToken = null; // Ensure it's only resolved once
        }
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch anonymous token', e);
  }
}

/**
 * Fetches the products data for new connections.
 * @returns {Promise<Object|null>} The products data or null.
 */
export async function fetchProductsData() {
  const cachedData = sessionStorage.getItem('productsData');
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      // Check if data is fresh (e.g., less than 30 minutes old)
      if (parsed.timestamp && (Date.now() - parsed.timestamp < 1800000)) {
        return parsed.data;
      }
    } catch (e) {
      // ignore
    }
  }

  const token = await window.dishTvTokenPromise;
  if (!token) return null;

  try {
    const response = await fetch('https://beta2-bizlogic-api.dishtv.in/api/PrePaidHomeDelivery/ProductsNewConnection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({ SMSID: '0' }),
    });

    if (response.ok) {
      const json = await response.json();
      if (json && json.data) {
        sessionStorage.setItem('productsData', JSON.stringify({
          data: json,
          timestamp: Date.now(),
        }));
        return json;
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch products data', e);
  }
  return null;
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return; // Don't create a duplicate hero block
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  // Start the token fetch process immediately in the background
  const initToken = async () => {
    try {
      const ip = await fetchIpAddress();
      if (ip) {
        window.dishTv.ipAddress = ip;
        // eslint-disable-next-line no-console
        console.log('DishTV IP Address:', ip);
        await fetchAnonymousToken(ip);

        // Setup refresh interval (110 seconds)
        setInterval(() => {
          if (!getCookie('userloggedin')) {
            fetchAnonymousToken(ip);
          }
        }, 110000);
      } else {
        // Fallback to cookie if IP fetch fails
        const token = getCookie('token');
        if (resolveToken) resolveToken(token);
      }
    } catch (e) {
      if (resolveToken) resolveToken(getCookie('token'));
    }
  };
  initToken();

  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
