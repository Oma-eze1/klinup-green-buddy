import { cn } from "@/lib/utils";

interface KlinUpLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const KlinUpLogo = ({ className, size = "md" }: KlinUpLogoProps) => {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizes[size])}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          <circle cx="20" cy="20" r="18" className="fill-primary" />
          <path
            d="M12 20C12 15.58 15.58 12 20 12C24.42 12 28 15.58 28 20"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M28 20C28 24.42 24.42 28 20 28C15.58 28 12 24.42 12 20"
            className="stroke-accent"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M20 16V24M16 20L20 16L24 20"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        className={cn(
          "font-bold tracking-tight text-foreground",
          size === "sm" && "text-xl",
          size === "md" && "text-2xl",
          size === "lg" && "text-3xl"
        )}
      >
        Klin<span className="text-primary">Up</span>
      </span>
    </div>
  );
};
