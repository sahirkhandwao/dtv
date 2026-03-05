import { decorateIcons } from '../../scripts/aem.js';

/**
 * decorates the recharge widget
 * @param {Element} block The recharge block element
 */
export default async function decorate(block) {
  const [headingCol, placeholderCol, buttonTextCol] = [...block.children];

  const headingText = headingCol?.textContent.trim() || 'Instant Recharge';
  const placeholderText = placeholderCol?.textContent.trim() || 'Enter Registered Mobile No. OR VC No.';
  const buttonText = buttonTextCol?.textContent.trim() || 'PROCEED';

  block.textContent = '';

  const widgetContent = document.createElement('div');
  widgetContent.className = 'recharge-widget-content';

  // Header with Lightning Icon
  const header = document.createElement('div');
  header.className = 'recharge-header';
  header.innerHTML = `
    <span class="icon icon-lightning">
      <img src='/icons/thunder-icon.png' aria-hidden="true" width="18" height="30">
    </span>
    <h2>${headingText}</h2>
  `;

  // Form body
  const form = document.createElement('form');
  form.className = 'recharge-form';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = form.querySelector('input').value;
    console.log('Recharge for:', val);
    window.location.href = 'https://www.dishtv.in/dth-recharge.html';
  });

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'recharge-input-wrapper';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholderText;
  input.required = true;
  input.setAttribute('aria-label', placeholderText);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'recharge-proceed-btn';
  button.textContent = buttonText;

  inputWrapper.append(input);
  form.append(inputWrapper, button);
  
  widgetContent.append(header, form);
  block.append(widgetContent);

  // Mark section if it contains banner and widget to allow overlay styling
  const section = block.closest('.section');
  if (section) {
    section.classList.add('banner-with-widget-section');
  }

  decorateIcons(block);
}
