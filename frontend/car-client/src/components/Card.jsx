export default function Card({ title, right, children }) {
  return (
    <div className="card">
      {(title || right) && (
        <div className="card-title">
          <div>{title}</div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
