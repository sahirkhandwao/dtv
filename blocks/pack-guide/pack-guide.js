export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'pack-guide-container';

  const leftSide = document.createElement('div');
  leftSide.className = 'pack-guide-left';
  
  const rightSide = document.createElement('div');
  rightSide.className = 'pack-guide-right';

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'pack-guide-title-wrapper';
  
  const accordion = document.createElement('div');
  accordion.className = 'pack-guide-accordion';

  rows.forEach((row, i) => {
    const cols = [...row.children];
    if (cols.length < 5) return;

    const [numCol, titleCol, descCol, ctaCol, visualCol] = cols;

    const num = numCol.textContent.trim();
    const titleText = titleCol.textContent.trim();
    const description = descCol.innerHTML;
    const cta = ctaCol.querySelector('a');
    const visual = visualCol.querySelector('picture, img');

    const item = document.createElement('div');
    item.className = 'pack-guide-item';
    if (i === 0) item.classList.add('active');

    const header = document.createElement('div');
    header.className = 'pack-guide-header';
    header.innerHTML = `
      <span class="pack-guide-num">${num}</span>
      <span class="pack-guide-title">${titleText}</span>
      <span class="pack-guide-icon"></span>
    `;

    const body = document.createElement('div');
    body.className = 'pack-guide-body';
    
    const content = document.createElement('div');
    content.className = 'pack-guide-content';
    content.innerHTML = description;
    if (cta) {
      cta.classList.add('pack-guide-cta');
      content.append(cta);
    }
    
    const mobileVisual = document.createElement('div');
    mobileVisual.className = 'pack-guide-mobile-visual';
    if (visual) mobileVisual.append(visual.cloneNode(true));
    
    body.append(content);
    body.append(mobileVisual);
    
    item.append(header);
    item.append(body);
    accordion.append(item);

    const desktopVisual = document.createElement('div');
    desktopVisual.className = `pack-guide-visual-item item-${i}`;
    if (i === 0) desktopVisual.classList.add('active');
    if (visual) desktopVisual.append(visual);
    rightSide.append(desktopVisual);

    header.addEventListener('click', () => {
      const activeItem = accordion.querySelector('.pack-guide-item.active');
      const activeVisual = rightSide.querySelector('.pack-guide-visual-item.active');
      
      if (activeItem && activeItem !== item) {
        activeItem.classList.remove('active');
        activeVisual.classList.remove('active');
      }
      
      item.classList.toggle('active');
      desktopVisual.classList.toggle('active');
    });
  });

  leftSide.append(accordion);
  container.append(leftSide);
  container.append(rightSide);
  block.append(container);
}
