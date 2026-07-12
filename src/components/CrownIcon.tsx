export function CrownIcon({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M5 16 3 7l5.5 4L12 4l3.5 7L21 7l-2 9H5Zm0 2h14v2H5v-2Z" />
    </svg>
  );
}
