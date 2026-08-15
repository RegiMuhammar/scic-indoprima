import React from "react";

/**
 * GridContainer
 * Parent container enforcing the SCIC Contiguous 1px Outline System.
 * Applies border-t and border-l with 0 gap layout.
 */
interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  withTopBorder?: boolean;
}

export function GridContainer({
  cols = 4,
  children,
  className = "",
  withTopBorder = true,
  ...props
}: GridContainerProps) {
  const colClassMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <div
      className={`grid ${colClassMap[cols] || "grid-cols-1"} gap-0 border-l border-white/10 ${
        withTopBorder ? "border-t" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * GridCell
 * Child cell component matching the contiguous pitch-black outline aesthetic.
 * Automatically applies border-b border-r border-white/10 with pitch black background.
 */
interface GridCellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  className?: string;
  hoverEffect?: boolean;
}

export function GridCell({
  children,
  colSpan,
  className = "",
  hoverEffect = true,
  ...props
}: GridCellProps) {
  const spanClassMap: Record<number, string> = {
    1: "col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4",
  };

  return (
    <div
      className={`p-6 bg-[#000000] border-b border-r border-white/10 rounded-none font-poppins ${
        hoverEffect ? "hover:bg-white/[0.02] transition-colors" : ""
      } ${colSpan ? spanClassMap[colSpan] : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * GridSectionHeader
 * Minimalist header bar for sub-sections in the contiguous grid.
 */
interface GridSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function GridSectionHeader({
  title,
  subtitle,
  action,
  className = "",
}: GridSectionHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 bg-[#000000] border-b border-r border-white/10 font-poppins ${className}`}
    >
      <div>
        <h3 className="text-xs font-medium text-white tracking-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-white/40 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
