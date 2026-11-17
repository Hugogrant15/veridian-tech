// Server entry used only at build time (scripts/prerender.mjs): renders one
// route to an HTML string so each page ships as finished HTML.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppRoutes } from "./App";

export { default as site } from "./config/site.json";
export { allRoutes } from "./config/routes";

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
}
