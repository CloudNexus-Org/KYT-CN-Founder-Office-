function Button({ type = "button", variant = "primary", children, onClick }) {
  const base =
    "rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-300 focus-visible:outline-none active:scale-[0.98]";

  const styles =
    variant === "secondary"
      ? "border-2 border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] hover:border-[#00AEEF]"
      : "border-2 border-[#00AEEF] bg-[#000000] text-[#00AEEF] hover:border-[#FFFFFF] hover:text-[#FFFFFF]";

  return (
    <button type={type} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

export default Button;
