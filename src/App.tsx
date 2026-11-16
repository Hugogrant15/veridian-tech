import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FloatingContact } from "./components/FloatingContact";
import { usePageEffects } from "./hooks/usePageEffects";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Work from "./pages/Work";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

function Layout() {
  usePageEffects();
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-pearl">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}

/** The route table, shared by the browser (below) and the build-time prerender (entry-server.tsx). */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/work" element={<Work />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
