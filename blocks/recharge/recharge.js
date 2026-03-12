import { decorateIcons, loadScript, loadCSS } from '../../scripts/aem.js';

const VALIDATION_API = 'https://bizlogic-api.dishtv.in/API/Subscriber/SubscriberInfo';
const SWAL_JS = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
const SWAL_CSS = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';

async function validateSubscriber(vcmobile) {
  try {
    const token = await window.dishTvTokenPromise;
    const response = await fetch(VALIDATION_API, {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({
        SmsId: '0',
        VcNo: '',
        MobileNo: vcmobile,
        Source: 'cweb',
      }),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    if (!response.ok) return { success: false, message: 'Service unavailable. Please try again later.' };
    const data = await response.json();
    if (data && data.responseCode) {
      return { success: true };
    }
    return { success: false, message: 'Invalid Subscriber ID or Mobile Number.' };
  } catch (error) {
    return { success: false, message: 'Something went wrong. Please check your connection.' };
  }
}

/**
 * decorates the recharge widget
 * @param {Element} block The recharge block element
 */
export default async function decorate(block) {
  const [headingCol, placeholderCol, buttonTextCol] = [...block.children];

  const headingText = 'Instant Recharge';
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
      <img src='/icons/thunder.png' aria-hidden="true" width="18" height="30">
    </span>
    <h2>${headingText}</h2>
  `;

  // Form body
  const form = document.createElement('form');
  form.className = 'recharge-form';

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const vcmobile = input.value.trim();
    if (!vcmobile) return;

    // Load SweetAlert2
    await Promise.all([
      loadScript(SWAL_JS),
      loadCSS(SWAL_CSS),
    ]);

    // Show loading state
    button.disabled = true;
    const originalButtonText = button.textContent;
    button.textContent = 'Verifying...';

    const validation = await validateSubscriber(vcmobile);

    if (validation.success) {
      window.location.href = `https://www.dishtv.in/dth-recharge.html`;
    } else {
      // Reset button
      button.disabled = false;
      button.textContent = originalButtonText;

      // Show error alert
      window.Swal.fire({
        icon: 'error',
        title: 'Validation Failed',
        text: validation.message,
        confirmButtonColor: '#e31837', // DishTV Red
      });
    }
  });

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
