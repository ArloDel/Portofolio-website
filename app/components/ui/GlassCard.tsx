import React from "react";

export type GlassCardElement = HTMLDivElement & HTMLElement;

export interface GlassCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "section" | "article" | "aside" | "nav";
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hover = false,
  as: Component = "div",
  ...rest
}) => {
  return (
    <Component
      className={`glass rounded-2xl ${
        hover
          ? "transition-colors duration-300 hover:border-fill/[0.16] hover:bg-fill/[0.06]"
          : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default GlassCard;
