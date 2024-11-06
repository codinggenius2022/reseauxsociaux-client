import Footer from "./Footer";
import Nav from "./Nav";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{ height: "100vh" }}
    >
      <div className="d-flex ">
        <Sidebar />
        <main className="flex-1 px-4 py-3" style={{ width: "100vw" }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
