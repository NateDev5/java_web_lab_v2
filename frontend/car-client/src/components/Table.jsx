export default function Table({
  title,
  columns = [],
  rows = [],
  headClassName = "",
}) {
  return (
    <div className="card">
      {title && <div className="card-title">{title}</div>}
      <div className="table-wrap">
        <table>
          <thead className={headClassName}>
            <tr>
              {columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
