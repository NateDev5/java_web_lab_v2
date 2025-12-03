export default function ErrorBanner({ error, problem }) {
  const p = problem ?? error;
  if (!p) return null;
  const title = typeof p === "object" ? p.title || "Error" : null;
  const detail =
    typeof p === "string"
      ? p
      : p?.detail || p?.message || "Something went wrong.";
  const list = Array.isArray(p?.errors) ? p.errors : [];
  return (
    <div className="error">
      {title ? <strong>{title}</strong> : null}
      <div className="mt-2">{detail}</div>
      {!!list.length && (
        <ul className="mt-2">
          {list.map((e, i) => (
            <li key={i}>
              {typeof e === "string"
                ? e
                : `${e.field ?? "field"}: ${e.message ?? ""}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}