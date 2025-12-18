# Juxin Manufacturing Website – Frontend (V1)

Frontend for the Juxin Manufacturing independent website (V1).

This V1 focuses on building a realistic product browsing and inquiry flow, with clean component separation and extensibility for future backend integration.

---

## Tech Stack
- React
- Vite
- React Router
- Axios
- ESLint + Prettier
- tailwindcss

---

## Features (V1)
- Product listing page with category-based filtering
- Product detail pages with variant (e.g. color) selection
- Interactive product gallery:
  - Image carousel with navigation controls
  - Thumbnail gallery and image index indicator
  - Desktop hover zoom and mobile full-screen preview
- Inquiry workflow with product context:
  - Inquiry form is pre-filled with selected product and variant information
- Responsive navigation bar
- Minimum viable content structure for a real B2B product website
- Mock data support to enable rapid front-end development before backend integration
- Recommondation

---

## Project Structure
```txt
src/
  app/            # App entry, router, providers
  pages/          # Page-level components
  components/     # Reusable UI components
  services/       # API service layer
  hooks/          # Custom React hooks
  data/           # Mock data (V1)
  assets/         # Images and icons
  styles/         # Global styles

