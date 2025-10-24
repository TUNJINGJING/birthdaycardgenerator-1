export default function CardPlaceholder({
  variant = "warm",
  className = ""
}: {
  variant?: "warm" | "funny" | "formal" | "cute";
  className?: string;
}) {
  const variants = {
    warm: {
      bg: "#FFF5E6",
      accent: "#FF6B6B",
      secondary: "#FFD93D",
      pattern: (
        <>
          <circle cx="100" cy="80" r="40" fill="#FF6B6B" opacity="0.3" />
          <circle cx="200" cy="100" r="30" fill="#FFD93D" opacity="0.3" />
          <path d="M 150 120 Q 170 140 150 160 Q 130 140 150 120" fill="#FF6B6B" opacity="0.5" />
        </>
      )
    },
    funny: {
      bg: "#FFF9C4",
      accent: "#FF9800",
      secondary: "#9C27B0",
      pattern: (
        <>
          <circle cx="80" cy="90" r="15" fill="#FF9800" />
          <circle cx="220" cy="90" r="15" fill="#FF9800" />
          <path d="M 100 130 Q 150 160 200 130" stroke="#9C27B0" strokeWidth="5" fill="none" />
          <text x="150" y="60" textAnchor="middle" fontSize="30">🎉</text>
        </>
      )
    },
    formal: {
      bg: "#F5F5F5",
      accent: "#1A237E",
      secondary: "#C5CAE9",
      pattern: (
        <>
          <rect x="50" y="50" width="200" height="150" rx="10" fill="none" stroke="#1A237E" strokeWidth="2" />
          <line x1="50" y1="90" x2="250" y2="90" stroke="#C5CAE9" strokeWidth="1" />
          <circle cx="150" cy="130" r="20" fill="#1A237E" opacity="0.2" />
        </>
      )
    },
    cute: {
      bg: "#FCE4EC",
      accent: "#F06292",
      secondary: "#FFB2B2",
      pattern: (
        <>
          <circle cx="150" cy="100" r="40" fill="#F06292" opacity="0.3" />
          <path d="M 130 90 Q 150 70 170 90" fill="#FFB2B2" />
          <circle cx="140" cy="95" r="5" fill="#F06292" />
          <circle cx="160" cy="95" r="5" fill="#F06292" />
          <path d="M 135 110 Q 150 120 165 110" stroke="#F06292" strokeWidth="2" fill="none" />
        </>
      )
    }
  };

  const { bg, accent, secondary, pattern } = variants[variant];

  return (
    <svg
      viewBox="0 0 300 250"
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <defs>
        <linearGradient id={`grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: bg, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: secondary, stopOpacity: 0.5 }} />
        </linearGradient>
      </defs>

      {/* Card Background */}
      <rect width="300" height="250" rx="15" fill={`url(#grad-${variant})`} />

      {/* Border */}
      <rect
        x="10"
        y="10"
        width="280"
        height="230"
        rx="10"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        opacity="0.3"
      />

      {/* Pattern */}
      {pattern}

      {/* Text */}
      <text
        x="150"
        y="220"
        textAnchor="middle"
        fill={accent}
        fontSize="18"
        fontWeight="bold"
        opacity="0.7"
      >
        Birthday Card
      </text>
    </svg>
  );
}
