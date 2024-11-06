import Link from "next/link";

const Sidebar = () => {
  return (
    <ul
      className="py-3 px-3 text-primary"
      style={{
        backgroundColor: "lightgrey",
        width: "150px",
        fontSize: "18px",
        height: "100vh",
      }}
    >
      <li style={{ listStyleType: "none", marginBottom: "3px" }}>
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          href="/admin/dashboard"
        >
          Dashboard
        </Link>
      </li>
      <li style={{ listStyleType: "none", marginBottom: "3px" }}>
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          href="/admin/users"
        >
          Users
        </Link>
      </li>
      <li style={{ listStyleType: "none", marginBottom: "3px" }}>
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          href="/admin/posts"
        >
          Posts
        </Link>
      </li>
    </ul>
  );
};

export default Sidebar;
