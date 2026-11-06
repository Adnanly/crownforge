import Header from "./Header/Header.jsx";
import SiteFooter from "./Footer/SiteFooter.jsx";

const PublicPageShell = ({ children }) => (
  <div className="min-h-screen isolate overflow-x-hidden bg-ggg-bg text-ggg-text font-medium">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-ggg focus:top-3 focus:z-[300] focus:bg-ggg-accent focus:px-4 focus:py-2 focus:text-[#0a0a0a]"
    >
      Skip to content
    </a>
    <Header />
    {children}
    <SiteFooter />
  </div>
);

export default PublicPageShell;