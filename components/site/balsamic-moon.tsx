export function BalsamicMoon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <path
        d="M16 5 A11 11 0 0 0 16 27 A4.2 11 0 0 1 16 5 Z"
        fill="currentColor"
      />
    </svg>
  );
}
