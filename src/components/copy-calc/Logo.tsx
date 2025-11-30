import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
      {...props}
    >
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5" />
      <rect x="7" y="14" width="10" height="8" rx="2" ry="2" className="fill-accent/20 stroke-accent" />
      <path d="M12 14v8" />
      <path d="M7 18h10" />
    </svg>
  );
}
