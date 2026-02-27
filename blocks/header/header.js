import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  
  // Create wrapper for the main header content
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  const navSectionWrappers = ['topbar', 'brand', 'sections', 'tools'];
  
  // Process sections from fragment
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

  // Brand decoration
  const brandLink = navBrand?.querySelector('a');
  if (brandLink) brandLink.classList.add('nav-brand-logo');

  // Top Bar Decoration
  if (topbar) {
    const list = topbar.querySelector('ul');
    if (list) {
      list.querySelectorAll('li').forEach((li) => {
        const text = li.textContent.trim().toLowerCase();
        if (text.includes('language') || text.includes('english')) {
          li.classList.add('language-selector');
          if (li.querySelector('ul')) li.classList.add('has-dropdown');
        }
      });
    }
  }

  // Sections (Main Menu)
  if (navSections) {
    navSections.querySelectorAll('ul > li').forEach((navItem) => {
      if (navItem.querySelector('ul')) {
        navItem.classList.add('nav-drop');
        const link = navItem.querySelector('a');
        if (link) {
           const caret = document.createElement('span');
           caret.className = 'nav-caret';
           link.append(caret);
        }
      }
    });
  }

  // Tools
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
    // If no profile icon found, append one to the tools list
    if (!hasProfile) {
      const ul = navTools.querySelector('ul') || navTools.appendChild(document.createElement('ul'));
      const profileLi = document.createElement('li');
      profileLi.className = 'user-profile';
      profileLi.innerHTML = '<a href="/login" title="User Profile">User</a>';
      ul.append(profileLi);
    }
  }

  // Mobile Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    document.body.style.overflowY = expanded ? '' : 'hidden';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });

  // Assemble the DOM structure
  if (topbar) nav.append(topbar);
  
  navWrapper.append(navBrand || document.createElement('div'));
  navWrapper.append(hamburger);
  navWrapper.append(navSections || document.createElement('div'));
  navWrapper.append(navTools || document.createElement('div'));
  
  nav.append(navWrapper);

  block.append(nav);
  decorateIcons(block);
}
