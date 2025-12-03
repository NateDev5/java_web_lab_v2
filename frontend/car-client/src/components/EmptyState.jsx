export default function EmptyState({ title = "Nothing here yet", detail }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
      {detail && <div style={{ color: "#6b7280", marginTop: 8 }}>{detail}</div>}
    </div>
  );
}