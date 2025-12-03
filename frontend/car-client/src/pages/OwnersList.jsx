import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import { OwnersAPI } from "../services/owners";
import OwnerEditor from "./OwnerEditor";

export default function OwnersList() {
  const [owners, setOwners] = useState([]);
  const [problem, setProblem] = useState(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const pageSize = 5;
  const [page, setPage] = useState(1);

  async function load() {
    try {
      setProblem(null);
      const data = await OwnersAPI.list();
      setOwners(data);
    } catch (e) {
      setProblem(e.problem || { title: "Load error", detail: String(e) });
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [owners]);

  const [searchField, setSearchField] = useState("all");
  const [searchText, setSearchText] = useState("");
  async function runSearch() {
    const t = searchText.trim();
    if (!t) {
      const data = await OwnersAPI.list();
      setOwners(data);
      return;
    }
    try {
      if (searchField === "email") {
        const data = await OwnersAPI.search({ emailContains: t });
        setOwners(data);
        setProblem(null);
        return;
      }
      if (searchField === "phone") {
        const data = await OwnersAPI.search({ phoneContains: t });
        setOwners(data);
        setProblem(null);
        return;
      }
      if (searchField === "name") {
        const all = await OwnersAPI.list();
        const q = t.toLowerCase();
        const filtered = all.filter((o) =>
          `${o.firstName || ""} ${o.lastName || ""}`.toLowerCase().includes(q)
        );
        setOwners(filtered);
        setProblem(null);
        return;
      }

      const all = await OwnersAPI.list();
      const q = t.toLowerCase();
      const filtered = all.filter(
        (o) =>
          `${o.firstName || ""} ${o.lastName || ""}`
            .toLowerCase()
            .includes(q) ||
          (o.email || "").toLowerCase().includes(q) ||
          (o.phone || "").toLowerCase().includes(q)
      );
      setOwners(filtered);
      setProblem(null);
    } catch (e) {
      setProblem(
        e.problem || { title: "Owner search error", detail: String(e) }
      );
    }
  }

  useEffect(() => {
    const h = setTimeout(() => {
      runSearch();
    }, 250);
    return () => clearTimeout(h);
  }, [searchText, searchField]);

  async function del(id) {
    if (!confirm("Delete this owner? (must have no cars)")) return;
    await OwnersAPI.remove(id);
    load();
  }

  return (
    <>
      <Card
        title="Owners"
        right={
          <div className="stack">
            <Button variant="soft" onClick={load}>
              Refresh
            </Button>
            <Button
              onClick={() => {
                setEditId(null);
                setOpen(true);
              }}
            >
              Add Owner
            </Button>
          </div>
        }
      >
        <ErrorBanner problem={problem} />
        <div className="stack mt-3">
          <select
            className="input"
            style={{ width: 180 }}
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="all">All</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
          <input
            className="input"
            placeholder={
              searchField === "name"
                ? "e.g., Alice or Johnson"
                : searchField === "email"
                ? "e.g., example.com"
                : searchField === "phone"
                ? "e.g., 555"
                : "Search owners..."
            }
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        {owners.length === 0 ? (
          <EmptyState title="No owners" />
        ) : (
          <>
            <Table
              headClassName="thead-blue"
              columns={["Name", "Email", "Phone", "Cars", "Actions"]}
              rows={owners
                .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
                .map((o) => [
                  <Link key="lnk" to={`/owners/${o.id}`}>
                    {o.firstName} {o.lastName}
                  </Link>,
                  o.email,
                  o.phone || "—",
                  o.carCount,
                  <div className="stack" key="act">
                    <Button
                      variant="success"
                      onClick={() => {
                        setEditId(o.id);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => del(o.id)}>
                      Delete
                    </Button>
                  </div>,
                ])}
            />
            <div className="spread mt-3">
              <div style={{ color: "var(--muted)" }}>
                {(() => {
                  const total = owners.length;
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
                  disabled={page * pageSize >= owners.length}
                  onClick={() =>
                    setPage((p) => (p * pageSize >= owners.length ? p : p + 1))
                  }
                >
                  Next
                </Button>
                <Button
                  variant="soft"
                  disabled={page * pageSize >= owners.length}
                  onClick={() =>
                    setPage(Math.max(1, Math.ceil(owners.length / pageSize)))
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
        open={open}
        title={editId ? "Edit Owner" : "Add Owner"}
        onClose={() => setOpen(false)}
      >
        <OwnerEditor
          ownerId={editId}
          onDone={() => {
            setOpen(false);
            load();
          }}
        />
      </Modal>
    </>
  );
}