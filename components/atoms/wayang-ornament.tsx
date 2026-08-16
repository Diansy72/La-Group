"use client"

export function WayangCornerTopLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldGradTL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5C040" />
          <stop offset="50%" stopColor="#E5A520" />
          <stop offset="100%" stopColor="#C48B18" />
        </linearGradient>
      </defs>
      <path
        d="M2 70 C2 35 10 15 25 8 C30 6 36 5 42 6 C38 10 34 16 32 24 C30 32 30 40 32 46 C28 44 24 40 20 34 C16 28 14 22 14 16"
        stroke="url(#goldGradTL)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M6 60 C8 40 14 22 30 12 C34 10 38 10 40 14 C42 18 38 24 34 26 C30 28 26 26 26 22"
        stroke="url(#goldGradTL)"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M10 55 Q16 40 28 32 Q22 38 18 50 Z"
        fill="url(#goldGradTL)"
        opacity="0.15"
      />
      <circle cx="22" cy="18" r="1.5" fill="#E5A520" opacity="0.7" />
      <circle cx="36" cy="10" r="1" fill="#F5C040" opacity="0.5" />
      <circle cx="14" cy="40" r="1" fill="#E5A520" opacity="0.5" />
    </svg>
  )
}

export function WayangCornerTopRight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "scaleX(-1)" }}
    >
      <defs>
        <linearGradient id="goldGradTR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5C040" />
          <stop offset="50%" stopColor="#E5A520" />
          <stop offset="100%" stopColor="#C48B18" />
        </linearGradient>
      </defs>
      <path
        d="M2 70 C2 35 10 15 25 8 C30 6 36 5 42 6 C38 10 34 16 32 24 C30 32 30 40 32 46 C28 44 24 40 20 34 C16 28 14 22 14 16"
        stroke="url(#goldGradTR)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M6 60 C8 40 14 22 30 12 C34 10 38 10 40 14 C42 18 38 24 34 26 C30 28 26 26 26 22"
        stroke="url(#goldGradTR)"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M10 55 Q16 40 28 32 Q22 38 18 50 Z"
        fill="url(#goldGradTR)"
        opacity="0.15"
      />
      <circle cx="22" cy="18" r="1.5" fill="#E5A520" opacity="0.7" />
      <circle cx="36" cy="10" r="1" fill="#F5C040" opacity="0.5" />
      <circle cx="14" cy="40" r="1" fill="#E5A520" opacity="0.5" />
    </svg>
  )
}

export function WayangCornerBottomLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "scaleY(-1)" }}
    >
      <defs>
        <linearGradient id="goldGradBL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5C040" />
          <stop offset="50%" stopColor="#E5A520" />
          <stop offset="100%" stopColor="#C48B18" />
        </linearGradient>
      </defs>
      <path
        d="M2 70 C2 35 10 15 25 8 C30 6 36 5 42 6 C38 10 34 16 32 24 C30 32 30 40 32 46 C28 44 24 40 20 34 C16 28 14 22 14 16"
        stroke="url(#goldGradBL)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M6 60 C8 40 14 22 30 12 C34 10 38 10 40 14 C42 18 38 24 34 26 C30 28 26 26 26 22"
        stroke="url(#goldGradBL)"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M10 55 Q16 40 28 32 Q22 38 18 50 Z"
        fill="url(#goldGradBL)"
        opacity="0.15"
      />
      <circle cx="22" cy="18" r="1.5" fill="#E5A520" opacity="0.7" />
      <circle cx="36" cy="10" r="1" fill="#F5C040" opacity="0.5" />
    </svg>
  )
}

export function WayangCornerBottomRight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "scale(-1, -1)" }}
    >
      <defs>
        <linearGradient id="goldGradBR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5C040" />
          <stop offset="50%" stopColor="#E5A520" />
          <stop offset="100%" stopColor="#C48B18" />
        </linearGradient>
      </defs>
      <path
        d="M2 70 C2 35 10 15 25 8 C30 6 36 5 42 6 C38 10 34 16 32 24 C30 32 30 40 32 46 C28 44 24 40 20 34 C16 28 14 22 14 16"
        stroke="url(#goldGradBR)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M6 60 C8 40 14 22 30 12 C34 10 38 10 40 14 C42 18 38 24 34 26 C30 28 26 26 26 22"
        stroke="url(#goldGradBR)"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M10 55 Q16 40 28 32 Q22 38 18 50 Z"
        fill="url(#goldGradBR)"
        opacity="0.15"
      />
      <circle cx="22" cy="18" r="1.5" fill="#E5A520" opacity="0.7" />
      <circle cx="36" cy="10" r="1" fill="#F5C040" opacity="0.5" />
    </svg>
  )
}

export function WayangDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="20"
      viewBox="0 0 120 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="10"
        y1="10"
        x2="45"
        y2="10"
        stroke="#D1D5DB"
        strokeWidth="1"
      />
      <rect
        x="57"
        y="7"
        width="6"
        height="6"
        transform="rotate(45 60 10)"
        fill="#9CA3AF"
      />

      <line
        x1="75"
        y1="10"
        x2="110"
        y2="10"
        stroke="#D1D5DB"
        strokeWidth="1"
      />
    </svg>
  );
}

export function WayangTopFrame({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="24"
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldGradFrame" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#C48B18" stopOpacity="0.2" />
          <stop offset="30%" stopColor="#E5A520" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#F5C040" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#E5A520" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C48B18" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M0 22 C50 22 80 4 120 4 C160 4 180 12 200 12 C220 12 240 4 280 4 C320 4 350 22 400 22"
        stroke="url(#goldGradFrame)"
        strokeWidth="1"
        fill="none"
      />
      <path d="M195 8 L200 2 L205 8 L200 14 Z" fill="#E5A520" opacity="0.5" />
    </svg>
  )
}

export function BatikPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="batikPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="8" fill="#E5A520" opacity="0.03" />
          <circle cx="75" cy="25" r="6" fill="#E5A520" opacity="0.02" />
          <circle cx="50" cy="50" r="7" fill="#E5A520" opacity="0.03" />
          <circle cx="25" cy="75" r="5" fill="#E5A520" opacity="0.02" />
          <circle cx="75" cy="75" r="8" fill="#E5A520" opacity="0.03" />
          <path d="M10 40 Q30 30 50 40 T90 40" stroke="#E5A520" strokeWidth="0.5" opacity="0.02" fill="none" />
          <path d="M10 60 Q30 70 50 60 T90 60" stroke="#E5A520" strokeWidth="0.5" opacity="0.02" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#batikPattern)" />
    </svg>
  )
}

export function DecorativeLineTop({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="2"
      viewBox="0 0 200 2"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="linGradTop" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#E5A520" stopOpacity="0" />
          <stop offset="20%" stopColor="#E5A520" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#E5A520" stopOpacity="0.6" />
          <stop offset="80%" stopColor="#E5A520" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E5A520" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="1" x2="200" y2="1" stroke="url(#linGradTop)" strokeWidth="1" />
    </svg>
  )
}

export function WayangBorder({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="4"
      viewBox="0 0 200 4"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="borderGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#E5A520" stopOpacity="0" />
          <stop offset="15%" stopColor="#E5A520" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#E5A520" stopOpacity="0.8" />
          <stop offset="85%" stopColor="#E5A520" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E5A520" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="4" fill="url(#borderGrad)" opacity="0.5" />
    </svg>
  )
}

export function SmallOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="smallOrnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5C040" />
          <stop offset="50%" stopColor="#E5A520" />
          <stop offset="100%" stopColor="#C48B18" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" stroke="url(#smallOrnGrad)" strokeWidth="0.8" opacity="0.5" fill="none" />
      <path d="M16 4 L20 12 L28 12 L22 18 L24 26 L16 21 L8 26 L10 18 L4 12 L12 12 Z" fill="url(#smallOrnGrad)" opacity="0.4" />
    </svg>
  )
}
export function OrnamentCorner({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      {/* garis utama */}
      <path
        d="M10 110V35C10 20 20 10 35 10H110"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* aksen diamond */}
      <rect
        x="28"
        y="28"
        width="12"
        height="12"
        transform="rotate(45 34 34)"
        fill="currentColor"
      />

      {/* aksen kecil */}
      <circle cx="56" cy="10" r="3" fill="currentColor" />
      <circle cx="10" cy="56" r="3" fill="currentColor" />

      {/* garis dekoratif */}
      <path
        d="M50 18H90"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M18 50V90"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}