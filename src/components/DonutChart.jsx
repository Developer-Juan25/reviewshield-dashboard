import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DonutChart = forwardRef(function DonutChart(
  {
    data,
    totalValue: propTotalValue,
    size = 200,
    strokeWidth = 24,
    animationDuration = 1.2,
    animationDelayPerSegment = 0.08,
    highlightOnHover = true,
    centerContent,
    onSegmentHover,
    className = "",
    ...props
  },
  ref
) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const total =
    propTotalValue || data.reduce((sum, seg) => sum + seg.value, 0);

  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    onSegmentHover?.(hoveredSegment);
  }, [hoveredSegment, onSegmentHover]);

  let cumulativePercentage = 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      onMouseLeave={() => setHoveredSegment(null)}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />

        <AnimatePresence>
          {data.map((segment, index) => {
            if (segment.value === 0) return null;

            const percentage = total === 0 ? 0 : (segment.value / total) * 100;
            const dashArray = `${(percentage / 100) * circumference} ${circumference}`;
            const dashOffset = (cumulativePercentage / 100) * circumference;
            const isActive = hoveredSegment?.label === segment.label;

            cumulativePercentage += percentage;

            return (
              <motion.circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={isActive ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={-dashOffset}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  opacity: { duration: 0.4, delay: index * animationDelayPerSegment },
                }}
                style={{
                  filter: isActive ? `drop-shadow(0 0 8px ${segment.color})` : "none",
                  cursor: highlightOnHover ? "pointer" : "default",
                  transition: "stroke-width 0.2s ease, filter 0.2s ease",
                }}
                onMouseEnter={() => setHoveredSegment(segment)}
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {centerContent && (
        <div
          className="absolute flex flex-col items-center justify-center pointer-events-none"
          style={{
            width: size - strokeWidth * 2.5,
            height: size - strokeWidth * 2.5,
          }}
        >
          {centerContent}
        </div>
      )}
    </div>
  );
});

export { DonutChart };
