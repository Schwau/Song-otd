export default function Logo({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      {/* outer ring */}
      <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.55)" strokeWidth="3" />

      {/* play triangle */}
      <path
        d="M28 22 L44 32 L28 42 Z"
        fill="rgba(255,255,255,0.85)"
      />

      {/* small “daily dot” */}
      <circle cx="49" cy="18" r="5" fill="rgba(16,185,129,0.95)" />
    </svg>
  );
}
