export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="spread" style={{ marginBottom: 12 }}>
          <strong>{title}</strong>
          <button className="btn btn-soft" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
