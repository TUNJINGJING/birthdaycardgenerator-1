export default function BirthdayCardLogo({
  size = 32,
  className = ""
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#FF6B6B", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#4ECDC4", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#FFE66D", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="cakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#FFB6D9", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#FF6B9D", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Card Background */}
      <rect
        x="10"
        y="20"
        width="80"
        height="70"
        rx="8"
        fill="url(#cardGradient)"
        opacity="0.9"
      />

      {/* Card Border */}
      <rect
        x="10"
        y="20"
        width="80"
        height="70"
        rx="8"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2"
      />

      {/* Cake Base */}
      <rect
        x="35"
        y="50"
        width="30"
        height="20"
        rx="2"
        fill="url(#cakeGradient)"
      />

      {/* Cake Layer */}
      <rect
        x="38"
        y="45"
        width="24"
        height="8"
        rx="2"
        fill="#FFD93D"
      />

      {/* Candle */}
      <rect
        x="48"
        y="38"
        width="4"
        height="10"
        rx="1"
        fill="#4ECDC4"
      />

      {/* Flame */}
      <ellipse
        cx="50"
        cy="36"
        rx="3"
        ry="4"
        fill="#FF6B6B"
      />
      <ellipse
        cx="50"
        cy="36"
        rx="2"
        ry="3"
        fill="#FFE66D"
      />

      {/* Decorative Stars */}
      <circle cx="25" cy="35" r="2" fill="#FFE66D" opacity="0.8" />
      <circle cx="75" cy="35" r="2" fill="#FFE66D" opacity="0.8" />
      <circle cx="30" cy="75" r="1.5" fill="#4ECDC4" opacity="0.8" />
      <circle cx="70" cy="75" r="1.5" fill="#4ECDC4" opacity="0.8" />
    </svg>
  );
}
