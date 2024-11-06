import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const Nav = () => {
  const [state, setState] = useContext(UserContext);
  const [current, setCurrent] = useState("");
  const router = useRouter();
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const handleLogout = () => {
    setState(null);
    window.localStorage.removeItem("auth");
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };
  return (
    <nav
      className="d-flex justify-content-between align-items-center text-light py-2"
      style={{ backgroundColor: "blue" }}
    >
      <div>
        <Link href="/" className={`nav-link text-light mx-2`}>
          <img src="/images/logo-no-background.png" width={"150px"} />
        </Link>
      </div>
      <div>
        {state && state.token ? (
          <div className="dropdown mx-2">
            <button
              className="btn dropdown-toggle text-light"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {state && state.user && state.user.name}
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link
                  href="/user/dashboard"
                  className={` dropdown-item ${
                    current === "/user/dashboard" && "active"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/user/profile/update"
                  className={`dropdown-item ${
                    current === "/user/profile/update" && "active"
                  }`}
                >
                  Profile
                </Link>
              </li>
              {state && state.user && state.user.role === "Admin" && (
                <li>
                  <Link
                    href="/admin/dashboard"
                    className={`dropdown-item ${
                      current === "/admin/dashboard" && "active"
                    }`}
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link href="" onClick={handleLogout} className="dropdown-item">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="d-flex justify-content-between">
            <Link
              href="/register"
              className={`nav-link text-light mx-2 ${
                current === "/register" && "active"
              }`}
            >
              Register
            </Link>
            <Link
              href="/login"
              className={`nav-link text-light mx-2 ${
                current === "/login" && "active"
              }`}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
