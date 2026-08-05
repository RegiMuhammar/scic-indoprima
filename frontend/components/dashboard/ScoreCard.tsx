"use client";

/**
 * ScoreCard Component
 * Reference-matching hierarchy:
 * 1. Title (small dim label font-poppins)
 * 2. Big bold metric value (font-poppins)
 * 3. Trend subtext (^ X% vs last week)
 * Grid layout cell with shared borders, no rounded corners, pitch dark background.
 */

interface ScoreCardProps {
  title: string;
  value: string;
  change: number;
  changePeriod?: string;
  isPositiveGood?: boolean;
  className?: string;
}

export function ScoreCard({
  title,
  value,
  change,
  changePeriod = "vs last week",
  isPositiveGood = true,
  className = "",
}: ScoreCardProps) {
  const isUp = change >= 0;
  const isGood = isPositiveGood ? isUp : !isUp;

  const trendColor = isGood ? "text-emerald-400" : "text-red-400";
  const trendIcon = isUp ? "ˆ" : "ˇ";

  return (
    <div className={`flex flex-col justify-between p-6 bg-[#000000] border-b border-r border-white/10 rounded-none hover:bg-white/[0.02] transition-colors font-poppins ${className}`}>
      {/* 1. Title */}
      <p className="text-white/70 text-xs font-poppins font-medium tracking-tight">
        {title}
      </p>

      {/* 2. Big Main Value */}
      <div className="my-5">
        <span className="text-white text-3xl font-bold font-poppins tracking-tight leading-none">
          {value}
        </span>
      </div>

      {/* 3. Trend Subtext */}
      <div className="flex items-center gap-1.5 text-xs font-poppins">
        <span className={`${trendColor} font-semibold`}>
          {trendIcon} {Math.abs(change)}%
        </span>
        <span className="text-white/40">{changePeriod}</span>
      </div>
    </div>
  );
}
