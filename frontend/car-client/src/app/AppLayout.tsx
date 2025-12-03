import { Link, useLocation } from "react-router-dom";

export default function AppLayout({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Car Admin</div>
        <nav className="nav">
          <Link to="/" style={pathname === "/" ? { fontWeight: 700 } : {}}>
            Cars
          </Link>
          <Link
            to="/owners"
            style={pathname.startsWith("/owners") ? { fontWeight: 700 } : {}}
          >
            Owners
          </Link>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
