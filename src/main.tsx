import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Built pages arrive as finished HTML (scripts/prerender.mjs), so React takes
// them over in place. `npm run dev` serves an empty #root and renders from scratch.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
