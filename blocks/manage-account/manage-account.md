# Manage Account Block

The Manage Account block creates a dual-layer tabbed experience. On desktop, it features a top toggle between "MOBILE APP" and "WEB", and a vertical feature list that updates a central visual. On mobile, the feature list converts into a swipeable carousel.

## Authoring

Create a table with 5 columns. Each row represents a sub-item in the component.

| Outer Tab | Inner Tab Title | Description | Image | CTA Link |
| :--- | :--- | :--- | :--- | :--- |
| MOBILE APP | Recharge your account | Recharge your DishTV account instantly with various payment options. | ![Phone Recharge](https://www.dishtv.in/content/dam/dishtv/images/manage-account/phone-recharge.png) | /recharge |
| MOBILE APP | Easy Login | Login easily using your RMN or VC number with OTP. | ![Phone Login](https://www.dishtv.in/content/dam/dishtv/images/manage-account/phone-login.png) | /login |
| MOBILE APP | Manage Packs | Add or delete channels and manage your subscription packs on the go. | ![Phone Manage](https://www.dishtv.in/content/dam/dishtv/images/manage-account/phone-manage.png) | /my-packs |
| WEB | Instant Recharge | Recharge through our web portal with secure payment gateways. | ![Web Recharge](https://www.dishtv.in/content/dam/dishtv/images/manage-account/web-recharge.png) | /recharge |
| WEB | Account Dashboard | View detailed account statements and transaction history. | ![Web Dashboard](https://www.dishtv.in/content/dam/dishtv/images/manage-account/web-dashboard.png) | /dashboard |

## Technical Behavior

- **Desktop**: 
  - Top level tabs (pills) switch between major categories (Outer Tabs).
  - Vertical list (Inner Tabs) switches between images on the left.
  - Background features a vibrant orange diagonal "splash" behind the visual area.
- **Mobile**:
  - Top level tabs remain as a toggle.
  - The content area becomes a **Swiper Carousel**.
  - Visual and text are stacked vertically for each slide.
  - Features pagination dots for navigation.
