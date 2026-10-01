export function Magnetic({
  children,
  className = "",
  as: Tag = "button",
  ...props
}) {
  function move(e) {
    if (
      !matchMedia("(pointer:fine)").matches ||
      matchMedia("(prefers-reduced-motion:reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.translate =
      (e.clientX - r.left - r.width / 2) * 0.13 +
      "px " +
      (e.clientY - r.top - r.height / 2) * 0.13 +
      "px";
  }
  return (
    <Tag
      {...props}
      className={"magnetic " + className}
      onPointerMove={move}
      onPointerLeave={(e) => {
        e.currentTarget.style.translate = "0px 0px";
      }}
    >
      {children}
    </Tag>
  );
}
