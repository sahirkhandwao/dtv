import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * sync trigger: 2026-03-05 v2
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.classList.add('footer-wrapper');

  if (fragment) {
    // Top section with columns and dealer info
    const topSection = document.createElement('div');
    topSection.classList.add('footer-top');

    const linkGrid = document.createElement('div');
    linkGrid.classList.add('footer-link-grid');

    const dealerSocial = document.createElement('div');
    dealerSocial.classList.add('footer-dealer-social');

    const bottomBar = document.createElement('div');
    bottomBar.classList.add('footer-bottom-bar');

    // Categorize content
    const sections = Array.from(fragment.children);
    sections.forEach((section) => {
      const text = section.textContent.toUpperCase();
      
      if (text.includes('LOCATE A DEALER') || text.includes('FOLLOW US')) {
        dealerSocial.append(section);
        section.classList.add('dealer-social-section');
        
        // Transform the Pincode paragraph into an actual input field
        const pincodePara = Array.from(section.querySelectorAll('p')).find(p => p.textContent.toLowerCase().includes('pincode'));
        if (pincodePara) {
           const inputDiv = document.createElement('div');
           inputDiv.classList.add('pincode-input-wrapper');
           inputDiv.innerHTML = `
             <div class="input-container">
               <span class="icon icon-location"></span>
               <input type="text" placeholder="${pincodePara.textContent.trim()}" aria-label="Enter Pincode">
               <button type="submit" class="pincode-submit" aria-label="Search">
                 <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12.5 1.25L18.75 7.5L12.5 13.75" stroke="#F04C23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M1.25 7.5H18.75" stroke="#F04C23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>
               </button>
             </div>
           `;
           pincodePara.replaceWith(inputDiv);
        }

        // Decorate social icons
        const socialList = section.querySelector('ul');
        if (socialList) {
          socialList.classList.add('social-links');
        }
      } else if (section.querySelector('ul') && !text.includes('SITEMAP')) {
        linkGrid.append(section);
        section.classList.add('footer-column');
      } else if (text.includes('COPYRIGHT') || section.querySelector('img') || text.includes('SITEMAP')) {
        // Logo, Copyright, and Sitemap area
        bottomBar.append(section);
        if (text.includes('COPYRIGHT') || section.querySelector('img')) {
          section.classList.add('footer-brand-notice');
        } else {
          section.classList.add('footer-legal-links');
        }
      } else {
        // Fallback or secondary links
        bottomBar.append(section);
        section.classList.add('footer-legal-links');
      }
    });

    topSection.append(linkGrid, dealerSocial);
    footer.append(topSection);
    footer.append(bottomBar);
  }

  block.append(footer);
  decorateIcons(block);
}
