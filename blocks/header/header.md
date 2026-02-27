# Header Block Authoring Guide

The Header block provides the sitewide navigation for the project. In the AEM EDS architecture, the header is generated automatically by fetching a specific navigation document.

## How to Author the Header

Instead of adding a block to a specific page, the header relies on a central navigation document, usually located at:
**`/nav`** (e.g. `https://docs.google.com/document/d/.../edit` -> mapped to `/nav`)

Inside the `/nav` document, author exactly **four sections** separated by standard paragraphs or horizontal lines, representing the four pillars of the navigation:

### Section 1: Top Bar
Create a bulleted list for the very top utility links and language selection.
* [Consumer Corner](/consumer-area)
* Language
    * [English](/en)
    * [Hindi](/hi)

### Section 2: Brand/Logo
Place the main logo image and make it a link to the homepage.
* [![DishTV Logo](https://main--dtv--sahirkhandwao.hlx.live/media_logo.png)](/)

### Section 3: Main Navigation Sections
Create a nested bulleted list to define the main menus and their dropdown items.
* Products
    * [DTH Connection](/dth)
    * [Smart Devices](/smart)
* Modify My Pack
    * [Upgrade Pack](/upgrade)
* Get Help
    * [Contact Us](/support)
* Services
    * [Active Services](/services)
* Get a Connection
    * [New Connection](/new)

### Section 4: Tools (Right-side Actions)
Create a list with call-to-action buttons or icons (like Recharge or Profile).
* **[Instant Recharge](/recharge)**
* ![](/icons/user.svg) *(Note: The component will automatically inject a user icon here if it finds a generic list item or span)*

## Best Practices
- Keep dropdown lists to a single level for usability.
- Use bold text `**[Link]**` in Section 4 to trigger the red text styling.
- Do not combine these into one giant list; separate them into distinct list blocks in the document so the code can process them sequentially (`topbar` -> `brand` -> `sections` -> `tools`).
