import { useEffect, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import { CarsAPI } from "../services/cars";
import { OwnersAPI } from "../services/owners";
import CarEditor from "./CarEditor";

export default function CarsList() {
  const [cars, setCars] = useState([]);
  const [problem, setProblem] = useState(null);
  const [openEditor, setOpenEditor] = useState(false);
  const [editId, setEditId] = useState(null);
  const [owners, setOwners] = useState([]);
  const pageSize = 5;
  const [page, setPage] = useState(1);

  async function load() {
    try {
      setProblem(null);
      const [cs, os] = await Promise.all([CarsAPI.list(), OwnersAPI.list()]);
      setCars(cs);
      setOwners(os);
    } catch (e) {
      setProblem(e.problem || { title: "Load error", detail: String(e) });
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [cars]);

  function ownerName(o) {
    return o ? `${o.firstName} ${o.lastName}` : "—";
  }
  async function del(id) {
    if (!confirm("Delete this car?")) return;
    await CarsAPI.remove(id);
    load();
  }

  const [searchField, setSearchField] = useState("all");
  const [searchText, setSearchText] = useState("");

  function parseRange(text) {
    const t = String(text || "").trim();
    const range = t.match(/^(\d{1,6})\s*-\s*(\d{1,6})$/);
    if (range) {
      const a = Number(range[1]);
      const b = Number(range[2]);
      return { min: Math.min(a, b), max: Math.max(a, b) };
    }
    const ge = t.match(/^>=\s*(\d{1,6})$/);
    if (ge) return { min: Number(ge[1]) };
    const le = t.match(/^<=\s*(\d{1,6})$/);
    if (le) return { max: Number(le[1]) };
    const n = Number(t);
    if (!Number.isNaN(n)) return { min: n, max: n };
    return {};
  }

  async function runSearch(e) {
    e?.preventDefault?.();
    const t = searchText.trim();
    const q = {};
    if (!t) {
      const data = await CarsAPI.list();
      setCars(data);
      return;
    }
    if (searchField === "all") {
      try {
        const all = await CarsAPI.list();
        const tLower = t.toLowerCase();
        const range = parseRange(t);
        const hasRange = range.min != null || range.max != null;
        const filtered = all.filter((c) => {
          const brand = (c.brand || "").toLowerCase();
          const model = (c.model || "").toLowerCase();
          const color = (c.color || "").toLowerCase();
          const reg = (c.registrationNumber || "").toLowerCase();
          const ownerFull = `${c.owner?.firstName || ""} ${
            c.owner?.lastName || ""
          }`.toLowerCase();
          const textMatch =
            brand.includes(tLower) ||
            model.includes(tLower) ||
            color.includes(tLower) ||
            reg.includes(tLower) ||
            ownerFull.includes(tLower);
          if (textMatch) return true;

          if (hasRange) {
            const y = Number(c.modelYear) || 0;
            const p = Number(c.price) || 0;
            const min = range.min ?? -Infinity;
            const max = range.max ?? Infinity;
            return (y >= min && y <= max) || (p >= min && p <= max);
          }
          const n = Number(t);
          if (!Number.isNaN(n)) {
            return c.modelYear === n || c.price === n;
          }
          return false;
        });
        setCars(filtered);
        setProblem(null);
      } catch (e2) {
        setProblem(e2.problem || { title: "Search error", detail: String(e2) });
      }
      return;
    }
    switch (searchField) {
      case "brand":
        q.brand = t;
        break;
      case "owner": {
        const tLower = t.toLowerCase();

        const matches = owners.filter((o) =>
          `${o.firstName || ""} ${o.lastName || ""}`
            .toLowerCase()
            .includes(tLower)
        );
        if (matches.length === 1) {
          q.ownerId = matches[0].id;
        }
        break;
      }
      case "color":
        q.color = t;
        break;
      case "reg":
        q.registrationContains = t;
        break;
      case "year": {
        const { min, max } = parseRange(t);
        if (min != null) q.minYear = min;
        if (max != null) q.maxYear = max;
        break;
      }
      case "price": {
        const { min, max } = parseRange(t);
        if (min != null) q.minPrice = min;
        if (max != null) q.maxPrice = max;
        break;
      }
      default:
        q.brand = t;
    }
    
    try {
      const data = await CarsAPI.search(q);
      setCars(data);
      setProblem(null);
    } catch (e) {
      try {
        const all = await CarsAPI.list();
        const tLower = t.toLowerCase();
        let filtered = all;
        switch (searchField) {
          case "brand":
            filtered = all.filter((c) =>
              (c.brand || "").toLowerCase().includes(tLower)
            );
            break;
          case "owner":
            filtered = all.filter((c) =>
              ((c.owner?.firstName || "") + " " + (c.owner?.lastName || ""))
                .toLowerCase()
                .includes(tLower)
            );
            break;
          case "color":
            filtered = all.filter((c) =>
              (c.color || "").toLowerCase().includes(tLower)
            );
            break;
          case "reg":
            filtered = all.filter((c) =>
              (c.registrationNumber || "").toLowerCase().includes(tLower)
            );
            break;
          case "year": {
            const { min, max } = parseRange(t);
            filtered = all.filter((c) => {
              const y = Number(c.modelYear) || 0;
              return (min == null || y >= min) && (max == null || y <= max);
            });
            break;
          }
          case "price": {
            const { min, max } = parseRange(t);
            filtered = all.filter((c) => {
              const p = Number(c.price) || 0;
              return (min == null || p >= min) && (max == null || p <= max);
            });
            break;
          }
          default:
            filtered = all;
        }
        setCars(filtered);
        console.warn("Server search failed; used client-side fallback.", e);
        setProblem(null);
      } catch (fallbackError) {
        setProblem(e.problem || { title: "Search error", detail: String(e) });
      }
    }
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      runSearch();
    }, 250);
    return () => clearTimeout(handle);
  }, [searchText, searchField]);

  function textColorForBg(bg) {
    const c = String(bg || "")
      .toLowerCase()
      .trim();
    const lightKeywords = [
      "white",
      "yellow",
      "silver",
      "beige",
      "ivory",
      "khaki",
      "gold",
      "gainsboro",
      "whitesmoke",
      "light",
    ];

    if (c.startsWith("#")) {
      const hex =
        c.length === 4 ? `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}` : c;
      const r = parseInt(hex.substring(1, 3), 16) || 0;
      const g = parseInt(hex.substring(3, 5), 16) || 0;
      const b = parseInt(hex.substring(5, 7), 16) || 0;
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 150 ? "#111827" : "#fff";
    }

    if (c.startsWith("rgb")) {
      const nums = c
        .replace(/rgba?\(/, "")
        .replace(/\)/, "")
        .split(",")
        .map((n) => parseFloat(n.trim()));
      const [r = 0, g = 0, b = 0] = nums;
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 150 ? "#111827" : "#fff";
    }
    if (lightKeywords.some((k) => c.includes(k))) return "#111827";
    return "#fff";
  }

  return (
    <>
      <Card
        title="Cars"
        right={
          <div className="stack">
            <Button variant="soft" onClick={load}>
              Refresh
            </Button>
            <Button
              onClick={() => {
                setEditId(null);
                setOpenEditor(true);
              }}
            >
              Add Car
            </Button>
          </div>
        }
      >
        <ErrorBanner problem={problem} />
        <div className="stack mt-3">
          <select
            className="input"
            style={{ width: 160 }}
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="all">All</option>
            <option value="brand">Brand</option>
            <option value="owner">Owner</option>
            <option value="color">Color</option>
            <option value="year">Year</option>
            <option value="price">Price</option>
            <option value="reg">Registration</option>
          </select>
          <input
            className="input"
            placeholder={
              searchField === "all"
                ? "Search cars..."
                : searchField === "brand"
                ? "e.g., Toyota"
                : searchField === "owner"
                ? "e.g., Alice or Johnson"
                : searchField === "color"
                ? "e.g., Red"
                : searchField === "year"
                ? "e.g., 2020 or 2018-2022 or >=2019"
                : searchField === "price"
                ? "e.g., 20000 or 15000-25000 or <=30000"
                : "e.g., ABC-1234"
            }
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        {cars.length === 0 ? (
          <EmptyState
            title="No cars"
            detail="Add one or run the Spring Boot seed."
          />
        ) : (
          <>
            <Table
              headClassName="thead-blue"
              columns={[
                "Brand",
                "Model",
                "Color",
                "Year",
                "Price",
                "Owner",
                "Actions",
              ]}
              rows={cars
                .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
                .map((c) => [
                  c.brand,
                  c.model,
                  <span
                    key="color"
                    className="badge"
                    style={{
                      background: c.color,
                      color: textColorForBg(c.color),
                    }}
                  >
                    {c.color}
                  </span>,
                  c.modelYear,
                  `$${c.price.toLocaleString()}`,
                  ownerName(c.owner),
                  <div className="stack" key="act">
                    <Button
                      variant="success"
                      onClick={() => {
                        setEditId(c.id);
                        setOpenEditor(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => del(c.id)}>
                      Delete
                    </Button>
                  </div>,
                ])}
            />
            <div className="spread mt-3">
              <div style={{ color: "var(--muted)" }}>
                {(() => {
                  const total = cars.length;
                  const start = (page - 1) * pageSize + 1;
                  const end = Math.min(total, page * pageSize);
                  return `Showing ${start}–${end} of ${total}`;
                })()}
              </div>
              <div className="stack">
                <Button
                  variant="soft"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  First
                </Button>
                <Button
                  variant="soft"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <Button
                  variant="soft"
                  disabled={page * pageSize >= cars.length}
                  onClick={() =>
                    setPage((p) => (p * pageSize >= cars.length ? p : p + 1))
                  }
                >
                    Next
                </Button>
                <Button
                  variant="soft"
                  disabled={page * pageSize >= cars.length}
                  onClick={() =>
                    setPage(Math.max(1, Math.ceil(cars.length / pageSize)))
                  }
                >
                    Last
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
      <Modal
        open={openEditor}
        title={editId ? "Edit Car" : "Add Car"}
        onClose={() => setOpenEditor(false)}
      >
        <CarEditor
          carId={editId}
          onDone={() => {
            setOpenEditor(false);
            load();
          }}
        />
      </Modal>
    </>
  );
}
