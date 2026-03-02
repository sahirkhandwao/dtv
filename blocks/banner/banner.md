# Carousel Block Guide

The Carousel block implements a high-performance Hero slider using Swiper JS. It supports desktop and mobile-specific background images, text overlays, and specialized components like the "Instant Recharge" card.

## How to Author

To create a banner, insert a table with the following column structure for each slide:

| Desktop Image | Mobile Image | Overlay Content |
| :--- | :--- | :--- |
| ![Desktop BG](https://...) | ![Mobile BG](https://...) | # SLIDE TITLE <br> Slide description text <br> [Button Text](https://...) |
| ![Another BG](https://...) | ![Another Mobile](https://...) | <div class="instant-recharge-card"> <br> <p class="recharge-title">Instant Recharge</p> <br> <input placeholder="Enter Registered Mobile No."> <br> [PROCEED](/recharge) <br> </div> |

### Column Details:

1.  **Desktop Image**: The primary background image used for tablets and desktops.
2.  **Mobile Image**: (Optional) A portrait or cropped version of the image for mobile viewports. If omitted, the Desktop image will be used.
3.  **Overlay Content**: Any Markdown or HTML content to be displayed over the slide. You can include headers, paragraphs, and links (buttons).

### Special Styles
To recreate the **Instant Recharge Card** seen on `dishtv.in`, use the following HTML structure in the "Overlay Content" column:

```html
<div class="instant-recharge-card">
  <p class="recharge-title">Instant Recharge</p>
  <input placeholder="Enter Registered Mobile No. OR VC No.">
  <a href="/recharge" class="button">PROCEED</a>
</div>
```

## Block Variants
- **Default**: standard sliding behavior.
- **Fade**: (Implemented by default) Smooth cross-fade transition between slides.

## Tips for High Performance
- **Image Optimization**: AEM EDS automatically optimizes images added to the table. For best results, use high-quality originals.
- **Lazy Loading**: The Swiper library is loaded only when the block appears on the page, keeping the initial page load fast.
