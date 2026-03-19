import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  const navSectionWrappers = ['topbar', 'brand', 'sections', 'tools'];

  const fragmentSections = [...fragment.children];
  fragmentSections.forEach((section, i) => {
    if (i < navSectionWrappers.length) {
      section.classList.add(`nav-${navSectionWrappers[i]}`);
    }
  });

  const topbar = fragment.querySelector('.nav-topbar');
  const navBrand = fragment.querySelector('.nav-brand');
  const navSections = fragment.querySelector('.nav-sections');
  const navTools = fragment.querySelector('.nav-tools');

  const brandLink = navBrand?.querySelector('a');
  if (brandLink) brandLink.classList.add('nav-brand-logo');

  if (topbar) {
    const list = topbar.querySelector('ul');
    if (list) {
      list.querySelectorAll(':scope > li').forEach((li) => {
        const text = li.textContent.trim().toLowerCase();
        if (text.includes('language') || text.includes('english')) {
          li.classList.add('language-selector');
          const anchor = li.querySelector('a');
          if (anchor) anchor.textContent = 'ENGLISH';

          if (li.querySelector('ul')) {
            li.classList.add('has-dropdown');
          }
        }
      });
    }
  }

  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li, .default-content-wrapper > ul > li').forEach((navItem) => {
      if (navItem.querySelector('ul')) {
        navItem.classList.add('nav-drop');
        const link = navItem.querySelector(':scope > a');
        if (link) {
          if (!link.querySelector('.nav-caret')) {
            const caret = document.createElement('span');
            caret.className = 'nav-caret';
            link.append(caret);
          }
        } else {
          const firstChild = navItem.firstChild;
          if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
            const span = document.createElement('span');
            span.textContent = firstChild.textContent;
            navItem.insertBefore(span, navItem.firstChild.nextSibling.nextSibling);
            const caret = document.createElement('span');
            caret.className = 'nav-caret';
            span.append(caret);
          }
        }
      }
    });
  }

  if (navTools) {
    let hasProfile = false;
    navTools.querySelectorAll('li').forEach((li) => {
      const text = li.textContent.toLowerCase();
      if (text.includes('recharge')) li.classList.add('recharge-cta');
      if (text.includes('user') || li.querySelector('img[src*="user"]')) {
        li.classList.add('user-profile');
        hasProfile = true;
      }
    });

    const mobileTools = document.createElement('div');
    mobileTools.className = 'nav-mobile-tools';

    const toolItems = [
      { name: 'GET A CONNECTION', icon: '/icons/new-connection-logo.png', link: '/new' },
      { name: 'RECHARGE', icon: '/icons/recharge-logo-header.png', link: '/recharge' },
      { name: 'LOGIN', icon: '/icons/profileicon.png', link: '/login' }
    ];

    const mobileToolsList = document.createElement('ul');
    toolItems.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${item.link}">
        <div class="icon">
          <img src="${item.icon}" alt="${item.name}">
        </div>
        <span class="tool-label">${item.name}</span>
      </a>`;
      mobileToolsList.append(li);
    });
    mobileTools.append(mobileToolsList);
    navWrapper.append(mobileTools);

    if (!hasProfile) {
      const ul = navTools.querySelector('ul') || navTools.appendChild(document.createElement('ul'));
      const profileLi = document.createElement('li');
      profileLi.className = 'user-profile';
      profileLi.innerHTML = '<a href="/login" title="User Profile">User</a>';
      ul.append(profileLi);
    }
  }

  if (navSections) {
    navSections.querySelectorAll('.nav-drop').forEach((drop) => {
      const label = drop.querySelector(':scope > a, :scope > span');
      if (label) {
        label.addEventListener('click', (e) => {
          if (window.innerWidth < 900) {
            e.preventDefault();
            const expanded = drop.getAttribute('aria-expanded') === 'true';
            drop.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      }
    });

    const homeCta = document.createElement('div');
    homeCta.className = 'nav-mobile-home-cta';
    homeCta.innerHTML = '<a href="/" class="button primary">HOME</a>';
    navSections.append(homeCta);
  }

  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>
    <span>MENU</span>
    `;

  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    document.body.style.overflowY = expanded ? '' : 'hidden';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    hamburger.classList.toggle('open');
  });

  if (topbar) nav.append(topbar);

  navWrapper.append(navBrand || document.createElement('div'));
  navWrapper.append(hamburger);
  navWrapper.append(navSections || document.createElement('div'));
  navWrapper.append(navTools || document.createElement('div'));

  nav.append(navWrapper);

  block.append(nav);
  decorateIcons(block);
}
