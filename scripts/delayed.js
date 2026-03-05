import { loadScript, getMetadata } from './aem.js';
import { trackDishtvAnalytics } from './adobeAnalytics.js';

// eslint-disable-next-line import/prefer-default-export
export async function loadThirdParty() {
  const gtmId = getMetadata('gtm-id') || 'GTM-K2RSXSJ';
  const ga4Id = getMetadata('ga4-id') || 'G-RF2E19HSKJ';
  const adsId = getMetadata('ads-id') || 'AW-1003060963';
  const fbPixelId = getMetadata('fb-pixel-id') || '1351209631677206';
  const cleverTapId = getMetadata('clevertap-id') || '848-8Z5-786Z';

  trackDishtvAnalytics('pageLoaded', {
    xdmPageLoad: {
      web: {
        webPageDetails: {
          pageName: getMetadata('meta-analytics-title'),
          channel: getMetadata('meta-analytics-channel'),
        },
      },
    },
  });

  // Load Adobe Launch (Always load unless marked otherwise)
  await loadScript('https://assets.adobedtm.com/1ca45395aadf/01d1bf347f82/launch-1a8e57b7f17e.min.js', { async: true });

  // GA4 / Google Ads (gtag)
  if (ga4Id) {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args) { window.dataLayer.push(args); }
    gtag('js', new Date());
    gtag('config', ga4Id);
    if (adsId) gtag('config', adsId);
    await loadScript(`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`, { async: true });
  }

  // GTM
  if (gtmId) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s); const dl = l !== 'dataLayer' ? `&l=${l}` : ''; j.async = true;
      j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`; f.parentNode.insertBefore(j, f);
    }(window, document, 'script', 'dataLayer', gtmId));
  }

  // CleverTap
  if (cleverTapId) {
    window.clevertap = {
      event: [], profile: [], account: [], onUserLogin: [], region: 'in1', notifications: [], privacy: [],
    };
    window.clevertap.account.push({ id: cleverTapId });
    window.clevertap.privacy.push({ optOut: false });
    window.clevertap.privacy.push({ useIP: false });
    await loadScript('https://d2r1yp2w7bby2u.cloudfront.net/js/clevertap.min.js', { async: true });
  }

  // Facebook Pixel
  if (fbPixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', fbPixelId);
    fbq('track', 'PageView');
    /* eslint-enable */
  }
}

loadThirdParty();
