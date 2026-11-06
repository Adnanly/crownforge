import { cn } from "../../../lib/utils.js";

const baseClass =
  "inline-flex w-max max-w-full flex-none touch-manipulation items-center justify-center gap-2 whitespace-nowrap font-inter leading-none outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ggg-bg focus-visible:ring-ggg-accent";

const variantClass = {
  primary:
    "rounded-ggg bg-ggg-accent px-7 py-[13px] text-[14px] font-semibold tracking-[0.01em] text-[#0a0a0a] hover:-translate-y-px hover:brightness-105 hover:shadow-[0_8px_24px_var(--ggg-accent-glow)] max-[480px]:px-5",
  ghost:
    "rounded-ggg border border-white/[0.14] bg-transparent px-[26px] py-3 text-[14px] font-medium tracking-[0.01em] text-ggg-text hover:border-white/[0.3] hover:bg-white/[0.04] max-[480px]:px-5",
  pill:
    "rounded-full bg-ggg-accent px-4 py-2 font-inter text-[13px] font-semibold tracking-[0.01em] text-[#0a0a0a] hover:brightness-105 sm:px-5 sm:py-[9px]",
};

const Button = ({
  as: Component = "button",
  variant = "primary",
  className,
  children,
  type,
  ...rest
}) => {
  const props = Component === "button" ? { type: type ?? "button", ...rest } : rest;

  return (
    <Component className={cn(baseClass, variantClass[variant], className)} {...props}>
      {children}
    </Component>
  );
};

export default Button;
