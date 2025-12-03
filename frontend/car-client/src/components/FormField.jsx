export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  options,
  listId,
  ...rest
}) {
  const id = options?.length
    ? listId ||
      `list-${String(label || Math.random())
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}`
    : undefined;
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <input
        className="input"
        type={type}
        value={value}
        list={id}
        onChange={(e) => onChange?.(e.target.value)}
        {...rest}
      />
      {id && (
        <datalist id={id}>
          {options.map((opt) => (
            <option value={opt} key={opt} />
          ))}
        </datalist>
      )}
    </div>
  );
}
