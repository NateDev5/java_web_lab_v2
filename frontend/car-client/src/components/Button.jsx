export default function Button({
  variant = "primary",
  className = "",
  ...props
}) {
  const map = {
    primary: "btn btn-primary",
    outline: "btn btn-outline",
    soft: "btn btn-soft",
    danger: "btn btn-danger",
    success: "btn btn-success",
  };
  return <button className={`${map[variant]} ${className}`} {...props} />;
}
