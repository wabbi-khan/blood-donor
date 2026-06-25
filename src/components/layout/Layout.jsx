// ────────────────────────────────────────────────────────────
// LifeDrop — App Layout Wrapper
// ────────────────────────────────────────────────────────────
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => (
  <div className="page-container flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 w-full">{children}</main>
    <Footer />
  </div>
);

export default Layout;
