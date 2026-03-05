# Content Slider Block

The Content Slider block creates a synchronized dual-carousel experience. On desktop, a large preview on the left is controlled by a grid of smaller cards on the right. On mobile, the large preview is hidden, and the cards become a single swipeable row.

## Authoring

The first row is reserved for the section heading. Following rows contain individual program details.

| Tab Name | Title | Meta | Preview Image | Card Image | Channel Logo | Preview Link | Add Link |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **LIVE TV** | **Apollena** | I 30 mins | ![Preview](img) | ![Card](img) | ![Logo](img) | [Watch](/preview) | [Add](/add) |
| **LIVE TV** | **TV Show 2** | I 60 mins | ![Preview](img) | ![Card](img) | ![Logo](img) | [Watch](/preview) | [Add](/add) |
| **ACTIVE SERVICES** | **Cooking Master** | I 15 mins | ![Preview](img) | ![Card](img) | ![Logo](img) | [Watch](/preview) | [Add](/add) |

### Table Columns Breakdown

1.  **Tab Name**: Groups items into tabs (e.g., LIVE TV, ACTIVE SERVICES).
2.  **Title**: The name of the show or program.
3.  **Meta**: Additional info, typically duration (e.g., "I 30 mins").
4.  **Preview Image**: The large visual shown on the left (Desktop).
5.  **Card Image**: The smaller visual shown in the right-side grid.
6.  **Channel Logo**: Small overlay logo (e.g., Colors, StarPlus).
7.  **Preview Link**: URL for the "WATCH PREVIEW" overlay button.
8.  **Add Link**: URL for the "ADD CHANNEL" overlay button.

## Behavior

- **Desktop**: 
  - Split view: 60% Preview, 40% Grid.
  - Interaction: Hovering a card shows overlay buttons; Swiping/Clicking a card updates the preview.
- **Mobile**:
  - Simplified view: Large preview is hidden.
  - Cards are shown in a single horizontal swipeable row.
