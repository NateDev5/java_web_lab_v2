export default function Badge({ text, color = "gray" }) {
  const cls = color === "blue" ? "badge badge-blue" : "badge badge-gray";
  return <span className={cls}>{text}</span>;
}
