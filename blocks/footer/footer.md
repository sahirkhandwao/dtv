# Footer Block

The Footer block provides a comprehensive, responsive site footer matching the DishTV design. It is typically managed as a **Fragment** and referenced in page metadata.

## Authoring

The footer content is parsed from a document (Fragment) consisting of several sections. The decoration logic identifies areas based on their content:

### 1. Link Columns
Each link group should be a separate section (div) containing:
- A **Heading** (e.g., "PRODUCTS")
- A **List** of links.
*Note: The second column's links will automatically appear in orange accent per DishTV design.*

### 2. Locate Dealer & Social
Create a section containing:
- The text "LOCATE A DEALER" as a heading.
- A paragraph containing the placeholder "Enter Pincode".
- The text "FOLLOW US" as a heading.
- A **List** of social links using icons (fb, youtube, x, instagram).

### 3. Brand & Copyright
Create a section containing:
- The DishTV **Logo** (image).
- The **Copyright** text (e.g., "Copyright © 2026. All Rights Reserved").

### 4. Bottom Legal Links
Create a section at the end with the heading "SITEMAP" (optional but recommended for logic) and a **List** of legal links (Privacy, Terms, etc.). These will be laid out horizontally in the bottom bar.

---

## Example Authoring Document

Below is how the footer fragment should look in your authoring tool (e.g., Word or Google Docs):

| Link Column |
| --- |
| **PRODUCTS** |
| * [DishTV HD](#) |
| * [dishSMRT HUB](#) |
| * [DishTV STB Dongle](#) |

| Link Column |
| --- |
| **PACKS & CHANNELS** |
| * [DishTV Combos](#) |
| * [Single Channels](#) |
| * [Watcho OTT Add-ons](#) |

| Link Column |
| --- |
| **GET HELP** |
| * [Contact Us](#) |
| * [Quick Help](#) |

| Locate Dealer and Social |
| --- |
| **LOCATE A DEALER** |
| Enter Pincode |
| **FOLLOW US** |
| * [:fb:](#) |
| * [:youtube:](#) |
| * [:x:](#) |
| * [:instagram:](#) |

| Brand Notice |
| --- |
| ![DishTV Logo](file:///icons/dishtv-logo.svg) |
| Copyright © 2026. All Rights Reserved |

| Legal Links |
| --- |
| **SITEMAP** |
| * [Sitemap](#) |
| * [Terms & Conditions](#) |
| * [Privacy Policy](#) |
| * [Regulatory](#) |
| * [Trade Partners](#) |
