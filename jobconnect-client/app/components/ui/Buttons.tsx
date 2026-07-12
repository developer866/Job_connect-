import React, { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
};

function Button({
  children,
  variant = "primary",
}: ButtonProps) {
  const variants = {
    primary: "bg-green text-white",
    secondary: "bg-lavender text-dark",
    outline: "border border-green text-green bg-transparent",
  };

  return (
    <span
      className={`px-4 py-2 rounded-lg ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export default Button;